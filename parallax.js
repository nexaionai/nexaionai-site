/* NEXAIONai — parallax del hero (estilo Starlink, 25-nov-2026).
   Al hacer scroll: la foto baja más lento que la página y las letras suben un poco más rápido.
   Solo transform, sin otra animación. Se desactiva con «reducir movimiento». */
(function () {
  var hero = document.getElementById("top");
  if (!hero) return;
  var photo = hero.querySelector(".herobg");
  var text = hero.querySelector(":scope > div:last-child");
  if (!photo || !text) return;
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var PHOTO = 0.35;  /* la foto baja al 35 % del scroll: se ve más lenta */
  var TEXT = 0.18;   /* las letras suben un 18 % extra */
  var ticking = false;
  function reset() { photo.style.transform = ""; text.style.transform = ""; }
  function update() {
    ticking = false;
    if (mq.matches) { reset(); return; }
    var h = hero.offsetHeight;
    var y = Math.min(Math.max(window.scrollY || window.pageYOffset || 0, 0), h);
    photo.style.transform = "translate3d(0," + (y * PHOTO).toFixed(2) + "px,0)";
    text.style.transform = "translate3d(0," + (-y * TEXT).toFixed(2) + "px,0)";
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onScroll);
  if (mq.addEventListener) mq.addEventListener("change", update);
  update();
})();
