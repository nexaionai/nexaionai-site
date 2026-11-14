/* NEXAIONai — video solo al clic (sin autoplay). El video se descarga únicamente cuando la persona toca «Watch video».
   GrossKeep usa el video del idioma activo (EN/ES); i18n.js lo cambia si la persona cambia de idioma después. */
(function () {
  document.querySelectorAll(".vplay").forEach(function (box) {
    var btn = box.querySelector(".playbtn");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var es = document.documentElement.lang === "es";
      var src = (es && box.getAttribute("data-es")) || box.getAttribute("data-src");
      var v = document.createElement("video");
      if (box.getAttribute("data-id")) v.id = box.getAttribute("data-id");
      v.src = src; v.controls = true; v.playsInline = true; v.setAttribute("playsinline", "");
      v.setAttribute("aria-label", box.getAttribute("data-label") || "");
      box.innerHTML = ""; box.appendChild(v);
      var p = v.play(); if (p && p.catch) p.catch(function () {});
    });
  });
})();
