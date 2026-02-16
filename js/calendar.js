function generateCalendar(){
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay(); // 0=dimanche
  const daysInMonth = new Date(year, month+1, 0).getDate();
  const joursSemaine = ["Lun","Mar","Mer","Jeu","Ven","Sam","Dim"];
  const mois = ["Janvier","Février","Mars","Avril","Mai","Juin","Juillet","Août","Septembre","Octobre","Novembre","Décembre"];

  let html = `<div style="grid-column:span 7; text-align:center; font-size:36px; margin-bottom:20px">${mois[month]} ${year}</div>`;

  // jours de la semaine
  for(let j=0;j<7;j++){
    html += `<div class="day" style="font-weight:bold; background:rgba(255,255,255,.1)">${joursSemaine[j]}</div>`;
  }

  // calcul du décalage (semaine lundi=0)
  let offset = firstDay==0?6:firstDay-1;
  for(let i=0;i<offset;i++){
    html += `<div class="day"></div>`;
  }

  for(let d=1; d<=daysInMonth; d++){
    html += `<div class="day ${d===today?"today":""}">${d}</div>`;
  }

  document.getElementById("calendar").innerHTML = html;
}

// Clock
function updateClock(){
  const now = new Date();
  document.getElementById("clock").innerText = now.toLocaleTimeString("fr-FR");
}

setInterval(updateClock,1000);
updateClock();
generateCalendar();
