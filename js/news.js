const regionRSS = "https://atlasflux.suptribune.org/Outil_RSS_lecture.php?code_id=14621";
const nationalRSS = "https://www.bfmtv.com/rss/news-24-7/";

let articles = [];
let index = 0;

// Charge RSS
async function fetchRSS(url) {
  try {
    const res = await fetch(url);
    const text = await res.text();
    const parser = new DOMParser();
    const xml = parser.parseFromString(text, "text/xml");
    const items = Array.from(xml.querySelectorAll("item"));
    if (!items.length) throw new Error("RSS vide");
    return items.map(i => ({
      title: i.querySelector("title")?.textContent || "",
      description: i.querySelector("description")?.textContent || ""
    }));
  } catch {
    return [];
  }
}

async function loadNews() {
  articles = await fetchRSS(regionRSS);
  if (!articles.length) {
    articles = await fetchRSS(nationalRSS);
  }

  if (!articles.length) {
    articles = [{title: "Actualité indisponible", description: ""}];
  }

  updateNews();
  setInterval(updateNews, 8000);
}

function updateNews() {
  if (!articles.length) return;

  const main = articles[index];
  document.getElementById("main-article").innerHTML = `
    <img src="https://via.placeholder.com/1920x1080">
    <div class="overlay">
      <h1>${main.title}</h1>
      <p>${main.description.replace(/<[^>]*>?/gm, '').slice(0,200)}...</p>
    </div>
  `;

  // Side articles
  let sideHTML = "";
  for (let i = 1; i <= 6; i++) {
    const item = articles[(index + i) % articles.length];
    sideHTML += `<div class="side-item">${item.title}</div>`;
  }
  document.getElementById("side-articles").innerHTML = sideHTML;

  // Ticker
  document.getElementById("ticker-text").innerText =
    articles.map(a => " • " + a.title).join("");

  index = (index + 1) % articles.length;
}

// Horloge
function updateClock() {
  document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR");
}
setInterval(updateClock, 1000);
updateClock();
loadNews();
