let currentScene = 0;
const frame = document.getElementById("scene-frame");

function loadScene(index) {
  frame.src = SCENES[index].url;
  setTimeout(() => {
    currentScene = (currentScene + 1) % SCENES.length;
    loadScene(currentScene);
  }, SCENES[index].duration);
}

loadScene(currentScene);
