/* NEXAIONai — parallax estilo Starlink en todo el sitio (25-nov-2026).
   Al hacer scroll, las fotos y videos bajan más lento y las letras suben, suave.
   Solo movimiento vertical (propiedad CSS «translate»), sin otra animación.
   Se desactiva con «reducir movimiento». */
(function () {
  var mq = window.matchMedia("(prefers-reduced-motion: reduce)");
  var MEDIA_SEL = ".vplay, .poster";
  
  /* ---------- 1. Hero de la principal (foto a sangre): ajuste original ---------- */
  var hero = document.querySelector("#top.hasphoto");
  var hPhoto = hero && hero.querySelector(".herobg");
  var hText = hero && hero.querySelector(":scope > div:last-child");
  var HERO_PHOTO = 0.35, HERO_TEXT = 0.18;
  var clipTop = 0; /* visor que hace el scroll por fuera (iframe) */

  /* ---------- 2. Todas las demás secciones con letras y explicaciones ---------- */
  var TEXT_K = 0.05;   /* letras: suben un poco más rápido que la página */
  var MEDIA_K = 0.06;  /* fotos y videos: bajan un poco más lento */
  var groups = [];
  var blocks = document.querySelectorAll("section, main");
  for (var b = 0; b < blocks.length; b++) {
    var S = blocks[b];
    if (S === hero) continue;
    if (S.tagName === "MAIN" && S.querySelector("section")) continue;
    var media = [], text = [], seen = new Set();
    S.querySelectorAll(MEDIA_SEL).forEach(function (m) {
      if (!m.parentElement.closest(MEDIA_SEL)) media.push(m);
    });
    /* Letras: todo bloque con texto propio (títulos, párrafos, cifras, botones), fuera de los videos */
    var cand = S.querySelectorAll("*");
    for (var q = 0; q < cand.length; q++) {
      var e = cand[q];
      if (e.closest(MEDIA_SEL + ", nav, header, footer, [aria-hidden='true']")) continue;
      var own = false;
      for (var n = 0; n < e.childNodes.length; n++) { var nd = e.childNodes[n]; if (nd.nodeType === 3 && nd.textContent.trim()) { own = true; break; } }
      if (!own && !e.matches("a.btn, img.nxinline")) continue;
      /* subir hasta un elemento que acepte «translate» (no un texto en línea suelto) */
      var x = e;
      while (x !== S && x.parentElement && getComputedStyle(x).display === "inline" && !/flex|grid/.test(getComputedStyle(x.parentElement).display)) x = x.parentElement;
      if (x === S || x.matches(MEDIA_SEL) || x.querySelector(MEDIA_SEL)) continue;
      if (!seen.has(x)) { seen.add(x); text.push(x); }
    }
    /* quedarse solo con los bloques de más afuera (un párrafo y su <strong> se mueven juntos) */
    text = text.filter(function (t) { for (var y = t.parentElement; y && y !== S; y = y.parentElement) if (seen.has(y)) return false; return true; });
    if (media.length || text.length) groups.push({ s: S, media: media, text: text });
  }

  var ticking = false;
  function reset() {
    if (hPhoto) { hPhoto.style.transform = ""; hText.style.transform = ""; }
    groups.forEach(function (g) { g.media.concat(g.text).forEach(function (e) { e.style.translate = ""; }); });
  }
  function update() {
    ticking = false;
    if (mq.matches) { reset(); return; }
    var vh = window.innerHeight;
    if (hPhoto && hText) {
      var h = hero.offsetHeight;
      var y = Math.min(Math.max(-hero.getBoundingClientRect().top, clipTop, 0), h);
      hPhoto.style.transform = "translate3d(0," + (y * HERO_PHOTO).toFixed(2) + "px,0)";
      hText.style.transform = "translate3d(0," + (-y * HERO_TEXT).toFixed(2) + "px,0)";
    }
    var lim = vh * 0.45;
    for (var i = 0; i < groups.length; i++) {
      var g = groups[i], r = g.s.getBoundingClientRect();
      if (r.bottom < -vh || r.top > 2 * vh) continue;                 /* fuera de pantalla */
      /* d = distancia del centro de la sección al centro de la pantalla (0 = en su sitio) */
      var d = Math.max(-lim, Math.min(lim, (r.top + r.height / 2) - vh / 2));
      var tt = (d * TEXT_K).toFixed(2) + "px", mt = (-d * MEDIA_K).toFixed(2) + "px";
      for (var j = 0; j < g.text.length; j++) g.text[j].style.translate = "0 " + tt;
      for (var k = 0; k < g.media.length; k++) g.media[k].style.translate = "0 " + mt;
    }
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(update); } }
  document.addEventListener("scroll", onScroll, { passive: true, capture: true });
  window.addEventListener("resize", onScroll);
  if (mq.addEventListener) mq.addEventListener("change", update);
  if (hero && "IntersectionObserver" in window && window.top !== window) {
    var th = []; for (var i = 0; i <= 400; i++) th.push(i / 400);
    new IntersectionObserver(function (es) {
      var e = es[es.length - 1];
      clipTop = e.isIntersecting ? Math.max(e.intersectionRect.top - e.boundingClientRect.top, 0) : 0;
      onScroll();
    }, { threshold: th }).observe(hero);
  }
  update();
})();
