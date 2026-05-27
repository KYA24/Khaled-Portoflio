async function renderSkillsPage() {
  renderShell("skills");
  try {
    const { skills, projects, certificates } = await loadPortfolioData(["skills", "projects", "certificates"]);
    document.querySelector("[data-skills-list]").innerHTML = skills.map((skill) => {
      const projectCount = projects.filter((project) => (project.skills || []).includes(skill.id)).length;
      const certificateCount = certificates.filter((certificate) => (certificate.skills || []).includes(skill.id)).length;
      return `<a class="skcard skcard-link" href="skill.html?id=${encodeURIComponent(skill.id)}">
        <div class="skcard-head"><div class="skcard-ico">${skill.icon || "•"}</div><div><div class="skcard-name">${escapeHTML(t(skill.name))}</div><div class="ps">${projectCount} ${pageTitle("مشاريع", "projects")} · ${certificateCount} ${pageTitle("شهادات", "certificates")}</div></div></div>
        <div class="skcard-desc">${escapeHTML(t(skill.description))}</div>
        <div class="tags">${(skill.items || []).map((item) => `<span class="tag">${escapeHTML(item)}</span>`).join("")}</div>
      </a>`;
    }).join("");
  } catch (error) {
    showError("[data-skills-list]", pageTitle("تعذر تحميل المهارات.", "Could not load skills."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderSkillsPage);
window.addEventListener("portfolio:prefs", renderSkillsPage);
