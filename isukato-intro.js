/* Isukato Games – Start-Intro "Blütenwirbel" (Sakura-Kitsune, gerendert in Blender: intro/fuchs/kitsune_anim.py --anim B --fps60,
   kodiert mit intro/fuchs/encode60.sh: 60 fps, runde Blende eingebrannt).
   Einbinden als ERSTES im <body>:  <script src="isukato-intro.js"></script>   (Video daneben: isukato-intro.mp4)
   - nur beim Kaltstart (einmal pro Sitzung), Antippen überspringt, "Bewegung reduzieren" überspringt ganz
   - kann das Video nicht starten (z. B. Stromsparmodus), verschwindet das Intro sofort */
(function () {
  'use strict';
  var me = document.currentScript;
  var src = (me && me.getAttribute('data-src')) || 'isukato-intro.mp4';
  try {
    if (sessionStorage.getItem('isu-intro')) return;
    sessionStorage.setItem('isu-intro', '1');
  } catch (e) { /* ohne Speicher einfach abspielen */ }
  if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var st = document.createElement('style');
  st.textContent =
    '#isu-intro{position:fixed;inset:0;z-index:2147483647;background:#07080c;display:flex;align-items:center;justify-content:center;' +
    'transition:opacity .45s ease;-webkit-tap-highlight-color:transparent;cursor:pointer}' +
    '#isu-intro.aus{opacity:0;pointer-events:none}' +
    // runde Blende ist ins Video eingebrannt (keine CSS-Maske mehr – die kostete auf Handys bei jedem Bild Leistung)
    '#isu-intro video{width:min(100vw,100vh);height:min(100vw,100vh);object-fit:contain;pointer-events:none}' +
    '#isu-intro span{position:absolute;left:0;right:0;bottom:calc(22px + env(safe-area-inset-bottom,0px));text-align:center;' +
    'font:600 11px/1 system-ui,Roboto,sans-serif;letter-spacing:.18em;color:#5d6270;opacity:0;transition:opacity .4s .9s}' +
    '#isu-intro.an span{opacity:1}';
  (document.head || document.documentElement).appendChild(st);

  var el = document.createElement('div');
  el.id = 'isu-intro';
  el.setAttribute('aria-label', 'Isukato Games');
  var v = document.createElement('video');
  v.muted = true;
  v.defaultMuted = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
  v.preload = 'auto';
  v.src = src;
  var hint = document.createElement('span');
  hint.textContent = (navigator.language || 'de').slice(0, 2) === 'de' ? 'TIPPEN ZUM ÜBERSPRINGEN' : 'TAP TO SKIP';
  el.appendChild(v);
  el.appendChild(hint);
  (document.body || document.documentElement).appendChild(el);

  var fertig = false;
  function ende() {
    if (fertig) return;
    fertig = true;
    el.classList.add('aus');
    setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 500);
  }
  el.addEventListener('click', ende);
  el.addEventListener('touchstart', ende, { passive: true });
  v.addEventListener('ended', ende);
  v.addEventListener('error', ende);
  setTimeout(ende, 7000);  // Sicherheitsnetz
  var p = v.play();
  if (p && p.catch) p.catch(ende);
  requestAnimationFrame(function () { el.classList.add('an'); });
})();
