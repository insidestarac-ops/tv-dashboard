const overlay = document.getElementById("global-breaking");

window.triggerBreaking = function(text){
  overlay.innerHTML = `
    <div>
      <div style="font-size:1.4vw;letter-spacing:4px;margin-bottom:20px">
        ALERTE INFO
      </div>
      <div>${text}</div>
    </div>
  `;
  overlay.classList.add("show");

  new Audio("assets/breaking.mp3").play().catch(()=>{});

  setTimeout(()=>overlay.classList.remove("show"),6000);
};