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
const ALL = [...M.filter(m => m.id !== "welcome"), ...T];

const slug = g => g.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
const LIB_GROUPS = [];
const LIB_MAP = {};
LIB_MODULES.forEach(m => {
  const s = slug(m.g);
  if (!LIB_MAP[s]) {
    LIB_MAP[s] = { slug: s, name: m.g, items: [] };
    LIB_GROUPS.push(LIB_MAP[s]);
  }
  LIB_MAP[s].items.push(m);
});

const CAT_ICONS = {
  "Checklists": "☑",
  "1 · Locations & storerooms": "📍",
  "2 · Equipment & barista": "☕",
  "3 · Cloud Booking": "📅",
  "4 · Meeting rooms": "🏢",
  "5 · Multi-function": "🪑",
  "6 · Café": "🥐",
  "7 · Catering": "🍽",
  "8 · Formal service": "🍷"
};

const cntOb = () => CORE_MODULES.filter(m => D[m.id]).length;
const cntTr = () => T.filter(m => D[m.id]).length;

function updateProgressPills() {
  const p1 = CORE_MODULES.length ? Math.round((cntOb() / CORE_MODULES.length) * 100) : 0;
  const p2 = T.length ? Math.round((cntTr() / T.length) * 100) : 0;
  $("#p-day1").textContent = p1 + "%";
  $("#p-tr").textContent = p2 + "%";
}

function setActiveTab(tab) {
  document.querySelectorAll("#top-nav a, .drawer-nav a").forEach(a => {
    a.classList.toggle("on", a.dataset.tab === tab);
  });
}

function setRail(items, label, backHref, backText, certHash, certLabel) {
  const rail = $("#rail");
  const dRail = $("#drawer-rail");
  if (!items || !items.length) {
    rail.hidden = true;
    rail.innerHTML = "";
    dRail.innerHTML = "";
    $("#shell").classList.remove("with-rail");
    return;
  }
  const html =
    `<a class="rail-back" href="${backHref}">← ${backText}</a>` +
    `<div class="grp">${label}</div>` +
    items.map(m => `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b><span>${m.t}</span></a>`).join("") +
    (certHash ? `<div class="grp">Finish</div><a href="#${certHash}" class="${cur === certHash ? "on" : ""}"><b></b><span>${certLabel}</span></a>` : "");
  rail.innerHTML = html;
  rail.hidden = false;
  dRail.innerHTML = html;
  $("#shell").classList.add("with-rail");
}

