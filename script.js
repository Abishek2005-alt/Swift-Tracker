const T={en:{tag:"Every parcel, every port, one screen.",find:"Track",ph:"Tracking no. e.g. SS3003",eta:"On-time confidence",left:"Stops left",mode:"Mode",next:"Simulate next stop",share:"Copy share link",ot:"On time",dl:"Delayed",dv:"Delivered",sea:"Sea",air:"Air",road:"Road",copied:"Link copied",nf:"Tracking number not found",arr:"Reached",done:"Delivered! Parcel reached its destination."},
ta:{tag:"ஒவ்வொரு பார்சலும், ஒவ்வொரு துறைமுகமும், ஒரே திரையில்.",find:"தேடு",ph:"டிராக்கிங் எண்",eta:"சரியான நேரத்தில் வரும் வாய்ப்பு",left:"மீதமுள்ள நிறுத்தங்கள்",mode:"வழி",next:"அடுத்த நிறுத்தம்",share:"லிங்க் நகலெடு",ot:"சரியான நேரம்",dl:"தாமதம்",dv:"டெலிவரி ஆனது",sea:"கடல்",air:"விமானம்",road:"சாலை",copied:"லிங்க் நகலெடுக்கப்பட்டது",nf:"டிராக்கிங் எண் கிடைக்கவில்லை",arr:"வந்தடைந்தது",done:"டெலிவரி ஆனது! பார்சல் சேர வேண்டிய இடம் வந்தது."}};
// stops: [name, x, y, weatherRisk%]
const S=[
{id:"SS1001",name:"Textile export",mode:"sea",icon:"🚢",stage:1,stops:[["Chennai Port",70,210,0],["Singapore Hub",330,250,6],["Colombo Transit",190,235,4],["Dubai Jebel Ali",330,130,9],["Rotterdam",560,50,7]],t:["12 Sep","19 Sep","—","—","—"]},
{id:"SS2002",name:"Electronics",mode:"air",icon:"✈️",stage:2,stops:[["Chennai Airport",70,210,0],["Dubai Airport",260,130,3],["Frankfurt",430,70,2],["London",560,50,2]],t:["30 Sep","30 Sep","—","—"]},
{id:"SS3003",name:"Books and gifts",mode:"road",icon:"🚚",stage:3,stops:[["Chennai Hub",70,210,0],["Vellore",190,170,1],["Bengaluru",330,130,2],["Hyderabad",560,50,1]],t:["30 Sep","30 Sep","1 Oct","2 Oct"]}];
let L="en",cur=S[0],dark=matchMedia("(prefers-color-scheme:dark)").matches;
const $=id=>document.getElementById(id),t=k=>T[L][k];
const conf=s=>Math.max(40,100-s.stops.slice(s.stage+1).reduce((a,x)=>a+x[3],0)-(s.id==="SS1001"?18:0));
const status=s=>s.stage===s.stops.length-1?"dv":conf(s)<80?"dl":"ot";
const col=s=>({dv:"var(--green)",dl:"var(--red)",ot:"var(--yellow)"})[status(s)];
function toast(m){const e=$("toast");e.textContent=m;e.classList.add("show");clearTimeout(toast.h);toast.h=setTimeout(()=>e.classList.remove("show"),2600)}
function list(){$("list").innerHTML=S.map(s=>`<button class="item ${s===cur?"on":""}" style="--c:${col(s)}" data-id="${s.id}"><b>${s.icon} ${s.id}</b><span>${s.stops[0][0]} → ${s.stops.at(-1)[0]} · ${t(status(s))}</span></button>`).join("")}
function qr(id){let h=0;for(const c of id)h=(h*31+c.charCodeAt(0))>>>0;let o="";for(let i=0;i<81;i++){const r=Math.floor(i/9),c=i%9,f=(r<3&&c<3)||(r<3&&c>5)||(r>5&&c<3);h=(h*1103515245+12345)>>>0;o+=`<i class="${f||h%5<2?"":"o"}"></i>`}return o}
function detail(){
 const s=cur,n=s.stops.length,pts=s.stops.map(p=>`${p[1]},${p[2]}`).join(" ");
 $("detail").innerHTML=`<div class="top"><div><h2>${s.id} · ${s.name}</h2><span>${s.stops[0][0]} → ${s.stops[n-1][0]}</span></div><span class="badge" style="--c:${col(s)}">${t(status(s))}</span></div>
 <svg class="map" viewBox="0 0 640 300" role="img" aria-label="Route map"><path d="M0 270 Q160 240 320 275 T640 260 V300 H0Z" fill="var(--line)" opacity=".5"/>
 <polyline id="route" points="${pts}" fill="none" stroke="var(--mute)" stroke-width="3" stroke-dasharray="8 7"/>
 <polyline id="done" fill="none" stroke="var(--red)" stroke-width="4"/>
 ${s.stops.map((p,i)=>`<circle cx="${p[1]}" cy="${p[2]}" r="6" fill="${i<=s.stage?"var(--green)":"var(--panel)"}" stroke="var(--ink)" stroke-width="2"/><text x="${p[1]}" y="${p[2]+20}" font-size="12" text-anchor="middle" fill="var(--ink)">${p[0]}</text>`).join("")}
 <text id="ic" font-size="26" text-anchor="middle">${s.icon}</text></svg>
 <div class="stats"><div><strong>${conf(s)}%</strong><span>${t("eta")}</span></div><div><strong>${n-1-s.stage}</strong><span>${t("left")}</span></div><div><strong>${t(s.mode)}</strong><span>${t("mode")}</span></div></div>
 <ol>${s.stops.map((p,i)=>`<li class="${i<s.stage?"done":i===s.stage?"now":""}"><b>${p[0]}</b><small>${i<=s.stage?t("arr")+" · "+s.t[i]:"ETA pending"}${p[3]?" · weather risk "+p[3]+"%":""}</small></li>`).join("")}</ol>
 <div class="actions"><button id="adv" ${s.stage>=n-1?"disabled":""}>${t("next")}</button><button id="shr">${t("share")}</button></div><div class="qr" aria-label="QR code">${qr(s.id)}</div>`;
 const pr=$("route"),d=$("done"),ic=$("ic");
 d.setAttribute("points",s.stops.slice(0,s.stage+1).map(p=>`${p[1]},${p[2]}`).join(" "));
 const a=s.stops[s.stage];ic.setAttribute("x",a[1]);ic.setAttribute("y",a[2]-12);
 $("adv").onclick=()=>{if(s.stage<n-1){const from=s.stops[s.stage],to=s.stops[++s.stage];s.t[s.stage]="Now";
  const st=performance.now();(function f(now){const k=Math.min(1,(now-st)/900);const x=from[1]+(to[1]-from[1])*k,y=from[2]+(to[2]-from[2])*k;const e=document.getElementById("ic");if(!e||cur!==s)return;e.setAttribute("x",x);e.setAttribute("y",y-12);if(k<1)requestAnimationFrame(f);else{list();detail();toast(`${s.icon} ${t("arr")}: ${to[0]}`);if(s.stage===n-1)setTimeout(()=>toast(t("done")),2700)}})(st)}};
 $("shr").onclick=()=>{const u=location.href.split("#")[0]+"#"+s.id;try{navigator.clipboard.writeText(u)}catch(e){}toast(t("copied")+": #"+s.id)};
}
function ui(){$("tag").textContent=t("tag");$("go").textContent=t("find");$("q").placeholder=t("ph");$("lang").textContent=L==="en"?"தமிழ்":"English";$("theme").textContent=dark?"Light":"Dark";list();detail()}
$("list").onclick=e=>{const b=e.target.closest(".item");if(b){cur=S.find(s=>s.id===b.dataset.id);list();detail()}};
$("go").onclick=()=>{const v=$("q").value.trim().toUpperCase(),s=S.find(x=>x.id===v);s?(cur=s,list(),detail()):toast(t("nf"))};
$("q").onkeydown=e=>{if(e.key==="Enter")$("go").click()};
$("lang").onclick=()=>{L=L==="en"?"ta":"en";ui()};
$("theme").onclick=()=>{dark=!dark;document.documentElement.dataset.theme=dark?"dark":"light";ui()};
if(dark)document.documentElement.dataset.theme="dark";
const h=location.hash.slice(1);if(S.find(s=>s.id===h))cur=S.find(s=>s.id===h);
ui();
