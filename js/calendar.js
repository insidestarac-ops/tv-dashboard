function generateCalendar() {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const today = now.getDate();

  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  let html = "";
  const weekdays = ["Dim","Lun","Mar","Mer","Jeu","Ven","Sam"];

  html += weekdays.map(d => `<div class="day">${d}</div>`).join("");

  for (let i = 0; i < firstDay; i++) html += `<div class="day"></div>`;

  for (let d = 1; d <= daysInMonth; d++) {
    html += `<div class="day ${d===today ? "today" : ""}">${d}</div>`;
  }

  document.getElementById("calendar").innerHTML = html;
}

function updateClock() {
  document.getElementById("clock").innerText = new Date().toLocaleTimeString("fr-FR");
}

setInterval(updateClock, 1000);
updateClock();
generateCalendar();
