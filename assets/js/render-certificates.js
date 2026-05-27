async function renderCertificatesPage() {
  renderShell("certificates");
  try {
    const { certificates, skills, projects } = await loadPortfolioData(["certificates", "skills", "projects"]);
    document.querySelector("[data-certificates-list]").innerHTML = certificates.map((certificate) => {
      const relatedSkills = resolveSkills(certificate.skills, skills);
      const relatedProjects = resolveProjects(certificate.projects, projects);
      return `<div class="cf" id="${escapeHTML(certificate.id)}">
        <div class="cf-h"><div><div class="cf-n">${escapeHTML(t(certificate.name))}</div><div class="cf-o">${escapeHTML(t(certificate.issuer))}</div></div><div class="cf-y">${escapeHTML(certificate.year)}</div></div>
        ${relatedSkills.length ? `<div class="chips">${relatedSkills.map(skillChip).join("")}</div>` : ""}
        ${relatedProjects.length ? `<div class="chips">${relatedProjects.map(projectChip).join("")}</div>` : ""}
        ${certificate.url ? `<div><a class="lnk" href="${escapeHTML(certificate.url)}" target="_blank" rel="noreferrer">${pageTitle("رابط الشهادة", "Certificate link")}</a></div>` : ""}
      </div>`;
    }).join("");
  } catch (error) {
    showError("[data-certificates-list]", pageTitle("تعذر تحميل الشهادات.", "Could not load certificates."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderCertificatesPage);
window.addEventListener("portfolio:prefs", renderCertificatesPage);
