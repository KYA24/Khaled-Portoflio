const DATA_FILES = {
  profile: "data/profile.json",
  projects: "data/projects.json",
  skills: "data/skills.json",
  careerPaths: "data/career-paths.json",
  certificates: "data/certificates.json",
  achievements: "data/achievements.json",
  leadership: "data/leadership.json"
};

async function loadJSON(path) {
  const response = await fetch(path, { cache: "no-cache" });
  if (!response.ok) throw new Error(`Could not load ${path}`);
  return response.json();
}

async function loadPortfolioData(keys = Object.keys(DATA_FILES)) {
  const entries = await Promise.all(keys.map(async (key) => [key, await loadJSON(DATA_FILES[key])]));
  return Object.fromEntries(entries);
}
