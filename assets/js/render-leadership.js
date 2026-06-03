async function renderLeadershipPage() {
  renderShell("leadership");
  try {
    const { leadership, skills } = await loadPortfolioData(["leadership", "skills"]);
    document.querySelector("[data-leadership-list]").innerHTML = leadership.map((item) => {
      const relatedSkills = resolveSkills(item.skills, skills);
      return `<div class="tli">
        <div class="tly">${escapeHTML(item.year)}</div>
        <div>
          ${item.image ? `<div class="achievement-media leadership-media"><img class="achievement-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(t(item.imageAlt || item.title))}" loading="lazy" onerror="this.closest('.achievement-media').remove()"></div>` : ""}
          <div class="tlt">${item.icon || ""} ${escapeHTML(t(item.title))}</div>
          <div class="tlo">${escapeHTML(t(item.organization))}</div>
          <div class="tld">${escapeHTML(t(item.description))}</div>
          <div class="chips">${relatedSkills.map(skillChip).join("")}</div>
        </div>
      </div>`;
    }).join("");
  } catch (error) {
    showError("[data-leadership-list]", pageTitle("تعذر تحميل القيادة.", "Could not load leadership."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderLeadershipPage);
window.addEventListener("portfolio:prefs", renderLeadershipPage);
