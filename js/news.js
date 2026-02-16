const rssUrl = "https://api.rss2json.com/v1/api.json?rss_url=https://www.bfmtv.com/rss/news-24-7/";

let articles = [];
let index = 0;

fetch(rssUrl)
  .then(res => res.json())
  .then(data => {
    articles = data.items;
    updateNews();
    setInterval(updateNews, 8000); // rotation articles toutes les 8s
  })
  .catch(err => {
    console.error("Erreur news:", err);
    document.getElementById("main-article").innerText = "Actualité indisponible";
  });

function updateNews() {
  if (!articles.length) return;

  const article = articles[index];
  document.getElementById("main-article").innerHTML = `
    <div class="overlay">
      <h1>${article.title}</h1>
      <p>${article.description.replace(/<[^>]*>?/gm,'').slice(0,200)}...</p>
    </div>
  `;

  // Ticker
  document.getElementById("ticker-text").innerText =
    articles.map(a => " • " + a.title).join("");

  index = (index + 1) % articles.length;
}

// Horloge lower third
function updateClock() {
  document.getElementById("clock").innerText =
    new Date().toLocaleTimeString("fr-FR");
}
setInterval(updateClock,1000);
updateClock();
