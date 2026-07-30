function getLang() {
  return localStorage.getItem("portfolio.lang") || "ar";
}

function setLang(lang) {
  localStorage.setItem("portfolio.lang", lang);
  applyPrefs();
}

function getTheme() {
  return localStorage.getItem("portfolio.theme") || "dark";
}

function setTheme(theme) {
  localStorage.setItem("portfolio.theme", theme);
  applyPrefs();
}

function t(value) {
  if (value == null) return "";
  if (typeof value === "string") return value;
  const lang = getLang();
  return value[lang] || value.ar || value.en || "";
}

function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function findById(list, id) {
  return (list || []).find((item) => item.id === id);
}

function resolveSkills(skillIds, allSkills) {
  return (skillIds || []).map((id) => findById(allSkills, id)).filter(Boolean);
}

function resolveProjects(projectIds, allProjects) {
  return (projectIds || []).map((id) => findById(allProjects, id)).filter(Boolean);
}

function applyPrefs() {
  const lang = getLang();
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.documentElement.dataset.theme = getTheme();
  const langBtn = document.querySelector("[data-lang-toggle]");
  const themeBtn = document.querySelector("[data-theme-toggle]");
  if (langBtn) langBtn.textContent = lang === "ar" ? "عر" : "EN";
  if (themeBtn) themeBtn.textContent = getTheme() === "dark" ? "☾" : "☀";
  document.querySelectorAll("[data-i18n-ar]").forEach((el) => {
    el.textContent = lang === "ar" ? el.dataset.i18nAr : el.dataset.i18nEn;
  });
}

function escapeHTML(value) {
  return String(value || "").replace(/[&<>"']/g, (char) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;"
  })[char]);
}

function skillChip(skill) {
  return `<a class="chip" href="skill.html?id=${encodeURIComponent(skill.id)}">${skill.icon || ""} ${escapeHTML(t(skill.name))}</a>`;
}

function projectChip(project) {
  return `<a class="chip" href="project.html?id=${encodeURIComponent(project.id)}">${project.icon || ""} ${escapeHTML(t(project.title))}</a>`;
}

function certificateChip(certificate) {
  return `<a class="chip" href="certificates.html#${encodeURIComponent(certificate.id)}">📜 ${escapeHTML(t(certificate.name))}</a>`;
}

function badgeHTML(badge) {
  const cls = badge.type === "featured" ? "badge badge-featured" : "badge";
  return `<span class="${cls}">${escapeHTML(t(badge.label))}</span>`;
}

function sortProjectsForDisplay(projects) {
  return (projects || [])
    .map((project, index) => ({ project, index }))
    .sort((a, b) => {
      const aHasImage = Boolean(a.project.image);
      const bHasImage = Boolean(b.project.image);
      if (aHasImage !== bHasImage) return Number(bHasImage) - Number(aHasImage);
      return a.index - b.index;
    })
    .map(({ project }) => project);
}

function projectCard(project, skills) {
  const relatedSkills = resolveSkills(project.skills, skills).slice(0, 4);
  return `<a class="pcard" href="project.html?id=${encodeURIComponent(project.id)}">
    ${project.image ? `<div class="project-media"><img class="project-img" src="${escapeHTML(project.image)}" alt="${escapeHTML(t(project.imageAlt || project.title))}" loading="lazy" data-full-image onerror="this.closest('.project-media').remove()"></div>` : ""}
    <div class="pcard-top"><div class="pcard-ico">${project.icon || "•"}</div><span class="parr">→</span></div>
    <div><div class="pt">${escapeHTML(t(project.title))}</div><div class="ps">${escapeHTML(t(project.subtitle))}</div></div>
    <div class="pd">${escapeHTML(t(project.description))}</div>
    <div class="tags">${relatedSkills.map((skill) => `<span class="tag">${escapeHTML(t(skill.name))}</span>`).join("")}${(project.badges || []).map(badgeHTML).join("")}</div>
  </a>`;
}

function showError(target, message) {
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) el.innerHTML = `<div class="error">${escapeHTML(message)}</div>`;
}

function pageTitle(ar, en) {
  return getLang() === "ar" ? ar : en;
}

function setupImageViewer() {
  if (document.querySelector("[data-image-viewer]")) return;
  const viewer = document.createElement("div");
  viewer.className = "image-viewer";
  viewer.dataset.imageViewer = "true";
  viewer.setAttribute("aria-hidden", "true");
  viewer.innerHTML = `
    <button class="image-viewer-close" type="button" data-image-viewer-close aria-label="Close">×</button>
    <div class="image-viewer-backdrop" data-image-viewer-close></div>
    <div class="image-viewer-dialog">
      <img class="image-viewer-img" src="" alt="" data-image-viewer-img>
    </div>`;
  document.body.appendChild(viewer);

  viewer.addEventListener("click", (event) => {
    if (event.target.closest("[data-image-viewer-close]")) {
      closeImageViewer();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeImageViewer();
    }
  });

  document.addEventListener("click", (event) => {
    const image = event.target.closest("img[data-full-image]");
    if (!image) return;
    event.preventDefault();
    event.stopPropagation();
    openImageViewer(image.currentSrc || image.src, image.alt || "");
  }, true);
}

function openImageViewer(src, alt) {
  const viewer = document.querySelector("[data-image-viewer]");
  if (!viewer) return;
  const image = viewer.querySelector("[data-image-viewer-img]");
  image.src = src;
  image.alt = alt;
  viewer.classList.add("open");
  viewer.setAttribute("aria-hidden", "false");
  document.body.classList.add("viewer-open");
}

function closeImageViewer() {
  const viewer = document.querySelector("[data-image-viewer]");
  if (!viewer) return;
  const image = viewer.querySelector("[data-image-viewer-img]");
  viewer.classList.remove("open");
  viewer.setAttribute("aria-hidden", "true");
  document.body.classList.remove("viewer-open");
  image.src = "";
  image.alt = "";
}
