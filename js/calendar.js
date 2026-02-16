function updateClock() {
  const now = new Date();
  document.getElementById("date").innerText =
    now.toLocaleDateString("fr-FR", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  document.getElementById("time").innerText =
    now.toLocaleTimeString("fr-FR");
}
updateClock();
setInterval(updateClock, 1000);
