/**************************************************
 NEWS V7.0 — CHAÎNE INFO PRO 4K
 - Filtrage anti-questions (?) intégré
 - Mise à jour AUTO sans F5 (2 min)
 - Heure style Météo (Jaune Or 900)
**************************************************/

const HERO_DURATION = 12000;
const HERO_COUNT = 6;

let NEWS = [];
let CURRENT = 0;
let HERO_TIMER = null;

const FEEDS = [
  { name:"TF1 Info", url:"https://www.tf1info.fr/feeds/rss-une.xml", logo:"../assets/tf1.png" },
  { name:"BFMTV", url:"https://www.bfmtv.com/rss/news-24-7/", logo:"../assets/bfmtv.png" },
  { name:"Franceinfo", url:"https://www.francetvinfo.fr/titres.rss", logo:"../assets/franceinfo.png" },
];

const ALERT_SOURCES = [
  { name: "A-INFO", url: "https://t.me/s/AlertesInfos", type: "telegram" },
  { name: "FR-INFO", url: "https://www.francetvinfo.fr/titres.rss", type: "rss" }
];

const PROXIES = [
  { url: "https://corsproxy.io/?", encode: false },
  { url: "https://api.allorigins.win/raw?url=", encode: true }
];

let ALERT_QUEUE = [];
let ALERT_INDEX = 0;
let ALERT_POP_TIMER = null;

/* === UTILITAIRES === */
function isToday(date) {
  const today = new Date();
  return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
}

async function fetchViaProxy(targetUrl, isHTML = false) {
  const freshUrl = targetUrl + (targetUrl.includes('?') ? '&' : '?') + 'v=' + Date.now();
  for (const p of PROXIES) {
    try {
      const finalUrl = p.encode ? p.url + encodeURIComponent(freshUrl) : p.url + freshUrl;
      const r = await fetch(finalUrl, { cache: "no-store" });
      if (!r.ok) continue;
      const text = await r.text();
      if (isHTML) { 
          if (text.includes("tgme_widget")) return text; 
      } else {
        const xml = new DOMParser().parseFromString(text, "text/xml");
        if (xml && !xml.querySelector("parsererror")) return xml;
      }
    } catch(e) {}
  }
  return null;
}

/* === LOGIQUE ACTUS PRINCIPALES (HERO + SIDEBAR) === */
async function loadNews() {
  let all = [];
  for (const f of FEEDS) {
    const xml = await fetchViaProxy(f.url, false);
    if (!xml) continue;
    
    const items = [...xml.querySelectorAll("item, entry")].map(i => {
      const title = i.querySelector("title")?.textContent.trim() || "";
      const d = new Date(i.querySelector("pubDate, published, updated")?.textContent || Date.now());
      let desc = i.querySelector("description")?.textContent || "";

      // === FILTRE ANTI-QUESTION (?) ===
      if (title.endsWith("?") || title.includes(" ?")) return null;

      return {
        title: title,
        description: desc.replace(/<[^>]+>/g, "").trim(),
        pubDate: d,
        timeStr: d.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"}),
        image: i.querySelector("enclosure")?.getAttribute("url") || "https://picsum.photos/1920/1080",
        logo: f.logo
      };
    }).filter(item => item !== null); // Supprime les articles filtrés
    
    all = all.concat(items);
  }

  let filtered = all.filter(n => isToday(n.pubDate));
  if (filtered.length === 0) filtered = all;

  let sorted = filtered.sort((a,b) => b.pubDate - a.pubDate);
  let uniqueNews = [];
  let seenTitles = [];

  for (let item of sorted) {
    let clean = item.title.toLowerCase().replace(/[^\w\s]/gi, '');
    let words = clean.split(" ").filter(w => w.length > 3);
    let isDuplicate = seenTitles.some(prev => words.filter(word => prev.includes(word)).length >= 3);
    if (!isDuplicate && uniqueNews.length < HERO_COUNT) {
      uniqueNews.push(item);
      seenTitles.push(clean);
    }
  }
  NEWS = uniqueNews;
  renderNews();
  if (!HERO_TIMER) HERO_TIMER = setInterval(nextHero, HERO_DURATION);
}

