async function renderHome() {
  renderShell("home");
  try {
    const data = await loadPortfolioData();
    const { profile, projects, skills, careerPaths, certificates, achievements, leadership } = data;
    const nameParts = escapeHTML(t(profile.name)).split(" ");
    document.querySelector("[data-home-name]").innerHTML = `${nameParts[0] || ""} <em>${nameParts.slice(1).join(" ")}</em>`;
    document.querySelector("[data-home-role]").textContent = t(profile.role);
    document.querySelector("[data-home-bio]").textContent = t(profile.bio);

    document.querySelector("[data-home-stats]").innerHTML = (profile.stats || []).map((stat) => `
      <div class="st"><span class="stn">${escapeHTML(stat.value)}</span><div class="stl">${escapeHTML(t(stat.label))}</div></div>`).join("");

    document.querySelector("[data-home-career-paths]").innerHTML = (careerPaths || []).map((path) => {
      const pathSkills = resolveSkills(path.skills, skills).slice(0, 4);

      return `
        <a class="career-card career-card-link" href="career-path.html?id=${encodeURIComponent(path.id)}">
          <div class="career-head">
            <div class="career-icon">${escapeHTML(path.icon)}</div>
            <div>
              <h3 class="career-title">${escapeHTML(t(path.title))}</h3>
              <p class="career-desc">${escapeHTML(t(path.summary) || t(path.description))}</p>
            </div>
          </div>
          <div class="career-mini-skills">
            ${pathSkills.slice(0, 3).map((skill) => `<span>${escapeHTML(t(skill.name))}</span>`).join("")}
          </div>
          <div class="career-open">${pageTitle("فتح المسار", "Open path")} <span>→</span></div>
        </a>`;
    }).join("");

    document.querySelector("[data-featured-projects]").innerHTML = projects.filter((project) => project.featured).slice(0, 3).map((project) => projectCard(project, skills)).join("");

    const homeSkills = skills.flatMap((skill) => skill.items || []).slice(0, 18);
    document.querySelector("[data-home-skills]").innerHTML = homeSkills.map((item) => `<span class="hsc"><span class="hsc-dot"></span>${escapeHTML(item)}</span>`).join("");

    document.querySelector("[data-home-certificates]").innerHTML = certificates.slice(0, 5).map((certificate) => `
      <div class="cc-row"><div><div class="cc-name">${escapeHTML(t(certificate.name))}</div><div class="cc-org">${escapeHTML(t(certificate.issuer))}</div></div><div class="cc-yr">${escapeHTML(certificate.year)}</div></div>`).join("");

    document.querySelector("[data-home-achievements]").innerHTML = achievements.filter((item) => item.featured).slice(0, 3).map((item) => `
      <div class="achievement-card">${item.image ? `<img class="achievement-img" src="${escapeHTML(item.image)}" alt="${escapeHTML(t(item.imageAlt))}" loading="lazy" onerror="this.remove()">` : ""}<div class="pt">${escapeHTML(t(item.title))}</div><div class="pd">${escapeHTML(t(item.description))}</div><div class="tags"><span class="badge badge-featured">${escapeHTML(item.year)}</span></div></div>`).join("");

    document.querySelector("[data-home-leadership]").innerHTML = leadership.slice(0, 4).map((item) => `
      <div class="tlc"><div class="tlc-ico">${item.icon || "•"}</div><div><div class="tlc-t">${escapeHTML(t(item.title))}</div><div class="tlc-o">${escapeHTML(t(item.organization))}</div></div></div>`).join("");
  } catch (error) {
    showError("[data-home-root]", pageTitle("تعذر تحميل بيانات الموقع.", "Could not load site data."));
    console.error(error);
  }
}

document.addEventListener("DOMContentLoaded", renderHome);
window.addEventListener("portfolio:prefs", renderHome);
