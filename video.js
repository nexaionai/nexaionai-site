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

/* Al hacer scroll, cualquier video que salga de la vista se pausa (orden del fundador, 25-nov-2026).
   Se pausa cuando queda menos de la mitad del video en pantalla; no vuelve a arrancar solo. */
(function () {
  if (!("IntersectionObserver" in window)) return;
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      var v = e.target;
      if (e.intersectionRatio < 0.5 && !v.paused) v.pause();
    });
  }, { threshold: [0, 0.5, 1] });
  function watch(root) {
    (root.tagName === "VIDEO" ? [root] : root.querySelectorAll ? root.querySelectorAll("video") : []).forEach(function (v) {
      if (!v.__nxWatched) { v.__nxWatched = true; io.observe(v); }
    });
  }
  watch(document);
  new MutationObserver(function (ms) {
    ms.forEach(function (m) { m.addedNodes.forEach(function (n) { if (n.nodeType === 1) watch(n); }); });
  }).observe(document.body, { childList: true, subtree: true });
})();
