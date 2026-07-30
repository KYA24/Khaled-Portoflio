function certificateVisual(certificate) {
  const image = certificate.image || certificate.thumbnail;
  return `<a class="visual-card" href="certificates.html#${encodeURIComponent(certificate.id)}">
    ${image
      ? `<img class="visual-img" src="${escapeHTML(image)}" alt="${escapeHTML(t(certificate.name))}" loading="lazy" onerror="this.closest('.visual-card').classList.add('visual-fallback'); this.remove()">`
      : `<div class="certificate-visual">
          <div class="certificate-mark">CERT</div>
          <div class="certificate-name">${escapeHTML(t(certificate.name))}</div>
          <div class="certificate-issuer">${escapeHTML(t(certificate.issuer))}</div>
          <div class="certificate-year">${escapeHTML(certificate.year)}</div>
        </div>`}
    <div class="visual-caption">
      <div class="pt">${escapeHTML(t(certificate.name))}</div>
      <div class="ps">${escapeHTML(t(certificate.issuer))}</div>
    </div>
  </a>`;
}

function workVisual(item, type) {
  const title = type === "project" ? t(item.title) : t(item.title);
  const desc = type === "project" ? t(item.description) : t(item.description);
  const href = type === "project" ? `project.html?id=${encodeURIComponent(item.id)}` : "achievements.html";
  const image = item.image || item.thumbnail || "";
  return `<a class="visual-card" href="${href}">
    ${image
      ? `<img class="visual-img" src="${escapeHTML(image)}" alt="${escapeHTML(t(item.imageAlt) || title)}" loading="lazy" onerror="this.closest('.visual-card').classList.add('visual-fallback'); this.remove()">`
      : `<div class="work-visual">
          <div class="work-icon">${escapeHTML(item.icon || (type === "project" ? "WORK" : "ACH"))}</div>
          <div class="work-year">${escapeHTML(item.year || "")}</div>
        </div>`}
    <div class="visual-caption">
      <div class="pt">${escapeHTML(title)}</div>
      <div class="pd">${escapeHTML(desc)}</div>
    </div>
  </a>`;
}

async function renderCareerPathDetail() {
  renderShell("career-paths");
  try {
    const { careerPaths, skills, certificates, projects, achievements } = await loadPortfolioData(["careerPaths", "skills", "certificates", "projects", "achievements"]);
    const id = getQueryParam("id");
    const path = findById(careerPaths, id);
    const root = document.querySelector("[data-career-path-detail]");
    if (!path) {
      root.innerHTML = `<div class="dcard"><h1 class="d-ttl">${pageTitle("المسار غير موجود", "Path not found")}</h1><p class="d-desc">${pageTitle("تأكد من رابط المسار أو ارجع لقسم مساراتي.", "Check the path link or go back to Career Paths.")}</p><div class="sec-footer"><a class="btn" href="index.html#career-paths">${pageTitle("العودة للمسارات", "Back to paths")}</a></div></div>`;
      return;
    }

    const relatedSkills = resolveSkills(path.skills, skills);
    const relatedCertificates = (path.certificates || []).map((certId) => findById(certificates, certId)).filter(Boolean);
    const relatedProjects = resolveProjects(path.projects, projects);
    const relatedAchievements = (path.achievements || []).map((achievementId) => findById(achievements, achievementId)).filter(Boolean);

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
          ${relatedCertificates.length ? relatedCertificates.map(certificateVisual).join("") : `<div class="empty">${pageTitle("تضاف شهادات هذا المسار لاحقًا.", "Certificates for this path will be added later.")}</div>`}
        </div>
      </section>

      <section class="path-section">
        <div class="dslbl">${pageTitle("أعمال مباشرة", "Direct Work")}</div>
        <div class="visual-grid">
          ${[...relatedAchievements.map((item) => workVisual(item, "achievement")), ...relatedProjects.map((item) => workVisual(item, "project"))].join("")}
        </div>
      </section>`;
  } catch (error) {
    showError("[data-career-path-detail]", pageTitle("تعذر تحميل تفاصيل المسار.", "Could not load path details."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderCareerPathDetail);
window.addEventListener("portfolio:prefs", renderCareerPathDetail);