function renderNews() {
  if (!NEWS.length) return;
  const hero = document.getElementById("hero");
  const side = document.getElementById("side");
  const item = NEWS[CURRENT];
  
  const badgeText = CURRENT === 0 ? "DERNIÈRE ACTU" : "ACTUALITÉ";
  const badgeColor = CURRENT === 0 ? "#E10600" : "#007BFF";

  hero.innerHTML = `
    <img src="${item.image}" class="active">
    <div class="overlay">
      <span class="badge" style="background:${badgeColor}">${badgeText}</span>
      <span style="margin-left:15px; font-size:1.4vw; font-weight:bold; color:#ccc;">${item.timeStr}</span>
      <h1>${item.title}</h1>
      <p>${item.description.slice(0,250)}...</p>
    </div>
  `;

  let sideHTML = "";
  NEWS.forEach((n, i) => {
    sideHTML += `
      <div class="side-item ${i === CURRENT ? "active" : ""}">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:.6vh;">
            <img src="${n.logo}" style="margin:0; height: 1.2vw; width: auto;">
            <span style="font-size:1vw; color:#888;">${n.timeStr}</span>
        </div>
        <span style="font-size:1.25vw; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">${n.title}</span>
      </div>
    `;
  });
  side.innerHTML = sideHTML;
}

function nextHero() { CURRENT = (CURRENT + 1) % NEWS.length; renderNews(); }

/* === LOGIQUE ALERTES (BANDEAU POP) === */
async function loadAlerts() {
  let combinedAlerts = [];
  const seen = new Set();
  const BLACKLIST = ["souhaite", "bon carême", "bon ramadan", "fête", "abonnez-vous", "joyeuses", "vœux"];

  for (const src of ALERT_SOURCES) {
    if (src.type === "telegram") {
      const html = await fetchViaProxy(src.url, true);
      if (!html) continue;
      const doc = new DOMParser().parseFromString(html, "text/html");
      doc.querySelectorAll(".tgme_widget_message").forEach(msg => {
        const textEl = msg.querySelector(".tgme_widget_message_text");
        const timeEl = msg.querySelector(".tgme_widget_message_date time");
        if (!textEl || !timeEl) return;
        const date = new Date(timeEl.getAttribute("datetime"));
        if (!isToday(date)) return;
        
        let text = textEl.textContent.trim();
        // Filtre anti-question et blacklist
        if (text.includes("?") || BLACKLIST.some(word => text.toLowerCase().includes(word))) return;

        const key = text.substring(0, 40);
        if (seen.has(key)) return;
        seen.add(key);
        combinedAlerts.push({ title: text, date: date });
      });
    } else {
      const xml = await fetchViaProxy(src.url, false);
      if (!xml) continue;
      [...xml.querySelectorAll("item")].forEach(i => {
        const title = i.querySelector("title")?.textContent || "";
        const date = new Date(i.querySelector("pubDate")?.textContent || Date.now());
        if (!isToday(date) || title.includes("?") || BLACKLIST.some(word => title.toLowerCase().includes(word))) return;

        const key = title.substring(0, 40);
        if (seen.has(key)) return;
        seen.add(key);
        combinedAlerts.push({ title: title, date: date });
      });
    }
  }
  ALERT_QUEUE = combinedAlerts.sort((a,b) => b.date - a.date).slice(0, 15);
  if (ALERT_QUEUE.length > 0 && !ALERT_POP_TIMER) startAlertsPop();
}

function startAlertsPop() {
  showNextPop();
  ALERT_POP_TIMER = setInterval(showNextPop, 12000);
}

function showNextPop() {
  const el = document.getElementById("alert-text");
  if (!ALERT_QUEUE.length) return;
  el.classList.remove("show");
  
  setTimeout(() => {
    const a = ALERT_QUEUE[ALERT_INDEX % ALERT_QUEUE.length];
    const time = a.date.toLocaleTimeString("fr-FR", {hour:"2-digit", minute:"2-digit"});
    el.innerHTML = `<span class="alert-time">${time}</span> ${a.title}`;
    el.classList.add("show");
    ALERT_INDEX++;
  }, 500);
}

setInterval(() => { 
    const c = document.getElementById("clock"); 
    if(c) c.innerText = new Date().toLocaleTimeString("fr-FR"); 
}, 1000);

loadNews();
setInterval(loadNews, 120000);
loadAlerts();
setInterval(loadAlerts, 120000);