function renderHome(el) {
  setActiveTab("home");
  setRail(null);
  const obDone = cntOb(), obTotal = CORE_MODULES.length, obPct = obTotal ? Math.round((obDone / obTotal) * 100) : 0;
  const trDone = cntTr(), trTotal = T.length, trPct = trTotal ? Math.round((trDone / trTotal) * 100) : 0;

  el.innerHTML = `
    <section class="hero card">
      <p class="eyebrow">Gastronomy · PwC Sydney</p>
      <h1>Welcome to the team</h1>
      <p class="lead">Gastronomy is a hospitality business for good, part of OzHarvest Ventures. Everything you need for your first shift — and ongoing team training — lives right here.</p>
      <div class="purpose-pill"><b>Our purpose:</b> Strengthen the team. We cover for each other, share what we know, and step in when we see a need.</div>
    </section>

    <h2 class="sec-t">Choose your path</h2>
    <div class="bento-2">
      <a class="card path-card featured" href="#day1">
        <div class="pc-top"><span class="tag">New staff</span><span class="badge">${obDone}/${obTotal} done</span></div>
        <h3>Let’s get you started</h3>
        <p>Step-by-step Day 1 essentials: uniform standards, floor locations, Cloud Booking, beverage service, and your Day 1 certificate.</p>
        <div class="mini-bar"><i style="width:${obPct}%"></i></div>
        <span class="go-link">Open Day 1 Onboarding →</span>
      </a>
      <a class="card path-card" href="#training">
        <div class="pc-top"><span class="tag">Existing staff</span><span class="badge">${trDone}/${trTotal} done</span></div>
        <h3>Training &amp; Upskilling</h3>
        <p>Dedicated skill tracks including <b>Wine Training</b>, interactive slide decks, knowledge checks, and team certificates.</p>
        <div class="mini-bar"><i style="width:${trPct}%"></i></div>
        <span class="go-link">Open Training Modules →</span>
      </a>
    </div>

    <h2 class="sec-t">What we do at PwC</h2>
    <div class="bento-4">
      <a class="card mini-card" href="#library"><h3>☕ Meeting rooms</h3><p>Barista coffee, Franke Mytico &amp; boardroom beverage service.</p></a>
      <a class="card mini-card" href="#cat/8-formal-service"><h3>🍷 Functions &amp; events</h3><p>Multi-function rooms, formal dining &amp; cocktail service.</p></a>
      <a class="card mini-card" href="#cat/6-caf"><h3>🥐 The Edge</h3><p>Our staff café on Level 16 — opening, closing &amp; wastage.</p></a>
      <a class="card mini-card" href="#cat/3-cloud-booking"><h3>📅 Behind the scenes</h3><p>Pantries, Cloud Booking &amp; daily shift standards.</p></a>
    </div>

    <h2 class="sec-t">Meet the team</h2>
    <div class="bento-4">
      <div class="card person"><span class="av">TM</span><h3>Tammy McGregor</h3><p class="role">Site Manager</p><p>Leads the Gastronomy team on site.</p></div>
      <div class="card person"><span class="av">AA</span><h3>Aayush Acharya</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">AV</span><h3>Andrew Vongratsavai</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
      <div class="card person"><span class="av">WY</span><h3>Wendy Yang</h3><p class="role">Supervisor</p><p>Supports the team on shift.</p></div>
    </div>`;
}

function renderDay1(el) {
  setActiveTab("day1");
  setRail(null);
  const done = cntOb(), total = CORE_MODULES.length, pct = total ? Math.round((done / total) * 100) : 0;

  el.innerHTML = `
    <div class="crumb"><a href="#welcome">Home</a> › <span>Day 1 Onboarding</span></div>
    <div class="hub-head">
      <div>
        <p class="eyebrow">New staff · Day 1 essentials</p>
        <h1>Let’s get you started</h1>
        <p class="lead">Complete all ${total} essential topics and pass their quizzes to unlock your Day 1 certificate.</p>
      </div>
      <div class="card stat-box">
        <div class="stat-num">${pct}%</div>
        <div class="stat-sub">${done} of ${total} completed</div>
        <div class="mini-bar"><i style="width:${pct}%"></i></div>
      </div>
    </div>
    <div class="topic-grid">
      ${CORE_MODULES.map((m, idx) => `
        <a class="card topic-card ${D[m.id] ? "is-done" : ""}" href="#${m.id}">
          <div class="tc-top">
            <span class="tc-num">Step ${idx + 1}</span>
            <span class="tc-state">${D[m.id] ? "✓ Learned" : (m.quiz ? "Quiz" : "Read")}</span>
          </div>
          <h3>${m.t}</h3>
          <span class="go-link">${D[m.id] ? "Review →" : "Start →"}</span>
        </a>`).join("")}
      <a class="card topic-card cert-card" href="#certificate">
        <div class="tc-top"><span class="tc-num">Finish</span><span class="tc-state">${done === total ? "Unlocked ✓" : "Locked"}</span></div>
        <h3>Day 1 Certificate</h3>
        <p>Download or print your completion certificate once all ${total} steps are done.</p>
        <span class="go-link">Open certificate →</span>
      </a>
    </div>`;
}

