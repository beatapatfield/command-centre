# Command Centre

An installable web app (PWA) with a home screen leading to two features: a **To-Do & Schedule**
(tasks grouped Overdue / Today / Upcoming / No date / Done) and a reusable **Shopping List**
organised by shop aisle with quantities. No build step, no dependencies.

## Features

- Home screen with two tiles showing live counts
- To-do: optional due date/time, auto-grouped by Overdue / Today / Upcoming / No date / Done
- Shopping catalog grouped by aisle; tick items into a "Ready list" at the top
- Per-item quantities that sum automatically (2 l + 500 ml = 2.5 l), editable inline
- Undo after removing an item
- Data saved automatically in the browser (localStorage); Export / Import JSON backups
- Receives shopping items from an external page (e.g. a recipe app) via URL or shared storage
- Installable to phone/desktop, works offline, dark-mode aware

## Files

```
index.html                    the app
manifest.webmanifest          PWA metadata
sw.js                         service worker (offline caching)
icons/                        app icons (192, 512, maskable, apple-touch, favicon)
.github/workflows/deploy.yml  auto-deploy + cache versioning
```

## Host it on GitHub Pages (recommended: auto-deploy)

1. Create a new GitHub repository (e.g. `command-centre`).
2. Commit all the files above, keeping the folder structure (`icons/` and `.github/`):
   ```bash
   git init
   git add .
   git commit -m "Add Command Centre PWA"
   git branch -M main
   git remote add origin https://github.com/<your-username>/command-centre.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to **GitHub Actions**, then save.
5. The workflow runs on every push and publishes to
   `https://<your-username>.github.io/command-centre/` (about a minute).

The workflow stamps a content hash into `sw.js` on each deploy, so the offline cache refreshes and
open users get the **"Update available — Refresh"** prompt automatically — but only when the app's
files actually change. **You never edit the cache version by hand.**

GitHub Pages serves over HTTPS, which the service worker requires, so the app is installable and
offline-capable with no extra config.

### Alternative: deploy from a branch (manual versioning)

If you prefer **Source = Deploy from a branch** (root), the app still works, but `sw.js` keeps the
literal `__BUILD__` placeholder and won't change between deploys — so to push an update to installed
devices you'd edit `const CACHE` in `sw.js` to a new value yourself. The workflow above avoids that.

## Installing

- **Android / desktop Chrome/Edge:** an **Install** button appears in the header (or use the
  browser's install icon in the address bar).
- **iPhone/iPad (Safari):** Share → *Add to Home Screen*.

## Sending items from another page (recipe app)

- **URL:** `.../command-centre/?add=Milk%202%25~2%20l|Butter~200%20g` (item names separated by `|`,
  optional quantity after `~`).
- **Shared storage (same github.io account):** the other page writes
  `localStorage["commandCentre.inbox"] = JSON.stringify([{name:"Milk 2%", qty:"2 l"}])`.

Matching names get ticked (quantities summed); unknown names are added under the "Other" aisle.

## Notes

- Data is stored per-browser, per-device. It does not sync between devices — use **Export** on one
  and **Import** on the other. Backups download as `command-centre-YYYY-MM-DD.json`.
- Updates are automatic with the workflow above: push your changes and open users get an
  **"Update available — Refresh"** prompt. No cache edits, no manual clearing.
