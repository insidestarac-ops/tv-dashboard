const rssUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://www.tf1info.fr/feeds/rss-une.xml";

let articles = [];
let index = 0;

fetch(rssUrl)
  .then(res => res.json())
  .then(data => {
    articles = data.items;
    updateNews();
    setInterval(updateNews, 8000); // toutes les 8 sec
  })
  .catch(e => {
    console.error("Impossible de charger TF1 RSS :", e);
    articles = [
      { title: "Actualité indisponible", description: "" },
      { title: "Réessayez ultérieurement" }
    ];
    updateNews();
  });

function updateNews() {
  if (!articles.length) return;

  const main = articles[index];
  const title = main.title;
  const desc = (main.description || "").replace(/<[^>]*>?/gm, '').slice(0, 200) + "...";

  document.getElementById("news-title").innerText = title;
  document.getElementById("news-desc").innerText = desc;

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
