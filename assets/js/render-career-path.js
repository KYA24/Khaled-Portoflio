function certificateVisual(certificate, path) {
  return `<a class="visual-card" href="certificates.html#${encodeURIComponent(certificate.id)}">
    <div class="visual-frame">
      <img class="visual-img" src="${escapeHTML(certificate.image)}" alt="${escapeHTML(t(certificate.imageAlt || certificate.name))}" loading="lazy" data-full-image onerror="this.closest('.visual-card').remove()">
      <span class="visual-type">${pageTitle("شهادة", "Certificate")}</span>
      <span class="visual-path">${escapeHTML(t(path.title))}</span>
    </div>
    <div class="visual-caption">
      <div class="pt">${escapeHTML(t(certificate.name))}</div>
      <div class="ps">${escapeHTML(t(certificate.issuer))}</div>
    </div>
  </a>`;
}

function directWorkVisual(work, path) {
  return `<a class="visual-card" href="${escapeHTML(work.href || "#")}">
    <div class="visual-frame">
      <img class="visual-img" src="${escapeHTML(work.image)}" alt="${escapeHTML(t(work.title))}" loading="lazy" data-full-image onerror="this.closest('.visual-card').remove()">
      <span class="visual-type">${pageTitle("عمل مباشر", "Direct Work")}</span>
      <span class="visual-path">${escapeHTML(t(path.title))}</span>
    </div>
    <div class="visual-caption">
      <div class="pt">${escapeHTML(t(work.title))}</div>
      <div class="pd">${escapeHTML(t(work.description))}</div>
    </div>
  </a>`;
}

async function renderCareerPathDetail() {
  renderShell("career-paths");
  try {
    const { careerPaths, skills, certificates } = await loadPortfolioData(["careerPaths", "skills", "certificates"]);
    const id = getQueryParam("id");
    const path = findById(careerPaths, id);
    const root = document.querySelector("[data-career-path-detail]");
    if (!path) {
      root.innerHTML = `<div class="dcard"><h1 class="d-ttl">${pageTitle("المسار غير موجود", "Path not found")}</h1><p class="d-desc">${pageTitle("تأكد من رابط المسار أو ارجع لقسم مساراتي.", "Check the path link or go back to Career Paths.")}</p><div class="sec-footer"><a class="btn" href="index.html#career-paths">${pageTitle("العودة للمسارات", "Back to paths")}</a></div></div>`;
      return;
    }

    const relatedSkills = resolveSkills(path.skills, skills);
    const relatedCertificates = (path.certificates || [])
      .map((certId) => findById(certificates, certId))
      .filter((certificate) => certificate && certificate.image);
    const directWorks = (path.directWorks || []).filter((work) => work.image);

    root.innerHTML = `
      <a class="back" href="index.html#career-paths">← ${pageTitle("مساراتي", "Career Paths")}</a>
      <div class="dcard path-hero">
        <div class="d-ico">${escapeHTML(path.icon || "•")}</div>
        <h1 class="d-ttl">${escapeHTML(t(path.title))}</h1>
        <p class="d-desc">${escapeHTML(t(path.description))}</p>
      </div>

      <section class="path-section">
        <div class="dslbl">${pageTitle("المهارات", "Skills")}</div>
        <div class="text-skill-grid">
          ${relatedSkills.map((skill) => `<div class="text-skill"><div class="pt">${escapeHTML(t(skill.name))}</div><div class="pd">${escapeHTML(t(skill.description))}</div></div>`).join("")}
        </div>
      </section>

      <section class="path-section">
        <div class="dslbl">${pageTitle("الشهادات", "Certificates")}</div>
        <div class="visual-grid">
          ${relatedCertificates.map((certificate) => certificateVisual(certificate, path)).join("")}
        </div>
      </section>

      <section class="path-section">
        <div class="dslbl">${pageTitle("أعمال مباشرة", "Direct Work")}</div>
        <div class="visual-grid">
          ${directWorks.map((work) => directWorkVisual(work, path)).join("")}
        </div>
      </section>`;
    setupImageViewer();
  } catch (error) {
    showError("[data-career-path-detail]", pageTitle("تعذر تحميل تفاصيل المسار.", "Could not load path details."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderCareerPathDetail);
window.addEventListener("portfolio:prefs", renderCareerPathDetail);
