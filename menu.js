/* NEXAIONai — menú móvil minimalista: copia los enlaces del header (≤760 px). */
(function () {
  var nav = document.querySelector(".nxnav");
  if (!nav) return;
  var links = nav.querySelectorAll(".nxhide a, a.nxhide");
  if (!links.length) return;
  var menu = document.createElement("div");
  menu.className = "nxmenu"; menu.id = "nxmenu";
  links.forEach(function (a) {
    var c = document.createElement("a");
    c.href = a.getAttribute("href"); c.textContent = a.textContent;
    menu.appendChild(c);
  });
  var btn = document.createElement("button");
  btn.type = "button"; btn.className = "nxmenubtn";
  btn.setAttribute("aria-label", "Menu"); btn.setAttribute("aria-expanded", "false"); btn.setAttribute("aria-controls", "nxmenu");
  btn.innerHTML = "<span></span>";
  var right = nav.lastElementChild;
  right.appendChild(btn);
  nav.style.position = "relative";
  nav.appendChild(menu);
  function close() { menu.classList.remove("open"); btn.setAttribute("aria-expanded", "false"); }
  btn.addEventListener("click", function () {
    var open = menu.classList.toggle("open");
    btn.setAttribute("aria-expanded", open ? "true" : "false");
  });
  menu.addEventListener("click", function (e) { if (e.target.tagName === "A") close(); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") close(); });
  /* El idioma traduce los textos del header; el menú repite el texto al abrir */
  btn.addEventListener("click", function () {
    var i = 0; menu.querySelectorAll("a").forEach(function (c) { c.textContent = links[i++].textContent; });
  });
})();
