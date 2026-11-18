const $ = s => document.querySelector(s);
let D = {}, N = "", mode = "ob", slideIdx = 0;
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

const ALL = [...M, ...T];
const CORE = M.filter(m => m.core);
const cntOb = () => CORE.filter(m => D[m.id]).length;
const cntTr = () => T.filter(m => D[m.id]).length;

function matchSearch(m, f) {
  if (!f) return true;
  if (m.x && m.x.includes(f)) return true;
  return (m.t + " " + m.g + " " + (m.intro || "")).toLowerCase().includes(f);
}

function nav() {
  const f = $("#s").value.trim().toLowerCase();
  const list = f ? ALL.filter(m => matchSearch(m, f)) : (mode === "tr" ? T : M);
  let h = "", g = "";

  if (!f && mode === "tr") {
    h += `<a href="#welcome" class="${cur === "welcome" ? "on" : ""}"><b></b>← Home / Introduction</a>`;
  }

  list.forEach(m => {
    if (m.g !== g) {
      g = m.g;
      h += `<div class="grp">${g}</div>`;
    }
    h += `<a href="#${m.id}" class="${D[m.id] ? "done" : ""} ${cur === m.id ? "on" : ""}"><b></b>${m.t}</a>`;
  });

  if (!f) {
    if (mode === "tr") {
      h += `<div class="grp">Finish</div><a href="#training-certificate" class="${cur === "training-certificate" ? "on" : ""}"><b></b>Training Certificate</a>`;
    } else {
      h += `<div class="grp">Finish</div><a href="#certificate" class="${cur === "certificate" ? "on" : ""}"><b></b>Certificate</a>`;
    }
  }

  $("#nav").innerHTML = h;
  $("#tab-ob").classList.toggle("on", mode === "ob");
  $("#tab-tr").classList.toggle("on", mode === "tr");

  const done = mode === "tr" ? cntTr() : cntOb();
  const total = mode === "tr" ? T.length : CORE.length;
  const p = total ? Math.round((done / total) * 100) : 0;
  $("#plabel").textContent = mode === "tr" ? "Training progress" : "Day 1 readiness";
  $("#fill").style.width = p + "%";
  $("#pct").textContent = p + "%";
  $("#pct2").textContent = p + "%";
  $("#fill2").style.width = p + "%";
}

let cur = "welcome";

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
      (s.img ? `<img src="${s.img}" alt="${s.title || "Training slide"}" class="slide-img">` : "") +
      (s.body ? `<div class="prose">${s.body}</div>` : "") +
      (s.note ? `<div class="slide-note">${s.note}</div>` : "");
    document.querySelectorAll("#s-dots .dot").forEach((d, i) => d.classList.toggle("on", i === slideIdx));
    $("#s-prev").disabled = slideIdx === 0;
    $("#s-next").disabled = slideIdx === slides.length - 1;
  };
  $("#s-prev").onclick = () => show(slideIdx - 1);
  $("#s-next").onclick = () => show(slideIdx + 1);
  document.querySelectorAll("#s-dots .dot").forEach(d => {
    d.onclick = () => show(+d.dataset.i);
  });
  show(0);
}

