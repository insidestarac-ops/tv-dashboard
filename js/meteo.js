const lat = 46.134;
const lon = 3.457;

fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`)
  .then(res => res.json())
  .then(data => {
    const temp = data.current_weather.temperature;
    document.getElementById("temp").innerText = temp + "°C";

    const code = data.current_weather.weathercode;
    let desc = "Conditions normales";
    if (code < 3) desc = "Ensoleillé";
    else if (code < 50) desc = "Nuageux";
    else if (code < 70) desc = "Pluie";
    else desc = "Conditions variables";

    document.getElementById("desc").innerText = desc;
  });

// Horloge
function updateClock() {
  document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR");
}
setInterval(updateClock, 1000);
updateClock();