function renderLibrary(el) {
  setActiveTab("library");
  setRail(null);
  el.innerHTML = `
    <div class="crumb"><a href="#welcome">Home</a> › <span>Reference Library</span></div>
    <p class="eyebrow">Operational guides &amp; SOPs</p>
    <h1>Reference Library</h1>
    <p class="lead">Pick a category below to browse equipment guides, room setups, catering SOPs, and shift checklists.</p>
    <div class="cat-grid">
      ${LIB_GROUPS.map(grp => {
        const doneCount = grp.items.filter(m => D[m.id]).length;
        const icon = CAT_ICONS[grp.name] || "📘";
        return `
          <a class="card cat-card" href="#cat/${grp.slug}">
            <div class="cat-ico">${icon}</div>
            <h3>${grp.name}</h3>
            <p>${grp.items.length} topics${doneCount ? ` · ${doneCount} learned` : ""}</p>
            <span class="go-link">Browse →</span>
          </a>`;
      }).join("")}
    </div>`;
}

function renderCategory(el, catSlug) {
  setActiveTab("library");
  setRail(null);
  const grp = LIB_MAP[catSlug];
  if (!grp) return renderLibrary(el);

  el.innerHTML = `
    <div class="crumb"><a href="#welcome">Home</a> › <a href="#library">Reference Library</a> › <span>${grp.name}</span></div>
    <p class="eyebrow">Reference Library</p>
    <h1>${grp.name}</h1>
    <p class="lead">${grp.items.length} guides in this category.</p>
    <div class="topic-grid">
      ${grp.items.map(m => `
        <a class="card topic-card ${D[m.id] ? "is-done" : ""}" href="#${m.id}">
          <div class="tc-top">
            <span class="tc-num">${m.slides ? `${m.slides.length} slides` : "Guide"}</span>
            <span class="tc-state">${D[m.id] ? "✓ Learned" : (m.quiz ? "Quiz" : "Read")}</span>
          </div>
          <h3>${m.t}</h3>
          <span class="go-link">Open →</span>
        </a>`).join("")}
    </div>`;
}

