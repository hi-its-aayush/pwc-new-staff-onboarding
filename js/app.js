const $ = s => document.querySelector(s);
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

const CORE_MODULES = M.filter(m => m.core && m.id !== "welcome");
const LIB_MODULES = M.filter(m => !m.core);
const TRAINING_ALL = [...T, ...LIB_MODULES];

const LIB_GROUPS = [];
const LIB_MAP = {};
LIB_MODULES.forEach(m => {
  if (!LIB_MAP[m.g]) {
    LIB_MAP[m.g] = { name: m.g, items: [] };
    LIB_GROUPS.push(LIB_MAP[m.g]);
  }
  LIB_MAP[m.g].items.push(m);
});

const cntOb = () => CORE_MODULES.filter(m => D[m.id]).length;
const cntTr = () => T.filter(m => D[m.id]).length;
const nextObId = () => (CORE_MODULES.find(m => !D[m.id]) || CORE_MODULES[0]).id;

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
      </div>`;
  } else {
    sw.hidden = false;
    mid.innerHTML = `<span class="tb-tag">Training &amp; Reference Library</span>`;
  }
}

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

function renderTrainingRail(activeGroup) {
  const trLink =
    `<div class="grp">Training</div>` +
    `<a href="#training" class="rail-feature"><span>🍷 Training &amp; Upskilling →</span></a>`;

  const libGroupsHtml =
    `<div class="grp" style="margin-top:20px">Reference Library</div>` +
    LIB_GROUPS.map(grp => {
      const isOpen = grp.name === activeGroup ? "open" : "";
      return `<details class="rail-det" ${isOpen}>
        <summary>${grp.name} <span class="cnt">${grp.items.length}</span></summary>
        <div class="det-links">
          ${grp.items.map(m => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${m.t}</span></a>`).join("")}
        </div>
      </details>`;
    }).join("");

  return trLink + libGroupsHtml;
}

function renderWineRail() {
  return `<a class="rail-back" href="#library">← Back to Reference Library</a>` +
    `<div class="grp">Wine Training</div>` +
    T.map(m => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${m.t}</span></a>`).join("") +
    `<div class="grp">Finish</div>` +
    `<a href="#training-certificate" class="${cur === "training-certificate" ? "on" : ""}"><b></b><span>Training Certificate</span></a>`;
}

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
      <div class="card person"><span class="av">TM</span><h3>Tammy McGregor</h3><p class="role">Site Manager</p><p>Leads the Gastronomy team on site.</p></div>
      <div class="card person"><span class="av">AA</span><h3>Aayush Acharya</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">AV</span><h3>Andrew Vongratsavai</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">WY</span><h3>Wendy Yang</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
    </div>`;
}

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

function renderLibraryHome(el) {
  setTopbar("training");
  setRail(renderTrainingRail(null));
  const trDone = cntTr(), trTotal = T.length, trPct = trTotal ? Math.round((trDone / trTotal) * 100) : 0;

  el.innerHTML = `
    <p class="eyebrow">Existing staff · Operational guides</p>
    <h1>Reference Library</h1>
    <p class="lead">Browse operational SOPs, equipment guides, and checklists on the left — or jump into dedicated skill training below.</p>

    <a class="card path-card featured" href="#training" style="margin:20px 0 28px">
      <div class="pc-top"><span class="tag">Dedicated Training</span><span class="badge">${trDone}/${trTotal} completed</span></div>
      <h3>🍷 Training &amp; Upskilling (Wine Training)</h3>
      <p>Opens the dedicated Training page with Tammy’s slide decks, knowledge checks, and your Training Certificate.</p>
      <div class="mini-bar"><i style="width:${trPct}%"></i></div>
      <span class="go-link">Go to Training page →</span>
    </a>

    <h2 class="sec-t">Library Categories</h2>
    <div class="cat-grid">
      ${LIB_GROUPS.map(grp => `
        <a class="card topic-card" href="#${grp.items[0].id}">
          <div class="tc-top"><span class="tc-num">${grp.items.length} topics</span></div>
          <h3>${grp.name}</h3>
          <span class="go-link">Open →</span>
        </a>`).join("")}
    </div>`;
}

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
        <div class="stat-num">${pct}%</div>
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
}

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

function renderCert(el, kind) {
  const isTr = kind === "tr";
  setTopbar(isTr ? "training" : "onboarding", isTr ? null : "Finish · Certificate");
  setRail(isTr ? renderWineRail() : renderOnboardingRail());

  const done = isTr ? cntTr() : cntOb();
  const total = isTr ? T.length : CORE_MODULES.length;
  const ready = total > 0 && done === total;
  const title = isTr ? "Training & Upskilling (Wine Training)" : "Day 1 onboarding";

  el.innerHTML = ready
    ? `<div class="noprint"><p class="eyebrow">Finish</p><h1>Your ${isTr ? "training " : ""}certificate</h1><p class="lead">Enter your full name as it should appear.</p><input type="text" id="nm" placeholder="Full name" value="${N.replace(/"/g, "&quot;")}"></div><div class="cert" style="margin-top:24px"><div class="logo"><span>g</span>astronomy</div><p class="eyebrow">Certificate of completion</p><p>This certifies that</p><h1 id="cn">${N || "Your name"}</h1><p>completed ${title} with Gastronomy at PwC Sydney on ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p></div><div class="row"><button class="p" onclick="print()">Print or save as PDF</button></div>`
    : `<p class="eyebrow">Finish</p><h1>${isTr ? "Training Certificate" : "Day 1 Certificate"}</h1><p class="lead">Finish all ${total} ${isTr ? "training" : "Day 1"} topics to unlock your certificate. You have completed ${done} of ${total}.</p><div class="row"><a class="btn p" href="#${isTr ? T[0].id : nextObId()}">Continue ${isTr ? "training" : "Day 1"} →</a></div>`;

  const nm = $("#nm");
  if (nm) {
    nm.oninput = () => {
      N = nm.value;
      $("#cn").textContent = N || "Your name";
      save();
    };
  }
}

let cur = "welcome";

function view() {
  cur = location.hash.slice(1) || "welcome";
  const el = $("#main");

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
