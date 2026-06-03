async function renderAchievementsPage() {
  renderShell("achievements");
  try {
    const { achievements, projects, skills } = await loadPortfolioData(["achievements", "projects", "skills"]);
    const featured = achievements.filter((achievement) => achievement.featured);
    const rest = achievements.filter((achievement) => !achievement.featured);
    const card = (achievement) => {
      const relatedProjects = resolveProjects(achievement.relatedProjects, projects);
      const relatedSkills = resolveSkills(achievement.relatedSkills, skills);
      const imageSource = relatedProjects.find((project) => project.image)?.image || achievement.image;
      const imageAlt = relatedProjects.find((project) => project.image)?.imageAlt || achievement.imageAlt;
      return `<div class="achievement-card">
        ${imageSource ? `<div class="achievement-media"><img class="achievement-img" src="${escapeHTML(imageSource)}" alt="${escapeHTML(t(imageAlt || achievement.title))}" loading="lazy" onerror="this.closest('.achievement-media').remove()"></div>` : ""}
        <div class="pcard-top"><div><div class="pt">${escapeHTML(t(achievement.title))}</div><div class="ps">${escapeHTML(achievement.year)}</div></div>${achievement.featured ? `<span class="badge badge-featured">${pageTitle("مميز", "Featured")}</span>` : ""}</div>
        <div class="pd">${escapeHTML(t(achievement.description))}</div>
        <div class="chips">${relatedProjects.map(projectChip).join("")}${relatedSkills.map(skillChip).join("")}${achievement.url ? `<a class="chip" href="${escapeHTML(achievement.url)}" target="_blank" rel="noreferrer">${pageTitle("رابط التوثيق", "Source link")}</a>` : ""}</div>
      </div>`;
    };
    document.querySelector("[data-featured-achievements]").innerHTML = featured.map(card).join("");
    document.querySelector("[data-achievements-list]").innerHTML = rest.length ? rest.map(card).join("") : "";
  } catch (error) {
    showError("[data-featured-achievements]", pageTitle("تعذر تحميل الإنجازات.", "Could not load achievements."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderAchievementsPage);
window.addEventListener("portfolio:prefs", renderAchievementsPage);
