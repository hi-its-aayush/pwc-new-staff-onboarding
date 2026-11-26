/**
 * Gastronomy Onboarding & Training Portal — Core Application
 * --------------------------------------------------------
 * Static hash-routed SPA with three isolated experiences:
 *   1. Landing / Introduction (#welcome)
 *   2. Guided Day 1 Onboarding (#m0 -> ... -> #certificate)
 *   3. Reference Library & Dedicated Training (#library, #training, #w1 -> #training-certificate)
 *
 * State is persisted in browser localStorage (no backend required).
 */

const $ = s => document.querySelector(s);

// Persisted learner state: completion map `D` ({ [moduleId]: 1 }) and learner name `N`
let D = {}, N = "", slideIdx = 0;
try {
  D = JSON.parse(localStorage.getItem("ob-done") || "{}");
  N = localStorage.getItem("ob-name") || "";
} catch (e) {}

const save = () => {
  try {
    localStorage.setItem("ob-done", JSON.stringify(D));
    localStorage.setItem("ob-name", N);
  } catch (e) {}
};

// Partition modules into Day 1 Onboarding (CORE_MODULES), Reference Library (LIB_MODULES),
// and combined search pool for existing staff (TRAINING_ALL)
const CORE_MODULES = M.filter(m => m.core && m.id !== "welcome");
const LIB_MODULES = M.filter(m => !m.core);
const TRAINING_ALL = [...T, ...LIB_MODULES];

// Group Reference Library modules by their `g` category in original display order
const LIB_GROUPS = [];
const LIB_MAP = {};
LIB_MODULES.forEach(m => {
  if (!LIB_MAP[m.g]) {
    LIB_MAP[m.g] = { name: m.g, items: [] };
    LIB_GROUPS.push(LIB_MAP[m.g]);
  }
  LIB_MAP[m.g].items.push(m);
});

// Progress helpers
const cntOb = () => CORE_MODULES.filter(m => D[m.id]).length;
const cntTr = () => T.filter(m => D[m.id]).length;
const nextObId = () => (CORE_MODULES.find(m => !D[m.id]) || CORE_MODULES[0]).id;

/** Updates the sticky top bar for "landing", "onboarding", or "training" mode. */

function setTopbar(mode, stepInfo) {
  const mid = $("#tb-mid");
  const sw = $("#search-wrap");
  const exit = $("#exit-link");
  const menu = $("#menu");

  if (mode === "landing") {
    mid.innerHTML = `<span class="tb-tag">PwC Sydney · Team Portal</span>`;
    sw.hidden = true;
    exit.hidden = true;
    menu.hidden = true;
    return;
  }

  exit.hidden = false;
  menu.hidden = false;

  if (mode === "onboarding") {
    const done = cntOb(), total = CORE_MODULES.length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    sw.hidden = true;
    mid.innerHTML = `
      <div class="tb-prog">
        <span class="tb-label">${stepInfo || `Day 1 Onboarding · ${done}/${total}`}</span>
        <div class="tb-bar"><i style="width:${pct}%"></i></div>
        ${done ? `<button type="button" class="tb-reset" id="reset-ob" title="Reset Day 1 progress">↺ Reset</button>` : ""}
      </div>`;
    const rb = $("#reset-ob");
    if (rb) rb.onclick = () => resetProgress("ob");
  } else {
    sw.hidden = false;
    mid.innerHTML = `<span class="tb-tag">Training &amp; Reference Library</span>`;
  }
}

/** Populates both the desktop side rail (#rail) and mobile drawer (#drawer-rail). */
function setRail(html) {
  const rail = $("#rail");
  const dRail = $("#drawer-rail");
  if (!html) {
    rail.hidden = true;
    rail.innerHTML = "";
    dRail.innerHTML = "";
    $("#shell").classList.remove("with-rail");
    return;
  }
  rail.innerHTML = html;
  rail.hidden = false;
  dRail.innerHTML = html;
  $("#shell").classList.add("with-rail");
}

