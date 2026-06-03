async function renderSkillDetail() {
  renderShell("skills");
  try {
    const { skills, projects, certificates, achievements } = await loadPortfolioData(["skills", "projects", "certificates", "achievements"]);
    const id = getQueryParam("id");
    const skill = findById(skills, id);
    const root = document.querySelector("[data-skill-detail]");
    if (!skill) {
      root.innerHTML = `<div class="dcard"><h1 class="d-ttl">${pageTitle("المهارة غير موجودة", "Skill not found")}</h1><p class="d-desc">${pageTitle("تأكد من رابط المهارة أو ارجع إلى قائمة المهارات.", "Check the skill link or go back to the skills list.")}</p><div class="sec-footer"><a class="btn" href="skills.html">${pageTitle("العودة للمهارات", "Back to skills")}</a></div></div>`;
      return;
    }
    const relatedProjects = sortProjectsForDisplay(projects.filter((project) => (project.skills || []).includes(skill.id)));
    const relatedCertificates = certificates.filter((certificate) => (certificate.skills || []).includes(skill.id));
    const relatedAchievements = achievements.filter((achievement) => (achievement.relatedSkills || []).includes(skill.id));
    root.innerHTML = `
      <a class="back" href="skills.html">← ${pageTitle("المهارات", "Skills")}</a>
      <div class="dcard"><div class="d-ico">${skill.icon || "•"}</div><h1 class="d-ttl">${escapeHTML(t(skill.name))}</h1><p class="d-desc">${escapeHTML(t(skill.description))}</p><div class="tags">${(skill.items || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div></div>
      <div class="dcard"><div class="dslbl">${pageTitle("مشاريع مرتبطة", "Related Projects")}</div><div class="pgrid">${relatedProjects.map((project) => projectCard(project, skills)).join("") || `<div class="empty">${pageTitle("لا توجد مشاريع مرتبطة.", "No related projects.")}</div>`}</div></div>
      <div class="dcard"><div class="dslbl">${pageTitle("شهادات مرتبطة", "Related Certificates")}</div><div class="chips">${relatedCertificates.map(certificateChip).join("") || `<span class="empty">${pageTitle("لا توجد شهادات مرتبطة.", "No related certificates.")}</span>`}</div></div>
      <div class="dcard"><div class="dslbl">${pageTitle("إنجازات مرتبطة", "Related Achievements")}</div><div class="stack">${relatedAchievements.map((item) => `<div class="achievement-card"><div class="pt">${escapeHTML(t(item.title))}</div><div class="pd">${escapeHTML(t(item.description))}</div></div>`).join("") || `<div class="empty">${pageTitle("لا توجد إنجازات مرتبطة.", "No related achievements.")}</div>`}</div></div>`;
  } catch (error) {
    showError("[data-skill-detail]", pageTitle("تعذر تحميل تفاصيل المهارة.", "Could not load skill details."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderSkillDetail);
window.addEventListener("portfolio:prefs", renderSkillDetail);
