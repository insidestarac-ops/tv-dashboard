const iframe = document.getElementById("scene-frame");
const progressBar = document.getElementById("progress");

let current = 0;
let elapsed = 0;
let interval;

function loadScene(index) {
  clearInterval(interval);
  elapsed = 0;
  current = index;

  iframe.classList.add("fade");

  setTimeout(() => {
    iframe.src = SCENES[current].file;
    iframe.classList.remove("fade");
    startProgress();
  }, 400);
}

function startProgress() {
  const duration = SCENES[current].duration;

  interval = setInterval(() => {
    elapsed += 100;
    progressBar.style.width = (elapsed / duration) * 100 + "%";

    if (elapsed >= duration) {
      loadScene((current + 1) % SCENES.length);
    }
  }, 100);
}

document.addEventListener("keydown", (e) => {
  if (e.key === "1") loadScene(0);
  if (e.key === "2") loadScene(1);
  if (e.key === "3") loadScene(2);
});

loadScene(0);
