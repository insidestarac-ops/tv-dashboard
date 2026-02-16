const lat = 45.75; // exemple Lyon
const lon = 4.85;

// Icônes météo simplifiées (peut être remplacées par images réelles)
const weatherIcons = {
  0: "☀️",   // Clair
  1: "🌤️",  // Peu nuageux
  2: "⛅",   // Nuageux
  3: "☁️",   // Couvert
  61: "🌧️",  // Pluie
  63: "🌧️",
  65: "🌧️",
  71: "❄️",  // Neige
  73: "❄️",
  75: "❄️",
  95: "⛈️",  // Orage
};

async function loadWeather() {
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max,temperature_2m_min,precipitation_sum,windspeed_10m_max&timezone=Europe/Paris`;
  
  const res = await fetch(url);
  const data = await res.json();

  const jours = ["Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi","Dimanche"];
  const today = new Date();

  let html = "";

  for (let i=0; i<5; i++){
    const d = new Date(today);
    d.setDate(today.getDate()+i);
    const weekday = jours[d.getDay()==0?6:d.getDay()-1]; // lundi=0, dimanche=6

    const code = data.daily.weathercode[i];
    const icon = weatherIcons[code] || "❓";
    const tmax = Math.round(data.daily.temperature_2m_max[i]);
    const tmin = Math.round(data.daily.temperature_2m_min[i]);
    const pluie = data.daily.precipitation_sum[i];
    const vent = data.daily.windspeed_10m_max[i];

    html += `
      <div class="weather-card">
        <h2>${weekday}</h2>
        <div style="font-size:50px">${icon}</div>
        <p>${tmax}° / ${tmin}°</p>
        <p>Pluie: ${pluie} mm | Vent: ${vent} km/h</p>
      </div>
    `;
  }

  document.getElementById("meteo")