function view() {
  cur = location.hash.slice(1) || "welcome";
  const el = $("#main");

  if (cur === "certificate") {
    mode = "ob";
    return cert(el, "ob");
  }
  if (cur === "training-certificate") {
    mode = "tr";
    return cert(el, "tr");
  }

  let list = M, idx = M.findIndex(m => m.id === cur);
  if (idx !== -1) {
    if (cur !== "welcome") mode = "ob";
  } else {
    idx = T.findIndex(m => m.id === cur);
    if (idx !== -1) {
      list = T;
      mode = "tr";
    } else {
      cur = "welcome";
      idx = 0;
    }
  }

  const m = list[idx] || M[0];
  const CK = m.ck;
  const n = list[idx + 1];
  const certHash = list === T ? "training-certificate" : "certificate";
  const certLabel = list === T ? "Training Certificate" : "Certificate";

  const q = m.quiz
    ? m.quiz.map((x, k) => `<div class="q"><b>${k + 1}. ${x.q}</b>${x.o.map((o, j) => `<label><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join("")}</div>`).join("") +
      `<button id="chk">Check answers</button><div class="msg" id="res"></div>`
    : "";

  const bodyHtml = m.html
    ? `<div class="${m.id === "welcome" ? "" : "card "}prose">${m.html}</div>`
    : (m.pts ? `<div class="card"><ul class="pts">${m.pts.map(p => `<li>${p}</li>`).join("")}</ul></div>` : "");

  el.innerHTML =
    `<p class="eyebrow">${m.g}</p><h1>${m.t}</h1><p class="lead">${m.intro || ""}</p>` +
    bodyHtml +
    renderSlides(m.slides) +
    (m.table ? `<h2>Quick reference</h2><div class="card scroll"><table><tr>${m.table.h.map(h => `<th>${h}</th>`).join("")}</tr>${m.table.r.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>` : "") +
    (q ? `<h2>Quick quiz</h2><div class="card">${q}</div>` : "") +
    `<div class="row"><button class="p" id="mk" ${m.quiz && !D[m.id] ? "disabled" : ""}>${D[m.id] ? "Learned ✓" : "Mark as learned"}</button><a class="btn" href="#${n ? n.id : certHash}">Next: ${n ? n.t : certLabel}</a></div>`;

  bindSlides(m.slides);

  if (CK) {
    const key = "ob-ck-" + m.id + "-" + new Date().toISOString().slice(0, 10);
    let st = {};
    try { st = JSON.parse(localStorage.getItem(key) || "{}"); } catch (e) {}
    const li = [...document.querySelectorAll(".prose li")];
    const tr = [...document.querySelectorAll(".prose tr")].filter(r => r.querySelector("td") && r.textContent.trim());
    (tr.length > li.length ? tr : li).forEach((r, k) => {
      const c = document.createElement("input");
      c.type = "checkbox";
      c.className = "tick";
      c.checked = !!st[k];
      r.classList.toggle("ticked", c.checked);
      c.onchange = () => {
        st[k] = c.checked;
        r.classList.toggle("ticked", c.checked);
        try { localStorage.setItem(key, JSON.stringify(st)); } catch (e) {}
      };
      const cell = r.querySelector("td") || r;
      cell.prepend(c);
    });
  }

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
    nav();
  };
  nav();
}

function cert(el, kind) {
  const isTr = kind === "tr";
  const done = isTr ? cntTr() : cntOb();
  const total = isTr ? T.length : CORE.length;
  const ready = total > 0 && done === total;
  const title = isTr ? "Training & Upskilling" : "Day 1 onboarding";
  nav();

  el.innerHTML = ready
    ? `<div class="noprint"><p class="eyebrow">Finish</p><h1>Your ${isTr ? "training " : ""}certificate</h1><p class="lead">Enter your full name as it should appear.</p><input type="text" id="nm" placeholder="Full name" value="${N.replace(/"/g, "&quot;")}"></div><div class="cert" style="margin-top:24px"><p class="eyebrow">Certificate of completion</p><p>This certifies that</p><h1 id="cn">${N || "Your name"}</h1><p>completed ${title} with Gastronomy at PwC Sydney on ${new Date().toLocaleDateString("en-AU", { day: "numeric", month: "long", year: "numeric" })}</p></div><div class="row"><button class="p" onclick="print()">Print or save as PDF</button></div>`
    : `<p class="eyebrow">Finish</p><h1>${isTr ? "Training Certificate" : "Certificate"}</h1><p class="lead">Finish the ${total} ${isTr ? "training" : "Day 1"} topics to unlock your certificate. You have done ${done}.</p>`;

  const nm = $("#nm");
  if (nm) {
    nm.oninput = () => {
      N = nm.value;
      $("#cn").textContent = N || "Your name";
      save();
    };
  }
}

$("#tab-ob").onclick = () => {
  mode = "ob";
  if (T.some(m => m.id === cur) || cur === "training-certificate") location.hash = "#welcome";
  else nav();
};

$("#tab-tr").onclick = () => {
  mode = "tr";
  if (!T.some(m => m.id === cur) && cur !== "training-certificate") {
    if (T[0]) location.hash = "#" + T[0].id;
    else nav();
  } else {
    nav();
  }
};

document.addEventListener("keydown", e => {
  if (!$("#deck") || e.target.tagName === "INPUT") return;
  if (e.key === "ArrowLeft") $("#s-prev")?.click();
  if (e.key === "ArrowRight") $("#s-next")?.click();
});

function setTheme(t) {
  document.documentElement.dataset.theme = t;
  const icon = t === "dark" ? "☀️" : "🌙";
  const label = t === "dark" ? "Switch to light mode" : "Switch to dark mode";
  [$("#theme-btn"), $("#theme-btn2")].forEach(b => {
    if (!b) return;
    b.textContent = icon;
    b.title = label;
    b.setAttribute("aria-label", label);
  });
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

[$("#theme-btn"), $("#theme-btn2")].forEach(b => {
  if (b) b.onclick = () => setTheme(document.documentElement.dataset.theme === "dark" ? "light" : "dark");
});

$("#s").oninput = nav;
$("#menu").onclick = () => document.body.classList.toggle("open");
$("#scrim").onclick = () => document.body.classList.remove("open");
addEventListener("hashchange", () => {
  document.body.classList.remove("open");
  view();
  scrollTo(0, 0);
});
view();