function renderOnboardingRail() {
  return `<div class="grp">Day 1 Essentials</div>` +
    CORE_MODULES.map((m, i) => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${i + 1}. ${m.t.replace(/^\d+(\.\d+)*\s*·\s*/, "")}</span></a>`).join("") +
    `<div class="grp">Finish</div><a href="#certificate" class="${cur === "certificate" ? "on" : ""}"><b></b><span>Day 1 Certificate</span></a>`;
}

/** Clears completion state for either Day 1 Onboarding ("ob") or Training ("tr"). */
function resetProgress(scope) {
  const label = scope === "tr" ? "Training & Upskilling" : "Day 1 Onboarding";
  if (!confirm(`Reset all ${label} progress?`)) return;
  const list = scope === "tr" ? T : CORE_MODULES;
  list.forEach(m => { delete D[m.id]; });
  save();
  if (scope === "ob" && cur === "certificate") location.hash = `#${CORE_MODULES[0].id}`;
  else if (scope === "tr" && cur === "training-certificate") location.hash = "#training";
  else view();
}

function renderTrainingRail(activeGroup) {
  const libGroupsHtml =
    `<div class="grp">Reference Library</div>` +
    LIB_GROUPS.map(grp => {
      const isOpen = grp.name === activeGroup ? "open" : "";
      return `<details class="rail-det" ${isOpen}>
        <summary>${grp.name}</summary>
        <div class="det-links">
          ${grp.items.map(m => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${m.t}</span></a>`).join("")}
        </div>
      </details>`;
    }).join("");

  const trLink =
    `<div class="grp" style="margin-top:20px">Training</div>` +
    `<a href="#training" class="rail-feature"><span>🍷 Training &amp; Upskilling →</span></a>`;

  return libGroupsHtml + trLink;
}

function renderWineRail() {
  return `<a class="rail-back" href="#library">← Back to Reference Library</a>` +
    `<div class="grp">Wine Training</div>` +
    T.map(m => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${m.t}</span></a>`).join("") +
    `<div class="grp">Finish</div>` +
    `<a href="#training-certificate" class="${cur === "training-certificate" ? "on" : ""}"><b></b><span>Training Certificate</span></a>`;
}

/** Renders the Landing / Introduction page (#welcome) with the two entry paths. */
function renderHome(el) {
  setTopbar("landing");
  setRail(null);
  const obDone = cntOb(), obTotal = CORE_MODULES.length, obPct = obTotal ? Math.round((obDone / obTotal) * 100) : 0;
  const trDone = cntTr(), trTotal = T.length, trPct = trTotal ? Math.round((trDone / trTotal) * 100) : 0;
  const startHref = obDone === obTotal ? "#certificate" : `#${nextObId()}`;
  const startCta = obDone === 0 ? "Get started →" : (obDone === obTotal ? "Review Day 1 →" : `Continue (Step ${obDone + 1} of ${obTotal}) →`);

  el.innerHTML = `
    <section class="hero card">
      <p class="eyebrow">Gastronomy · PwC Sydney</p>
      <h1>Welcome to the team</h1>
      <p class="lead">Gastronomy is a hospitality business for good, part of OzHarvest Ventures. At PwC Sydney we look after the people who work here and the clients who visit them.</p>
      <div class="purpose-pill"><b>Our purpose:</b> Strengthen the team. We cover for each other, share what we know, and step in when we see a need.</div>
    </section>

    <h2 class="sec-t">Where would you like to go?</h2>
    <div class="bento-2">
      <a class="card path-card featured" href="${startHref}">
        <div class="pc-top"><span class="tag">New staff</span><span class="badge">${obDone}/${obTotal} done</span></div>
        <h3>Get Started · Day 1 Onboarding</h3>
        <p>A guided, step-by-step walkthrough for your first shift — uniform standards, floor locations, Cloud Booking, beverage service, and your Day 1 certificate.</p>
        <div class="mini-bar"><i style="width:${obPct}%"></i></div>
        <span class="go-link">${startCta}</span>
      </a>
      <a class="card path-card" href="#library">
        <div class="pc-top"><span class="tag">Existing staff</span><span class="badge">${trDone}/${trTotal} training</span></div>
        <h3>Training &amp; Library</h3>
        <p>Browse the operational <b>Reference Library</b> (Franke Mytico, catering, formal service &amp; checklists) or jump into dedicated <b>Training</b> modules like Wine Training.</p>
        <div class="mini-bar"><i style="width:${trPct}%"></i></div>
        <span class="go-link">Open Reference Library →</span>
      </a>
    </div>

    <h2 class="sec-t">What we do at PwC</h2>
    <div class="bento-4">
      <div class="card mini-card static"><h3>☕ Meeting rooms</h3><p>Barista coffee, Franke Mytico &amp; boardroom beverage service.</p></div>
      <div class="card mini-card static"><h3>🍷 Functions &amp; events</h3><p>Multi-function rooms, formal dining &amp; cocktail service.</p></div>
      <div class="card mini-card static"><h3>🥐 The Edge</h3><p>Our staff café on Level 16.</p></div>
      <div class="card mini-card static"><h3>📅 Behind the scenes</h3><p>Pantries, Cloud Booking &amp; daily shift standards.</p></div>
    </div>

    <h2 class="sec-t">Meet the team</h2>
    <div class="bento-4">
      <div class="card person"><span class="av">TM</span><h3>Tammy McGregor</h3><p class="role">Food and Beverage Manager</p><p>Leads the Gastronomy team on site.</p></div>
      <div class="card person"><span class="av">AA</span><h3>Aayush Acharya</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">AV</span><h3>Andrew Vongratsavai</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">WY</span><h3>Wendy Yang</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
    </div>`;
}

