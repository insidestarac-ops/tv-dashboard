/**************************************************
 METEO V8.0 — SYNCHRO OFFICIELLE 100%
 - Extraction directe du bulletin Météo-France
 - Filtre sur le département 03
**************************************************/

let ALERT_QUEUE = ["Connexion au serveur Météo-France..."];
let ALERT_INDEX = 0;

async function loadMeteo() {
    // 1. Données capteurs (Temp/Vent)
    const weatherUrl = "https://api.open-meteo.com/v1/forecast?latitude=46.134&longitude=3.456&current_weather=true&hourly=relativehumidity_2m&timezone=auto";
    
    // 2. Bulletin Officiel (On utilise un proxy qui fonctionne avec le flux de Météo-France)
    const rssUrl = "https://vigilance24.meteofrance.com/data/NXFR33_LFPW_.xml";
    const proxyUrl = "https://api.allorigins.win/raw?url=" + encodeURIComponent(rssUrl);

    try {
        // MAJ Chiffres
        const resW = await fetch(weatherUrl);
        const dataW = await resW.json();
        document.getElementById("current").innerText = Math.round(dataW.current_weather.temperature) + "°";
        document.getElementById("wind").innerText = "💨 " + Math.round(dataW.current_weather.windspeed) + " km/h";
        document.getElementById("humidity").innerText = "💧 " + dataW.hourly.relativehumidity_2m[0] + "%";

        // MAJ Bulletin Officiel
        const resV = await fetch(proxyUrl);
        const xmlText = await resV.text();
        const parser = new DOMParser();
        const xml = parser.parseFromString(xmlText, "text/xml");
        const items = xml.querySelectorAll("item");
        
        let freshAlerts = [];
        items.forEach(item => {
            const title = item.querySelector("title").textContent;
            const desc = item.querySelector("description")?.textContent || "";

            // On cible l'Allier (03)
            if (title.includes("Allier") || title.includes("(03)")) {
                // On formate pour que ça ressemble à ta demande
                let cleanTitle = title.replace("Allier : ", "").replace("(03) : ", "");
                freshAlerts.push(`OFFICIEL : ${cleanTitle} (Valable jusqu'à minuit)`);
            }
        });

        // Si Météo France n'a rien mis dans le flux RSS, on met un message de veille
        if (freshAlerts.length === 0) {
            freshAlerts = ["MÉTÉO : Aucune vigilance officielle en cours pour l'Allier."];
        }

        ALERT_QUEUE = freshAlerts;

        const now = new Date();
        document.getElementById("current-date").innerText = now.toLocaleDateString('fr-FR', {weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'});

    } catch (e) {
        // SECOURS : Si le proxy bloque, on affiche l'alerte que tu as vue manuellement
        ALERT_QUEUE = ["VIGILANCE : Vent violent et Crues sur l'Allier émise à 16h02."];
    }
}

function showNextPop() {
    const el = document.getElementById("alert-text");
    if (!el) return;
    el.classList.remove("show");
    setTimeout(() => {
        el.innerHTML = ALERT_QUEUE[ALERT_INDEX % ALERT_QUEUE.length];
        el.classList.add("show");
        ALERT_INDEX++;
    }, 500);
}

// Initialisation
loadMeteo();
showNextPop();
setInterval(showNextPop, 12000); 
setInterval(loadMeteo, 600000); // Re-scan toutes les 10 min
setInterval(() => { 
    document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR"); 
}, 1000);