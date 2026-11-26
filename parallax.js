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
  var clipTop = 0;   /* parte del hero tapada arriba cuando el scroll lo hace la página contenedora (visor) */
  var ticking = false;
  function reset() { photo.style.transform = ""; text.style.transform = ""; }
  function update() {
    ticking = false;
    if (mq.matches) { reset(); return; }
    var h = hero.offsetHeight;
    /* Distancia que el hero ya subió: vale igual si hace scroll la ventana o el <body> (p. ej. dentro de un visor) */
    var y = Math.min(Math.max(-hero.getBoundingClientRect().top, clipTop, 0), h);
    photo.style.transform = "translate3d(0," + (y * PHOTO).toFixed(2) + "px,0)";
    text.style.transform = "translate3d(0," + (-y * TEXT).toFixed(2) + "px,0)";
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", onScroll);
  if (mq.addEventListener) mq.addEventListener("change", update);
  /* Dentro de un visor (iframe de otro sitio que hace el scroll por fuera), el IntersectionObserver
     ve cuánto del hero quedó tapado arriba en la pantalla real. */
  if ("IntersectionObserver" in window && window.top !== window) {
    var th = []; for (var i = 0; i <= 400; i++) th.push(i / 400);
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      clipTop = e.isIntersecting ? Math.max(e.intersectionRect.top - e.boundingClientRect.top, 0) : (e.boundingClientRect.top < 0 ? hero.offsetHeight : 0);
      onScroll();
    }, { threshold: th }).observe(hero);
  }
  update();
})();