/** Builds the interactive slide deck HTML container for modules with `m.slides`. */
function renderSlides(slides) {
  if (!slides || !slides.length) return "";
  return `
    <h2>Training slides</h2>
    <div class="card deck" id="deck">
      <div class="deck-top">
        <span class="deck-count" id="s-cnt">Slide 1 of ${slides.length}</span>
        <div class="deck-dots" id="s-dots">${slides.map((_, i) => `<button type="button" class="dot ${i === 0 ? "on" : ""}" data-i="${i}" aria-label="Slide ${i + 1}"></button>`).join("")}</div>
      </div>
      <div class="slide" id="s-stage"></div>
      <div class="deck-nav">
        <button type="button" id="s-prev">← Previous</button>
        <button type="button" class="p" id="s-next">Next →</button>
      </div>
    </div>`;
}

function bindSlides(slides) {
  if (!slides || !slides.length) return;
  slideIdx = 0;
  const show = idx => {
    slideIdx = Math.max(0, Math.min(slides.length - 1, idx));
    const s = slides[slideIdx];
    $("#s-cnt").textContent = `Slide ${slideIdx + 1} of ${slides.length}`;
    $("#s-stage").innerHTML =
      (s.title ? `<h3>${s.title}</h3>` : "") +
      (s.img ? `<img src="${s.img}" alt="${s.title || "Training slide"}" class="slide-img zoomable">` : "") +
      (s.body ? `<div class="prose">${s.body}</div>` : "") +
      (s.note ? `<div class="slide-note">${s.note}</div>` : "");
    document.querySelectorAll("#s-dots .dot").forEach((d, i) => d.classList.toggle("on", i === slideIdx));
    $("#s-prev").disabled = slideIdx === 0;
    $("#s-next").disabled = slideIdx === slides.length - 1;
    bindZoom("#s-stage");
  };
  $("#s-prev").onclick = () => show(slideIdx - 1);
  $("#s-next").onclick = () => show(slideIdx + 1);
  document.querySelectorAll("#s-dots .dot").forEach(d => {
    d.onclick = () => show(+d.dataset.i);
  });
  show(0);
}

/** Strips empty headings and removes borders from image-only Word-converted tables. */
function cleanLegacyProse(root) {
  root.querySelectorAll(".prose h1, .prose h2").forEach(h => {
    if (!h.textContent.trim()) h.remove();
  });
  root.querySelectorAll(".prose table").forEach(tbl => {
    const imgs = tbl.querySelectorAll("img");
    const txt = tbl.textContent.replace(/\s+/g, "");
    if (imgs.length && !txt) tbl.classList.add("img-table");
    const thead = tbl.querySelector("thead");
    if (thead && !thead.textContent.trim() && !thead.querySelector("img")) thead.remove();
  });
}

/** Attaches click-to-zoom lightbox handlers to all images within `scope`. */
function bindZoom(scope = "#main") {
  document.querySelectorAll(`${scope} .prose img, ${scope} img.zoomable`).forEach(img => {
    img.classList.add("zoomable");
    img.onclick = () => {
      $("#lb-img").src = img.src;
      $("#lb-img").alt = img.alt || "Zoomed reference";
      $("#lightbox").hidden = false;
    };
  });
}

