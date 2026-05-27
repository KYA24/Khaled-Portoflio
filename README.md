# Khaled Portfolio

Static personal portfolio built with vanilla HTML, CSS, JavaScript, and JSON files. There is no backend, database, CMS, authentication service, Netlify Forms, Netlify Functions, or paid-service dependency.

## Structure

- `index.html` - homepage
- `projects.html` / `project.html?id=PROJECT_ID` - project list and detail pages
- `skills.html` / `skill.html?id=SKILL_ID` - skill list and detail pages
- `certificates.html`, `achievements.html`, `leadership.html` - independent static pages
- `assets/css/style.css` - shared styling
- `assets/js/` - shared utilities, data loading, and page renderers
- `data/*.json` - local content database
- `tools/local-editor.html` - local-only JSON helper

## Editing Content

Edit JSON files in `data/` directly. Keep IDs stable and use IDs for relationships.

Projects reference skills and certificates:

```json
"skills": ["flutter", "ux"],
"certificates": ["flutter-bc"]
```

Certificates reference skills and projects:

```json
"skills": ["flutter"],
"projects": ["alzad"]
```

Achievements reference projects and skills:

```json
"relatedProjects": ["alzad"],
"relatedSkills": ["flutter", "systems-analysis"]
```

Every translated field should use:

```json
{ "ar": "Arabic text", "en": "English text" }
```

If English is empty or missing, the site falls back to Arabic.

## Local Editor

Open `tools/local-editor.html` locally in Brave or Chrome. It helps generate a clean JSON object, copy it, download an updated JSON file, or append/save through the File System Access API when the browser supports it.

The local editor is a helper tool only. It is not secure admin authentication and should not be treated as a backend CMS.

## Netlify Deploy

Deploy as plain static files. The included `netlify.toml` only sets the publish directory and a simple cache header for JSON files.

Do not add Netlify Identity, Forms, Functions, Edge Functions, Scheduled Functions, Large Media, a database, or a backend unless you intentionally upgrade the architecture later.

## Do Not Commit

- `admin.local.json`
- Local credentials
- Any fake admin password file

## Update Flow

```bash
git add .
git commit -m "Update portfolio content"
git push
```
