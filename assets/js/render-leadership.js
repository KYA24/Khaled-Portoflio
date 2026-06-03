function parseLeadershipYears(value) {
  const text = String(value || "");
  const startMatch = text.match(/(\d{4})/);
  const startYear = startMatch ? Number(startMatch[1]) : 0;
  const tail = text.slice(startMatch ? startMatch.index + startMatch[1].length : 0);
  const endMatch = tail.match(/(\d{2,4})/);
  let endYear = startYear;

  if (endMatch) {
    const rawEnd = endMatch[1];
    endYear = rawEnd.length === 2
      ? Number(String(startYear).slice(0, 2) + rawEnd)
      : Number(rawEnd);
  }

  return { startYear, endYear };
}

async function renderLeadershipPage() {
  renderShell("leadership");
  try {
    const { leadership, skills } = await loadPortfolioData(["leadership", "skills"]);
    const sortedLeadership = [...leadership].sort((a, b) => {
      const yearsA = parseLeadershipYears(a.year);
      const yearsB = parseLeadershipYears(b.year);
      if (yearsB.endYear !== yearsA.endYear) return yearsB.endYear - yearsA.endYear;
      return yearsB.startYear - yearsA.startYear;
    });

    document.querySelector("[data-leadership-list]").innerHTML = sortedLeadership.map((item) => {
      const relatedSkills = resolveSkills(item.skills, skills);
      return `<div class="tli">
        <div class="tly">${escapeHTML(item.year)}</div>
        <div class="leadership-body">
          <div class="leadership-copy">
            <div class="tlt">${item.icon || ""} ${escapeHTML(t(item.title))}</div>
            <div class="tlo">${escapeHTML(t(item.organization))}</div>
            <div class="tld">${escapeHTML(t(item.description))}</div>
            <div class="chips">${relatedSkills.map(skillChip).join("")}</div>
          </div>
          ${item.image ? `<div class="achievement-media leadership-thumb"><img class="achievement-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(t(item.imageAlt || item.title))}" loading="lazy" data-full-image onerror="this.closest('.achievement-media').remove()"></div>` : ""}
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
