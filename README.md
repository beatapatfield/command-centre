# Command Centre

A simple single-page app with two panels: a **To-Do & Schedule** list (tasks with optional due date/time) and a **Shopping List**. Everything is one static `index.html` file with no dependencies.

## Features

- Add, check off, and delete tasks and shopping items
- Optional due date/time per task; list auto-sorts by due date, flags overdue items
- Data saved automatically in your browser (localStorage) — survives refresh and restart
- Export to a JSON backup and Import to restore (merge or replace)
- Works offline, dark mode aware, mobile friendly

## Host it on GitHub Pages

1. Create a new GitHub repository (e.g. `command-centre`).
2. Add `index.html` to the repo root and commit.
   ```bash
   git init
   git add index.html
   git commit -m "Add Command Centre"
   git branch -M main
   git remote add origin https://github.com/<your-username>/command-centre.git
   git push -u origin main
   ```
3. In the repo, go to **Settings → Pages**.
4. Under **Build and deployment**, set **Source** to `Deploy from a branch`, branch `main`, folder `/ (root)`, then **Save**.
5. Wait about a minute. Your site is live at:
   `https://<your-username>.github.io/command-centre/`

## Notes

- Data is stored per-browser, per-device. It does not sync between devices — use **Export** on one device and **Import** on another to move it.
- To keep a backup, click **Export** now and then; the file downloads as `command-centre-YYYY-MM-DD.json`.

## Next step

Later this can become an installable PWA (offline install, home-screen icon) by adding a manifest and service worker.
