async function renderProjectDetail() {
  renderShell("projects");
  try {
    const { projects, skills, certificates, achievements } = await loadPortfolioData(["projects", "skills", "certificates", "achievements"]);
    const id = getQueryParam("id");
    const project = findById(projects, id);
    const root = document.querySelector("[data-project-detail]");
    if (!project) {
      root.innerHTML = `<div class="dcard"><h1 class="d-ttl">${pageTitle("المشروع غير موجود", "Project not found")}</h1><p class="d-desc">${pageTitle("تأكد من رابط المشروع أو ارجع إلى قائمة المشاريع.", "Check the project link or go back to the projects list.")}</p><div class="sec-footer"><a class="btn" href="projects.html">${pageTitle("العودة للمشاريع", "Back to projects")}</a></div></div>`;
      return;
    }
    const relatedSkills = resolveSkills(project.skills, skills);
    const relatedCertificates = (project.certificates || []).map((certId) => findById(certificates, certId)).filter(Boolean);
    const relatedAchievements = achievements.filter((achievement) => (achievement.relatedProjects || []).includes(project.id));
    root.innerHTML = `
      <a class="back" href="projects.html">← ${pageTitle("المشاريع", "Projects")}</a>
      <div class="dcard">
        <div class="d-ico">${project.icon || "•"}</div>
        <h1 class="d-ttl">${escapeHTML(t(project.title))}</h1>
        <div class="d-meta">${escapeHTML(t(project.subtitle))}</div>
        <p class="d-desc">${escapeHTML(t(project.longDescription))}</p>
        <div class="tags">${(project.badges || []).map(badgeHTML).join("")}</div>
      </div>
      <div class="dcard">
        <div class="dsec"><div class="dslbl">${pageTitle("الأدوار", "Roles")}</div><div class="dbuls">${(t(project.roles) || []).map((role) => `<div class="dbul">${escapeHTML(role)}</div>`).join("")}</div></div>
        <div class="dsec"><div class="dslbl">${pageTitle("المهارات المستخدمة", "Skills Used")}</div><div class="chips">${relatedSkills.map(skillChip).join("")}</div></div>
        ${relatedCertificates.length ? `<div class="dsec"><div class="dslbl">${pageTitle("شهادات مرتبطة", "Related Certificates")}</div><div class="chips">${relatedCertificates.map(certificateChip).join("")}</div></div>` : ""}
        ${relatedAchievements.length ? `<div class="dsec"><div class="dslbl">${pageTitle("إنجازات مرتبطة", "Related Achievements")}</div><div class="stack">${relatedAchievements.map((item) => `<div class="achievement-card"><div class="pt">${escapeHTML(t(item.title))}</div><div class="pd">${escapeHTML(t(item.description))}</div></div>`).join("")}</div></div>` : ""}
      </div>`;
  } catch (error) {
    showError("[data-project-detail]", pageTitle("تعذر تحميل تفاصيل المشروع.", "Could not load project details."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderProjectDetail);
window.addEventListener("portfolio:prefs", renderProjectDetail);
