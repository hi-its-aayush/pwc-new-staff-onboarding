const $=s=>document.querySelector(s);let D={},N="";
try{D=JSON.parse(localStorage.getItem("ob-done")||"{}");N=localStorage.getItem("ob-name")||""}catch(e){}
const save=()=>{try{localStorage.setItem("ob-done",JSON.stringify(D));localStorage.setItem("ob-name",N)}catch(e){}};
const cnt=()=>M.filter(m=>D[m.id]).length;
function nav(){const f=$("#s").value.toLowerCase();let h="",g="";
M.filter(m=>!f||m.x.includes(f)).forEach(m=>{if(m.g!=g){g=m.g;h+=`<div class="grp">${g}</div>`}h+=`<a href="#${m.id}" class="${D[m.id]?"done":""} ${cur==m.id?"on":""}"><b></b>${m.t}</a>`});
h+=`<div class="grp">Finish</div><a href="#certificate" class="${cur=="certificate"?"on":""}"><b></b>Certificate</a>`;$("#nav").innerHTML=h;
const p=Math.round(cnt()/M.length*100);$("#fill").style.width=p+"%";$("#pct").textContent=p+"%"}
let cur="welcome";
function view(){cur=location.hash.slice(1)||"welcome";const i=M.findIndex(m=>m.id==cur);const el=$("#main");
if(cur=="certificate")return cert(el);
const m=M[i]||M[0],n=M[i+1];if(!M[i])cur="welcome";
const q=m.quiz?m.quiz.map((x,k)=>`<div class="q"><b>${k+1}. ${x.q}</b>${x.o.map((o,j)=>`<label><input type="radio" name="q${k}" value="${j}"> ${o}</label>`).join("")}</div>`).join("")+`<button id="chk">Check answers</button><div class="msg" id="res"></div>`:"";
el.innerHTML=`<p class="eyebrow">${m.g}</p><h1>${m.t}</h1><p class="lead">${m.intro||""}</p>${m.html?`<div class="card prose">${m.html}</div>`:`<div class="card"><ul class="pts">${m.pts.map(p=>`<li>${p}</li>`).join("")}</ul></div>`}`+
(m.table?`<h2>Quick reference</h2><div class="card scroll"><table><tr>${m.table.h.map(h=>`<th>${h}</th>`).join("")}</tr>${m.table.r.map(r=>`<tr>${r.map(c=>`<td>${c}</td>`).join("")}</tr>`).join("")}</table></div>`:"")+
(q?`<h2>Quick quiz</h2><div class="card">${q}</div>`:"")+
`<div class="row"><button class="p" id="mk" ${m.quiz&&!D[m.id]?"disabled":""}>${D[m.id]?"Learned ✓":"Mark as learned"}</button><a class="btn" href="#${n?n.id:"certificate"}">Next: ${n?n.t:"Certificate"}</a></div>`;
const c=$("#chk");if(c)c.onclick=()=>{let ok=0;m.quiz.forEach((x,k)=>{const r=document.querySelector(`input[name=q${k}]:checked`);document.querySelectorAll(`input[name=q${k}]`).forEach(e=>e.parentElement.className="");if(r){const good=+r.value==x.a;r.parentElement.className=good?"ok":"bad";if(good)ok++}});
const all=ok==m.quiz.length;$("#res").className="msg "+(all?"ok":"bad");$("#res").textContent=all?"All correct. You can mark this topic as learned.":`${ok}/${m.quiz.length} correct. Fix the red answers and check again.`;$("#mk").disabled=!all};
$("#mk").onclick=()=>{D[m.id]=1;save();view();nav()};nav()}
function cert(el){const ready=cnt()==M.length;nav();
el.innerHTML=ready?`<div class="noprint"><p class="eyebrow">Finish</p><h1>Your certificate</h1><p class="lead">Enter your full name as it should appear.</p><input type="text" id="nm" placeholder="Full name" value="${N.replace(/"/g,"&quot;")}"></div><div class="cert" style="margin-top:24px"><p class="eyebrow">Certificate of completion</p><p>This certifies that</p><h1 id="cn">${N||"Your name"}</h1><p>completed casual team onboarding at PwC Sydney on ${new Date().toLocaleDateString("en-AU",{day:"numeric",month:"long",year:"numeric"})}</p></div><div class="row"><button class="p" onclick="print()">Print or save as PDF</button></div>`:
`<p class="eyebrow">Finish</p><h1>Certificate</h1><p class="lead">Complete all ${M.length} topics to unlock your certificate. You have done ${cnt()}.</p>`;
const nm=$("#nm");if(nm)nm.oninput=()=>{N=nm.value;$("#cn").textContent=N||"Your name";save()}}
$("#s").oninput=nav;addEventListener("hashchange",()=>{view();scrollTo(0,0)});view();
