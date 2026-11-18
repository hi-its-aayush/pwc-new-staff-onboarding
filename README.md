# Casual Onboarding (PwC Sydney)

Static site, no build step. Open `index.html` or serve the folder.

- `index.html`: page shell
- `css/styles.css`: styles (light/dark, print rules for the certificate)
- `js/app.js`: routing, sidebar, progress, quizzes, certificate
- `js/modules.js`: all training content (`M` array). Add `quiz:[{q,o:[],a:index}]` to any module to gate "Mark as learned"
- `assets/img/`: photos from the training documents

Progress and the learner's name are stored in the browser (localStorage). No server.
