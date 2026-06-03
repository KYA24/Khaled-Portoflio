let currentCertificateFilter = "all";

function renderCertificateList(certificates, skills, projects) {
  const filtered = certificates.filter((certificate) =>
    currentCertificateFilter === "all" || certificate.category === currentCertificateFilter
  );

  const kindBadge = (certificate) => certificate.kind
    ? `<span class="badge">${escapeHTML(t(certificate.kind))}</span>`
    : "";

  const actionLinks = (certificate) => {
    const primary = certificate.file || certificate.url || certificate.image;
    const actions = [];
    if (primary) {
      actions.push(`<a class="lnk" href="${escapeHTML(primary)}" target="_blank" rel="noreferrer">${pageTitle("فتح الأصل", "Open file")}</a>`);
    }
    if (certificate.image && certificate.file && certificate.image !== certificate.file) {
      actions.push(`<a class="lnk" href="${escapeHTML(certificate.image)}" target="_blank" rel="noreferrer">${pageTitle("عرض الصورة", "View image")}</a>`);
    }
    return actions.join("");
  };

  const card = (certificate) => {
    const relatedSkills = resolveSkills(certificate.skills, skills);
    const relatedProjects = resolveProjects(certificate.projects, projects);
    return `<article class="cf" id="${escapeHTML(certificate.id)}">
      ${certificate.image ? `<div class="cf-media"><img class="cf-img" src="${escapeHTML(certificate.image)}" alt="${escapeHTML(t(certificate.imageAlt || certificate.name))}" loading="lazy" onerror="this.closest('.cf-media').remove()"></div>` : ""}
      <div class="cf-h">
        <div>
          <div class="cf-n">${escapeHTML(t(certificate.name))}</div>
          <div class="cf-o">${escapeHTML(t(certificate.issuer))}</div>
        </div>
        <div class="cf-meta">
          <div class="cf-y">${escapeHTML(certificate.year)}</div>
          ${kindBadge(certificate)}
        </div>
      </div>
      ${certificate.summary ? `<div class="cf-summary">${escapeHTML(t(certificate.summary))}</div>` : ""}
      ${relatedSkills.length ? `<div class="chips">${relatedSkills.map(skillChip).join("")}</div>` : ""}
      ${relatedProjects.length ? `<div class="chips">${relatedProjects.map(projectChip).join("")}</div>` : ""}
      ${actionLinks(certificate) ? `<div class="cf-actions">${actionLinks(certificate)}</div>` : ""}
    </article>`;
  };

  document.querySelector("[data-certificates-list]").innerHTML = filtered.length
    ? `<div class="cert-grid">${filtered.map(card).join("")}</div>`
    : `<div class="empty">${pageTitle("لا توجد شهادات مطابقة.", "No matching certificates.")}</div>`;
}

async function renderCertificatesPage() {
  renderShell("certificates");
  try {
    const { certificates, skills, projects } = await loadPortfolioData(["certificates", "skills", "projects"]);
    const filters = [
      ["all", "الكل", "All"],
      ["specialized", "التقنية", "Technical"],
      ["professional", "الريادة والإدارة", "Entrepreneurship & Management"],
      ["participation", "المشاركات والبرامج", "Programs & Participation"],
      ["proofs", "أدلة الإنجاز", "Achievement Proofs"]
    ];

    document.querySelector("[data-certificate-filters]").innerHTML = filters.map(([key, ar, en]) => `
      <button class="filter-btn ${currentCertificateFilter === key ? "active" : ""}" data-certificate-filter="${key}" type="button">${pageTitle(ar, en)}</button>`).join("");

    document.querySelectorAll("[data-certificate-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        currentCertificateFilter = button.dataset.certificateFilter;
        renderCertificatesPage();
      });
    });

    renderCertificateList(certificates, skills, projects);
  } catch (error) {
    showError("[data-certificates-list]", pageTitle("تعذر تحميل الشهادات.", "Could not load certificates."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderCertificatesPage);
window.addEventListener("portfolio:prefs", renderCertificatesPage);
