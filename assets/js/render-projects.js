let currentProjectFilter = "all";
let currentProjectSearch = "";

function renderProjectList(projects, skills) {
  const filtered = sortProjectsForDisplay(projects.filter((project) => {
    const matchesFilter =
      currentProjectFilter === "all" ||
      (currentProjectFilter === "featured" && project.featured) ||
      (currentProjectFilter === "practical" && project.category === "practical") ||
      (currentProjectFilter === "achievement" && project.category === "achievement");
    const haystack = `${t(project.title)} ${t(project.subtitle)} ${t(project.description)}`.toLowerCase();
    return matchesFilter && haystack.includes(currentProjectSearch.toLowerCase());
  }));
  document.querySelector("[data-projects-list]").innerHTML = filtered.length
    ? filtered.map((project) => projectCard(project, skills)).join("")
    : `<div class="empty">${pageTitle("لا توجد مشاريع مطابقة.", "No matching projects.")}</div>`;
}

async function renderProjectsPage() {
  renderShell("projects");
  try {
    const { projects, skills } = await loadPortfolioData(["projects", "skills"]);
    const filters = [
      ["all", "الكل", "All"],
      ["featured", "المميزة", "Featured"],
      ["practical", "المشاريع التطبيقية", "Practical Projects"],
      ["achievement", "الإنجازات", "Achievements"]
    ];
    document.querySelector("[data-project-filters]").innerHTML = filters.map(([key, ar, en]) => `
      <button class="filter-btn ${currentProjectFilter === key ? "active" : ""}" data-filter="${key}" type="button">${pageTitle(ar, en)}</button>`).join("");
    document.querySelectorAll("[data-filter]").forEach((button) => {
      button.addEventListener("click", () => {
        currentProjectFilter = button.dataset.filter;
        renderProjectsPage();
      });
    });
    const search = document.querySelector("[data-project-search]");
    search.value = currentProjectSearch;
    search.placeholder = pageTitle("ابحث في المشاريع", "Search projects");
    search.addEventListener("input", (event) => {
      currentProjectSearch = event.target.value;
      renderProjectList(projects, skills);
    });
    renderProjectList(projects, skills);
  } catch (error) {
    showError("[data-projects-list]", pageTitle("تعذر تحميل المشاريع.", "Could not load projects."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderProjectsPage);
window.addEventListener("portfolio:prefs", renderProjectsPage);
