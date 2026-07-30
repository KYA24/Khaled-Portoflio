applyPrefs();

document.addEventListener("DOMContentLoaded", () => {
  applyPrefs();
  setupImageViewer();
});

function renderShell(activePage = "") {
  const nav = document.querySelector("[data-nav]");
  const footer = document.querySelector("[data-footer]");
  if (nav) {
    const links = [
      ["index.html", "home", "الرئيسية", "Home"],
      ["index.html#career-paths", "career-paths", "مساراتي", "Career Paths"],
      ["projects.html", "projects", "المشاريع", "Projects"],
      ["skills.html", "skills", "المهارات", "Skills"],
      ["certificates.html", "certificates", "الشهادات", "Certificates"],
      ["achievements.html", "achievements", "الإنجازات", "Achievements"],
      ["leadership.html", "leadership", "القيادة", "Leadership"]
    ];
    nav.innerHTML = `
      <a class="nav-logo" href="index.html">KHALED</a>
      <div class="nav-links">
        ${links.map(([href, key, ar, en]) => `<a class="nav-link ${activePage === key ? "active" : ""}" href="${href}" data-i18n-ar="${ar}" data-i18n-en="${en}">${getLang() === "ar" ? ar : en}</a>`).join("")}
      </div>
      <div class="nav-ctrl">
        <button class="ibt" data-lang-toggle type="button">عر</button>
        <button class="ibt" data-theme-toggle type="button">☾</button>
      </div>`;
    nav.querySelector("[data-lang-toggle]").addEventListener("click", () => {
      setLang(getLang() === "ar" ? "en" : "ar");
      window.dispatchEvent(new Event("portfolio:prefs"));
    });
    nav.querySelector("[data-theme-toggle]").addEventListener("click", () => {
      setTheme(getTheme() === "dark" ? "light" : "dark");
    });
  }
  if (footer) {
    footer.innerHTML = `
      <div class="fti">
        <div>
          <div class="ft-n" data-i18n-ar="خالد العتيق" data-i18n-en="Khaled Alateeq">${pageTitle("خالد العتيق", "Khaled Alateeq")}</div>
          <div class="ft-tg" data-i18n-ar="Portfolio built with static HTML, CSS, JS, and JSON." data-i18n-en="Portfolio built with static HTML, CSS, JS, and JSON.">Portfolio built with static HTML, CSS, JS, and JSON.</div>
        </div>
        <div class="ft-ls">
          <a class="ft-l" href="projects.html" data-i18n-ar="المشاريع" data-i18n-en="Projects">${pageTitle("المشاريع", "Projects")}</a>
          <a class="ft-l" href="skills.html" data-i18n-ar="المهارات" data-i18n-en="Skills">${pageTitle("المهارات", "Skills")}</a>
          <a class="ft-l" href="leadership.html" data-i18n-ar="القيادة" data-i18n-en="Leadership">${pageTitle("القيادة", "Leadership")}</a>
        </div>
      </div>`;
  }
  applyPrefs();
  setupImageViewer();
}
