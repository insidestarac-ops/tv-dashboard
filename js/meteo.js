const lat = 45.75, lon = 4.85;

async function loadWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;
  const res = await fetch(url);
  const data = await res.json();

  const weekdays = ["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"];
  let html = "";

  for (let i=0; i<5; i++){
    const day = new Date(data.daily.time[i]);
    const dayName = weekdays[day.getDay()];
    const max = Math.round(data.daily.temperature_2m_max[i]);
    const min = Math.round(data.daily.temperature_2m_min[i]);
    const code = data.daily.weathercode[i];

    let icon = "☀️";
    if (code >= 3 && code < 50) icon = "☁️";
    if (code >= 50 && code < 70) icon = "🌧️";
    if (code >= 70) icon = "⛈️";

    html += `
      <div class="weather-card">
        <h2>${dayName}</h2>
        <p>${max}° / ${min}° ${icon}</p>
      </div>
    `;
  }

  document.getElementById("meteo").innerHTML = html;
}

function updateClock() {
  document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR");
}

setInterval(updateClock, 1000);
updateClock();
loadWeather();
