# Gastronomy Staff Onboarding & Training Portal (PwC Sydney)

Zero-build, static single-page training portal designed for **Gastronomy (OzHarvest Ventures)** at PwC Sydney. Open `index.html` locally or deploy directly to GitHub Pages / Netlify / any static host.

---

## Architecture & File Map

- **`index.html`** — Page shell, sticky top bar, mobile slide-out drawer, layout shell (`#rail` + `#main`), and fullscreen image lightbox.
- **`css/styles.css`** — Responsive styling, Gastronomy black/cream/yellow theme tokens, light/dark mode (`[data-theme="dark"]`), macOS Dock-style spring hover animations, and print/PDF rules.
- **`js/modules.js`** — `M` array containing:
  - **Day 1 Essentials** (`core: 1`): Uniform standards (`m0`), locations, Cloud Booking, beverage service, glasswasher, cleaning, food safety.
  - **Reference Library** (no `core` flag): Checklists, storerooms, equipment (including **Franke Mytico** 12-slide SOP), catering, and formal service.
- **`js/training.js`** — `T` array containing dedicated **Training & Upskilling** tracks (e.g. **Wine Training** `w1`–`w3`), supporting interactive slide decks and quizzes.
- **`js/app.js`** — Hash-based router, three isolated modes (**Landing**, **Day 1 Onboarding**, **Reference Library & Training**), slide deck viewer, quiz gating, tap-to-zoom lightbox, confetti celebration, and the printable **Staff Completion Record** with HTML5 signature canvas.
- **`assets/img/`** — All training images, named consistently as `<module-id>-<topic-slug>-<NN>.jpg` (plus `franke/slide-01.jpg`–`slide-12.jpg`).

---

## Adapting for Another Gastronomy Site

1. **Branding & Team:** Update site name, floors, and team cards in `js/app.js` (`renderHome`, `renderCert`) and `js/modules.js` (`welcome`).
2. **Adding/Editing Modules:**
   - Add or edit entries in `M` (`js/modules.js`) or `T` (`js/training.js`).
   - Add `core: 1` to include a module in the linear Day 1 Onboarding track.
   - Add `quiz: [{ q: "...", o: ["..."], a: 0 }]` to gate completion on passing the quiz.
   - Add `slides: [{ title: "...", img: "assets/img/...", body: "...", note: "..." }]` to render an interactive slide deck.
3. **Browser Storage (`localStorage`):**
   - `ob-done` — JSON map of completed module IDs (`{ "m0": 1, ... }`)
   - `ob-name`, `ob-role`, `ob-start` — Learner details for the Completion Record
   - `ob-theme` — `"light"` or `"dark"` theme preference

No server, database, or build pipeline is required.
