const rssUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://www.tf1info.fr/rss/flux.xml";

let articles = [];
let index = 0;

async function loadNews() {
  try {
    const res = await fetch(rssUrl);
    const data = await res.json();
    articles = data.items;
    updateNews();
    setInterval(updateNews, 8000);
  } catch(e) {
    console.error("Erreur chargement news:", e);
    document.getElementById("main-article").innerHTML = "<h1>Actualités indisponibles</h1>";
  }
}

function updateNews() {
  if (!articles.length) return;

  const article = articles[index];
  document.getElementById("main-article").innerHTML = `
    <img src="https://via.placeholder.com/1920x1080">
    <div class="overlay">
      <h1>${article.title}</h1>
      <p>${article.description.replace(/<[^>]*>?/gm, '').slice(0,200)}...</p>
    </div>
  `;

  let sideHTML = "";
  for(let i=1; i<6; i++){
    const t = articles[i]?.title || "";
    sideHTML += `<div class="side-item">${t}</div>`;
  }
  document.getElementById("side-articles").innerHTML = sideHTML;

  const ticker = articles.map(a => " • " + a.title).join("");
  document.getElementById("ticker-text").innerText = ticker;

  index = (index + 1) % articles.length;
}

// Clock
function updateClock(){
  document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR");
}

setInterval(updateClock, 1000);
updateClock();
loadNews();