function renderTraining(el) {
  setActiveTab("training");
  setRail(null);
  const done = cntTr(), total = T.length, pct = total ? Math.round((done / total) * 100) : 0;

  el.innerHTML = `
    <div class="crumb"><a href="#welcome">Home</a> › <span>Training &amp; Upskilling</span></div>
    <div class="hub-head">
      <div>
        <p class="eyebrow">Existing staff · Skill tracks</p>
        <h1>Training &amp; Upskilling</h1>
        <p class="lead">Focused training tracks with slide decks and quizzes to build confidence across wine service and events.</p>
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

function renderLesson(el, m, groupList, tab, backHref, backText, certHash, certLabel) {
  setActiveTab(tab);
  setRail(groupList, m.g, backHref, backText, certHash, certLabel);

  const idx = groupList.findIndex(x => x.id === m.id);
  const prev = idx > 0 ? groupList[idx - 1] : null;
  const next = idx < groupList.length - 1 ? groupList[idx + 1] : null;

  const q = m.quiz
    ? m.quiz.map((x, k) => `<div class="q"><b>${k + 1}. ${x.q}</b>${x.o.map((o, j) => `<label><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") +
      `<button id="chk">Check answers</button><div class="msg" id="res"></div>`
    : "";

  const bodyHtml = m.html
    ? `<div class="card prose">${m.html}</div>`
    : (m.pts ? `<div class="card"><ul class="pts">${m.pts.map(p => `<li>${p}</li>`).join("")}</ul></div>` : "");

  el.innerHTML =
    `<div class="crumb"><a href="#welcome">Home</a> › <a href="${backHref}">${backText}</a> › <span>${m.t}</span></div>` +
    `<p class="eyebrow">${m.g}</p><h1>${m.t}</h1>` +
    (m.intro ? `<p class="lead">${m.intro}</p>` : "") +
    bodyHtml +
    renderSlides(m.slides) +
    (m.table ? `<h2>Quick reference</h2><div class="card scroll"><table><tr>${m.table.h.map(h => `<th>${h}</th>`).join("")}</tr>${m.table.r.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>` : "") +
    (q ? `<h2>Quick quiz</h2><div class="card">${q}</div>` : "") +
    `<div class="row">
      ${prev ? `<a class="btn" href="#${prev.id}">← Previous</a>` : ""}
      <button class="p" id="mk" ${m.quiz && !D[m.id] ? "disabled" : ""}>${D[m.id] ? "Learned ✓" : "Mark as learned"}</button>
      <a class="btn" href="#${next ? next.id : certHash}">${next ? `Next: ${next.t}` : `Finish: ${certLabel}`} →</a>
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
  setActiveTab(isTr ? "training" : "day1");
  setRail(isTr ? T : CORE_MODULES, isTr ? "Wine Training" : "Day 1 essentials", isTr ? "#training" : "#day1", isTr ? "Training" : "Day 1", isTr ? "training-certificate" : "certificate", isTr ? "Training Certificate" : "Certificate");

  const done = isTr ? cntTr() : cntOb();
  const total = isTr ? T.length : CORE_MODULES.length;
  const ready = total > 0 && done === total;
  const title = isTr ? "Training & Upskilling (Wine Training)" : "Day 1 onboarding";

  el.innerHTML =
    `<div class="crumb"><a href="#welcome">Home</a> › <a href="${isTr ? "#training" : "#day1"}">${isTr ? "Training" : "Day 1"}</a> › <span>Certificate</span></div>` +
    (ready
      ? `<div class="noprint"><p class="eyebrow">Finish</p><h1>Your ${isTr ? "training " : ""}certificate</h1><p class="lead">Enter your full name as it should appear.</p><input type="text" id="nm" placeholder="Full name" value="${N.replace(/"/g, "&quot;")}"></div><div class="cert" style="margin-top:24px"><div class="logo"><span>g</span>astronomy</div><p class="eyebrow">Certificate of completion</p><p>This certifies that</p><h1 id="cn">${N || "Your name"}</h1><p>completed ${title} with Gastronomy at PwC Sydney on ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p></div><div class="row"><button class="p" onclick="print()">Print or save as PDF</button></div>`
      : `<p class="eyebrow">Finish</p><h1>${isTr ? "Training Certificate" : "Day 1 Certificate"}</h1><p class="lead">Finish all ${total} ${isTr ? "training" : "Day 1"} topics to unlock your certificate. You have completed ${done} of ${total}.</p><div class="row"><a class="btn p" href="#${isTr ? T[0].id : CORE_MODULES[0].id}">Continue ${isTr ? "training" : "Day 1"} →</a></div>`);

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
  updateProgressPills();

  if (cur === "welcome") return renderHome(el);
  if (cur === "day1") return renderDay1(el);
  if (cur === "library") return renderLibrary(el);
  if (cur === "training") return renderTraining(el);
  if (cur.startsWith("cat/")) return renderCategory(el, cur.slice(4));
  if (cur === "certificate") return renderCert(el, "ob");
  if (cur === "training-certificate") return renderCert(el, "tr");

  const coreM = CORE_MODULES.find(m => m.id === cur);
  if (coreM) return renderLesson(el, coreM, CORE_MODULES, "day1", "#day1", "Day 1", "certificate", "Certificate");

  const trM = T.find(m => m.id === cur);
  if (trM) return renderLesson(el, trM, T, "training", "#training", "Training", "training-certificate", "Training Certificate");

  const libM = LIB_MODULES.find(m => m.id === cur);
  if (libM) {
    const grp = LIB_MAP[slug(libM.g)];
    return renderLesson(el, libM, grp.items, "library", `#cat/${grp.slug}`, grp.name, "library", "Library");
  }

  cur = "welcome";
  renderHome(el);
}

// Search popover
function runSearch() {
  const f = $("#s").value.trim().toLowerCase();
  const pop = $("#s-pop");
  if (!f) {
    pop.hidden = true;
    pop.innerHTML = "";
    return;
  }
  const hits = ALL.filter(m => {
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

// Keyboard shortcuts (slides + lightbox)
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