/** Renders a single Day 1 Onboarding step with linear "Complete & Continue" flow. */
function renderOnboardingLesson(el, m) {
  const idx = CORE_MODULES.findIndex(x => x.id === m.id);
  const prev = idx > 0 ? CORE_MODULES[idx - 1] : null;
  const next = idx < CORE_MODULES.length - 1 ? CORE_MODULES[idx + 1] : null;
  const nextHref = next ? `#${next.id}` : "#certificate";

  setTopbar("onboarding", `Step ${idx + 1} of ${CORE_MODULES.length}`);
  setRail(renderOnboardingRail());

  const q = m.quiz
    ? m.quiz.map((x, k) => `<div class="q"><b>${k + 1}. ${x.q}</b>${x.o.map((o, j) => `<label><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") +
      `<button id="chk">Check answers</button><div class="msg" id="res"></div>`
    : "";

  const bodyHtml = m.html
    ? `<div class="card prose">${m.html}</div>`
    : (m.pts ? `<div class="card"><ul class="pts">${m.pts.map(p => `<li>${p}</li>`).join("")}</ul></div>` : "");

  el.innerHTML =
    `<p class="eyebrow">Step ${idx + 1} of ${CORE_MODULES.length} · Day 1 Essentials</p><h1>${m.t}</h1>` +
    (m.intro ? `<p class="lead">${m.intro}</p>` : "") +
    bodyHtml +
    renderSlides(m.slides) +
    (m.table ? `<h2>Quick reference</h2><div class="card scroll"><table><tr>${m.table.h.map(h => `<th>${h}</th>`).join("")}</tr>${m.table.r.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>` : "") +
    (q ? `<h2>Quick check</h2><div class="card">${q}</div>` : "") +
    `<div class="row">
      ${prev ? `<a class="btn" href="#${prev.id}">← Previous</a>` : ""}
      <button class="p" id="mk-next" ${m.quiz && !D[m.id] ? "disabled" : ""}>${next ? "Complete &amp; Continue →" : "Complete &amp; Get Certificate →"}</button>
    </div>`;

  cleanLegacyProse(el);
  bindSlides(m.slides);
  bindZoom("#main");

  const c = $("#chk");
  if (c) {
    c.onclick = () => {
      let ok = 0;
      m.quiz.forEach((x, k) => {
        const r = document.querySelector(`input[name=q${k}]:checked`);
        document.querySelectorAll(`input[name=q${k}]`).forEach(e => e.parentElement.className = "");
        if (r) {
          const good = +r.value === x.a;
          r.parentElement.className = good ? "ok" : "bad";
          if (good) ok++;
        }
      });
      const all = ok === m.quiz.length;
      $("#res").className = "msg " + (all ? "ok" : "bad");
      $("#res").textContent = all ? "All correct! Ready to continue." : `${ok}/${m.quiz.length} correct. Fix the red answers and check again.`;
      $("#mk-next").disabled = !all;
    };
  }

  $("#mk-next").onclick = () => {
    D[m.id] = 1;
    save();
    location.hash = nextHref;
  };
}

/** Renders the Reference Library landing view (#library) with Training link at bottom. */
function renderLibraryHome(el) {
  setTopbar("training");
  setRail(renderTrainingRail(null));
  const trDone = cntTr(), trTotal = T.length, trPct = trTotal ? Math.round((trDone / trTotal) * 100) : 0;

  el.innerHTML = `
    <p class="eyebrow">Existing staff · Operational guides</p>
    <h1>Reference Library</h1>
    <p class="lead">Browse operational SOPs, equipment guides, and checklists — or scroll down for dedicated skill training.</p>

    <div class="cat-grid">
      ${LIB_GROUPS.map(grp => `
        <a class="card topic-card" href="#${grp.items[0].id}">
          <h3>${grp.name}</h3>
          <span class="go-link">Open →</span>
        </a>`).join("")}
    </div>

    <h2 class="sec-t">Training &amp; Upskilling</h2>
    <a class="card path-card featured" href="#training" style="margin:12px 0 0">
      <div class="pc-top"><span class="tag">Dedicated Training</span><span class="badge">${trDone}/${trTotal} completed</span></div>
      <h3>🍷 Training &amp; Upskilling (Wine Training)</h3>
      <p>Opens the dedicated Training page with slide decks (slide deck will be uploaded shortly), knowledge checks, and your Training Certificate.</p>
      <div class="mini-bar"><i style="width:${trPct}%"></i></div>
      <span class="go-link">Go to Training page →</span>
    </a>`;
}

/** Renders the dedicated Training & Upskilling page (#training). */
function renderTrainingPage(el) {
  setTopbar("training");
  setRail(renderWineRail());
  const done = cntTr(), total = T.length, pct = total ? Math.round((done / total) * 100) : 0;

  el.innerHTML = `
    <div class="hub-head">
      <div>
        <p class="eyebrow">Dedicated Training</p>
        <h1>Training &amp; Upskilling</h1>
        <p class="lead">Focused training tracks with interactive slide decks and quizzes.</p>
      </div>
      <div class="card stat-box">
        <div class="stat-top">
          <div class="stat-num">${pct}%</div>
          ${done ? `<button type="button" class="mini-reset" id="reset-tr" title="Reset training progress">↺ Reset</button>` : ""}
        </div>
        <div class="stat-sub">${done} of ${total} completed</div>
        <div class="mini-bar"><i style="width:${pct}%"></i></div>
      </div>
    </div>

    <h2 class="sec-t">🍷 Wine Training</h2>
    <div class="topic-grid">
      ${T.map((m, idx) => `
        <a class="card topic-card ${D[m.id] ? "is-done" : ""}" href="#${m.id}">
          <div class="tc-top">
            <span class="tc-num">Module ${idx + 1} · ${m.slides ? `${m.slides.length} slides` : "Lesson"}</span>
            <span class="tc-state">${D[m.id] ? "✓ Learned" : (m.quiz ? "Quiz" : "Read")}</span>
          </div>
          <h3>${m.t}</h3>
          <p>${m.intro || ""}</p>
          <span class="go-link">${D[m.id] ? "Review →" : "Start →"}</span>
        </a>`).join("")}
      <a class="card topic-card cert-card" href="#training-certificate">
        <div class="tc-top"><span class="tc-num">Finish</span><span class="tc-state">${done === total ? "Unlocked ✓" : "Locked"}</span></div>
        <h3>Training Certificate</h3>
        <p>Complete all ${total} Wine Training modules to unlock your certificate.</p>
        <span class="go-link">Open certificate →</span>
      </a>
    </div>`;

  const rt = $("#reset-tr");
  if (rt) rt.onclick = () => resetProgress("tr");
}

/** Renders a Training or Reference Library module (`isWine` switches rail to Wine Training). */
function renderTrainingLesson(el, m, list, isWine) {
  setTopbar("training");
  setRail(isWine ? renderWineRail() : renderTrainingRail(m.g));

  const idx = list.findIndex(x => x.id === m.id);
  const prev = idx > 0 ? list[idx - 1] : null;
  const next = idx < list.length - 1 ? list[idx + 1] : null;

  const q = m.quiz
    ? m.quiz.map((x, k) => `<div class="q"><b>${k + 1}. ${x.q}</b>${x.o.map((o, j) => `<label><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") +
      `<button id="chk">Check answers</button><div class="msg" id="res"></div>`
    : "";

  const bodyHtml = m.html
    ? `<div class="card prose">${m.html}</div>`
    : (m.pts ? `<div class="card"><ul class="pts">${m.pts.map(p => `<li>${p}</li>`).join("")}</ul></div>` : "");

  el.innerHTML =
    `<p class="eyebrow">${m.g}</p><h1>${m.t}</h1>` +
    (m.intro ? `<p class="lead">${m.intro}</p>` : "") +
    bodyHtml +
    renderSlides(m.slides) +
    (m.table ? `<h2>Quick reference</h2><div class="card scroll"><table><tr>${m.table.h.map(h => `<th>${h}</th>`).join("")}</tr>${m.table.r.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>` : "") +
    (q ? `<h2>Quick quiz</h2><div class="card">${q}</div>` : "") +
    `<div class="row">
      ${prev ? `<a class="btn" href="#${prev.id}">← Previous</a>` : ""}
      <button class="p" id="mk" ${m.quiz && !D[m.id] ? "disabled" : ""}>${D[m.id] ? "Learned ✓" : "Mark as learned"}</button>
      ${next ? `<a class="btn" href="#${next.id}">Next: ${next.t} →</a>` : (isWine ? `<a class="btn" href="#training-certificate">Finish: Training Certificate →</a>` : "")}
    </div>`;

  cleanLegacyProse(el);
  bindSlides(m.slides);
  bindZoom("#main");

  const c = $("#chk");
  if (c) {
    c.onclick = () => {
      let ok = 0;
      m.quiz.forEach((x, k) => {
        const r = document.querySelector(`input[name=q${k}]:checked`);
        document.querySelectorAll(`input[name=q${k}]`).forEach(e => e.parentElement.className = "");
        if (r) {
          const good = +r.value === x.a;
          r.parentElement.className = good ? "ok" : "bad";
          if (good) ok++;
        }
      });
      const all = ok === m.quiz.length;
      $("#res").className = "msg " + (all ? "ok" : "bad");
      $("#res").textContent = all ? "All correct. You can mark this topic as learned." : `${ok}/${m.quiz.length} correct. Fix the red answers and check again.`;
      $("#mk").disabled = !all;
    };
  }

  $("#mk").onclick = () => {
    D[m.id] = 1;
    save();
    view();
  };
}

let ROLE = "", START_DT = "";
try {
  ROLE = localStorage.getItem("ob-role") || "Casual FOH";
  START_DT = localStorage.getItem("ob-start") || new Date().toISOString().slice(0, 10);
} catch (e) {}

/**
 * Renders the formal Staff Completion Record (#certificate or #training-certificate)
 * with live form fields, HTML5 signature canvas, module checklist table, and PDF print layout.
 */
function renderCert(el, kind) {
  const isTr = kind === "tr";
  setTopbar(isTr ? "training" : "onboarding", isTr ? null : "Finish · Certificate");
  setRail(isTr ? renderWineRail() : renderOnboardingRail());

  const list = isTr ? T : CORE_MODULES;
  const done = isTr ? cntTr() : cntOb();
  const total = list.length;
  const ready = total > 0 && done === total;
  const title = isTr ? "Training & Upskilling (Wine Training)" : "Day 1 Onboarding";
  const todayIso = new Date().toISOString().slice(0, 10);
  const fmtDate = iso => {
    if (!iso) return "—";
    const [y, m, d] = iso.split("-");
    return new Date(+y, +m - 1, +d).toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" });
  };
  const recId = "PWCSYD-" + Math.abs((N + title + todayIso).split("").reduce((a, c) => ((a << 5) - a + c.charCodeAt(0)) | 0, 0)).toString(36).toUpperCase().slice(0, 6);

  if (!ready) {
    el.innerHTML = `<p class="eyebrow">Finish</p><h1>${isTr ? "Training Record" : "Day 1 Completion Record"}</h1><p class="lead">Finish all ${total} ${isTr ? "training" : "Day 1"} topics to unlock your completion record &amp; PDF. You have completed ${done} of ${total}.</p><div class="row"><a class="btn p" href="#${isTr ? T[0].id : nextObId()}">Continue ${isTr ? "training" : "Day 1"} →</a></div>`;
    return;
  }

  el.innerHTML = `
    <div class="noprint">
      <p class="eyebrow">Finish</p>
      <h1>${isTr ? "Training" : "Day 1"} completion record</h1>
      <p class="lead">Fill in your details and sign below to generate your PDF record for your manager or yourself.</p>

      <div class="card sign-form">
        <div class="form-grid">
          <label><span>Staff name *</span><input type="text" id="nm" placeholder="Full name" value="${N.replace(/"/g, "&quot;")}"></label>
          <label><span>Role</span>
            <select id="rl">
              ${["Casual FOH", "Barista", "Functions & Events", "Café / The Edge", "Supervisor"].map(r => `<option value="${r}" ${ROLE === r ? "selected" : ""}>${r}</option>`).join("")}
            </select>
          </label>
          <label><span>Start date</span><input type="date" id="sd" value="${START_DT}"></label>
          <label><span>Completion date</span><input type="date" id="cd" value="${todayIso}"></label>
        </div>

        <div class="sig-wrap">
          <div class="sig-head"><span>Staff member signature *</span><button type="button" class="mini-reset" id="sig-clr">Clear</button></div>
          <canvas id="sig-cv" class="sig-cv" width="520" height="140"></canvas>
          <span class="sig-hint">Sign with your finger, stylus, or mouse</span>
        </div>

        <label class="decl-chk"><input type="checkbox" id="decl-ok" checked> <span>I confirm I have completed the ${title} with Gastronomy at PwC Sydney, read and understood the standards and procedures, and agree to work to them.</span></label>

        <div class="row" style="margin-top:16px;padding-top:16px">
          <button type="button" class="p" id="save-pdf">Save / Print PDF</button>
        </div>
      </div>
    </div>

    <article class="record card" id="record-doc">
      <div class="rec-head">
        <div class="logo rec-logo"><span>g</span>astronomy</div>
        <div class="rec-meta-r">
          <div class="rec-type">STAFF ${isTr ? "TRAINING" : "ONBOARDING"} RECORD</div>
          <div class="rec-ts">Issued ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "short", year: "numeric" })}</div>
        </div>
      </div>

      <div class="rec-who">
        <h2 id="r-name">${N || "Staff Member"}</h2>
        <p><span id="r-role">${ROLE}</span> · Gastronomy, PwC Sydney (Barangaroo)</p>
      </div>

      <div class="rec-grid">
        <div><span class="rk">Start date</span><b id="r-sd">${fmtDate(START_DT)}</b></div>
        <div><span class="rk">Completion date</span><b id="r-cd">${fmtDate(todayIso)}</b></div>
        <div><span class="rk">Modules learned</span><b>${done} of ${total}</b></div>
        <div><span class="rk">Knowledge checks</span><b>Passed ✓</b></div>
      </div>

      <h3>Completed modules</h3>
      <table class="rec-tbl">
        <thead><tr><th>Section</th><th>Module</th><th>Status</th></tr></thead>
        <tbody>
          ${list.map(m => `<tr><td class="mut">${m.g}</td><td>${m.t}</td><td class="ok">✓ Completed</td></tr>`).join("")}
        </tbody>
      </table>

      <div class="rec-decl">
        <h3>Declaration</h3>
        <p id="r-decl-txt">I, <b>${N || "Staff Member"}</b>, confirm I have completed ${title} with Gastronomy at PwC Sydney, read and understood the uniform standards, food safety, and operating procedures, and agree to work to these standards.</p>
        <div class="rec-sig-box">
          <img id="r-sig-img" alt="Staff signature" hidden>
          <div id="r-sig-empty" class="sig-empty">Signed above</div>
          <div class="rec-sig-meta">
            <span>STAFF MEMBER</span>
            <b id="r-sig-name">${N || "Staff Member"}</b>
            <span id="r-sig-dt">${fmtDate(todayIso)}</span>
          </div>
        </div>
      </div>

      <div class="rec-foot">
        <span>Gastronomy · PwC Sydney · One International Towers, Barangaroo</span>
        <span>Record ${recId}</span>
      </div>
    </article>`;

  const sync = () => {
    const nmVal = $("#nm").value.trim() || "Staff Member";
    N = $("#nm").value;
    ROLE = $("#rl").value;
    START_DT = $("#sd").value;
    const cdVal = $("#cd").value;
    save();
    try { localStorage.setItem("ob-role", ROLE); localStorage.setItem("ob-start", START_DT); } catch (e) {}
    $("#r-name").textContent = nmVal;
    $("#r-role").textContent = ROLE;
    $("#r-sd").textContent = fmtDate(START_DT);
    $("#r-cd").textContent = fmtDate(cdVal);
    $("#r-sig-name").textContent = nmVal;
    $("#r-sig-dt").textContent = fmtDate(cdVal);
    $("#r-decl-txt").innerHTML = `I, <b>${nmVal}</b>, confirm I have completed ${title} with Gastronomy at PwC Sydney, read and understood the uniform standards, food safety, and operating procedures, and agree to work to these standards.`;
  };

  $("#nm").oninput = sync;
  $("#rl").onchange = sync;
  $("#sd").onchange = sync;
  $("#cd").onchange = sync;

  // Signature canvas
  const cv = $("#sig-cv"), ctx = cv.getContext("2d");
  ctx.lineWidth = 2.2;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = "#111";
  let drawing = false, hasSig = false;

  const pos = e => {
    const r = cv.getBoundingClientRect();
    const t = e.touches ? e.touches[0] : e;
    return [(t.clientX - r.left) * (cv.width / r.width), (t.clientY - r.top) * (cv.height / r.height)];
  };
  const start = e => {
    e.preventDefault();
    drawing = true;
    const [x, y] = pos(e);
    ctx.beginPath();
    ctx.moveTo(x, y);
  };
  const move = e => {
    if (!drawing) return;
    e.preventDefault();
    const [x, y] = pos(e);
    ctx.lineTo(x, y);
    ctx.stroke();
    hasSig = true;
  };
  const end = () => {
    if (!drawing) return;
    drawing = false;
    if (hasSig) {
      $("#r-sig-img").src = cv.toDataURL("image/png");
      $("#r-sig-img").hidden = false;
      $("#r-sig-empty").hidden = true;
    }
  };

  cv.addEventListener("mousedown", start);
  cv.addEventListener("mousemove", move);
  addEventListener("mouseup", end);
  cv.addEventListener("touchstart", start, { passive: false });
  cv.addEventListener("touchmove", move, { passive: false });
  cv.addEventListener("touchend", end);

  $("#sig-clr").onclick = () => {
    ctx.clearRect(0, 0, cv.width, cv.height);
    hasSig = false;
    $("#r-sig-img").hidden = true;
    $("#r-sig-empty").hidden = false;
  };

  $("#save-pdf").onclick = () => {
    if (!$("#nm").value.trim()) { $("#nm").focus(); return alert("Please enter your full name first."); }
    if (!$("#decl-ok").checked) return alert("Please tick the declaration checkbox.");
    print();
  };

  launchConfetti();
}

/** Plays a brief Gastronomy-themed confetti burst when a completion record is unlocked. */
function launchConfetti() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const cv = document.createElement("canvas");
  cv.className = "confetti-cv";
  cv.width = innerWidth;
  cv.height = innerHeight;
  document.body.appendChild(cv);
  const ctx = cv.getContext("2d");
  const colors = ["#f5dd3f", "#111111", "#ffffff", "#2f7a45", "#c99d78"];
  const pieces = Array.from({ length: 90 }, () => ({
    x: cv.width * (0.2 + Math.random() * 0.6),
    y: cv.height * 0.25,
    vx: (Math.random() - 0.5) * 11,
    vy: -Math.random() * 10 - 3,
    w: 6 + Math.random() * 6,
    h: 4 + Math.random() * 5,
    rot: Math.random() * Math.PI * 2,
    vr: (Math.random() - 0.5) * 0.25,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));
  let frame = 0;
  function tick() {
    ctx.clearRect(0, 0, cv.width, cv.height);
    pieces.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.28;
      p.rot += p.vr;
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = Math.max(0, 1 - frame / 130);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    frame++;
    if (frame < 130) requestAnimationFrame(tick);
    else cv.remove();
  }
  requestAnimationFrame(tick);
}

let cur = "welcome";

/** Hash router: resolves `location.hash` to Landing, Onboarding, Library, Training, or Record. */
function view() {
  cur = location.hash.slice(1) || "welcome";
  const el = $("#main");
  el.classList.remove("anim-in");
  void el.offsetWidth;
  el.classList.add("anim-in");

  if (cur === "welcome") return renderHome(el);
  if (cur === "library") return renderLibraryHome(el);
  if (cur === "training") return renderTrainingPage(el);
  if (cur === "certificate") return renderCert(el, "ob");
  if (cur === "training-certificate") return renderCert(el, "tr");

  const coreM = CORE_MODULES.find(m => m.id === cur);
  if (coreM) return renderOnboardingLesson(el, coreM);

  const trM = T.find(m => m.id === cur);
  if (trM) return renderTrainingLesson(el, trM, T, true);

  const libM = LIB_MODULES.find(m => m.id === cur);
  if (libM) return renderTrainingLesson(el, libM, LIB_MAP[libM.g].items, false);

  cur = "welcome";
  renderHome(el);
}

// Search popover (Training & Library only)
function runSearch() {
  const f = $("#s").value.trim().toLowerCase();
  const pop = $("#s-pop");
  if (!f) {
    pop.hidden = true;
    pop.innerHTML = "";
    return;
  }
  const hits = TRAINING_ALL.filter(m => {
    if (m.x && m.x.includes(f)) return true;
    return (m.t + " " + m.g + " " + (m.intro || "")).toLowerCase().includes(f);
  }).slice(0, 10);

  pop.innerHTML = hits.length
    ? hits.map(m => `<a href="#${m.id}"><span class="sp-g">${m.g}</span><b>${m.t}</b></a>`).join("")
    : `<div class="sp-empty">No matching topics found.</div>`;
  pop.hidden = false;
  pop.querySelectorAll("a").forEach(a => {
    a.onclick = () => { pop.hidden = true; $("#s").value = ""; };
  });
}

$("#s").oninput = runSearch;
$("#s").onfocus = runSearch;
document.addEventListener("click", e => {
  if (!e.target.closest(".search-wrap")) $("#s-pop").hidden = true;
});

// Lightbox
$("#lb-close").onclick = () => { $("#lightbox").hidden = true; };
$("#lightbox").onclick = e => { if (e.target === $("#lightbox")) $("#lightbox").hidden = true; };

// Keyboard shortcuts
document.addEventListener("keydown", e => {
  if (e.key === "Escape" && !$("#lightbox").hidden) {
    $("#lightbox").hidden = true;
    return;
  }
  if (!$("#deck") || e.target.tagName === "INPUT") return;
  if (e.key === "ArrowLeft") $("#s-prev")?.click();
  if (e.key === "ArrowRight") $("#s-next")?.click();
});

// Theme toggle
function setTheme(t) {
  document.documentElement.dataset.theme = t;
  const b = $("#theme-btn");
  if (b) {
    b.textContent = t === "dark" ? "☀️" : "🌙";
    const label = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
    b.title = label;
    b.setAttribute("aria-label", label);
  }
  try { localStorage.setItem("ob-theme", t); } catch (e) {}
}

const initTheme = (() => {
  try {
    const s = localStorage.getItem("ob-theme");
    if (s === "dark" || s === "light") return s;
  } catch (e) {}
  return matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
})();
setTheme(initTheme);
$("#theme-btn").onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");

// Mobile drawer
$("#menu").onclick = () => document.body.classList.toggle("open");
$("#scrim").onclick = () => document.body.classList.remove("open");
addEventListener("hashchange", () => {
  document.body.classList.remove("open");
  $("#s-pop").hidden = true;
  view();
  scrollTo(0, 0);
});

view();
