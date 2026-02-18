// On n'utilise plus "import", la variable SCENES est chargée juste avant par index.html

const iframe = document.getElementById("scene-frame");
const progress = document.getElementById("progress");

let current = 0;
let elapsed = 0;
let timer = null;

function loadScene(index){
  clearInterval(timer);
  elapsed = 0;
  progress.style.width = "0%";
  current = index;

  iframe.style.opacity = 0;
  
  setTimeout(() => {
    iframe.src = SCENES[current].file;
  }, 300);

  iframe.onload = () => {
    iframe.style.opacity = 1;
    startProgress();
  };
}

function startProgress(){
  const duration = SCENES[current].duration;
  timer = setInterval(()=>{
    elapsed += 100;
    progress.style.width = (elapsed / duration) * 100 + "%";
    if(elapsed >= duration){
      loadScene((current + 1) % SCENES.length);
    }
  }, 100);
}

/* CLAVIER + STREAM DECK */
document.addEventListener("keydown", e => {
  if(e.key === "1") loadScene(0);
  if(e.key === "2") loadScene(1);
  if(e.key === "3") loadScene(2);
  if(e.key === "b" || e.key === "B") window.triggerBreaking("ÉDITION SPÉCIALE EN COURS");
});

// Lancement de la première scène au démarrage
loadScene(0);