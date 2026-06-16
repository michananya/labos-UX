---
name: Splash screen pattern
description: Logo animation splash screen used on all LabOS screens — CSS, SVG, HTML structure, and JS IIFE. Skips on internal navigation, shows only on first load or F5.
type: project
---

Every screen opens with a full-page splash that draws the LabOS logo via SVG stroke animation, then fades out after 3 seconds.

**Rule:** Splash shows only on first entry or F5 (reload). Navigating between LabOS screens skips it.

## CSS (inside `<style>`)

```css
/* ── Splash screen ── */
#splash {
  position: fixed;
  inset: 0;
  background: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  transition: opacity 0.6s ease;
  --draw-speed: 0.75;
}
#splash.fade-out { opacity: 0; pointer-events: none; }
#splash svg { width: 300px; }
#splash .greeting {
  font-family: 'Open Sans', sans-serif;
  font-size: 18px; font-weight: 300; color: #333;
  margin-top: 28px; opacity: 0;
  animation: splashGreeting 0.8s ease 0.7s both;
}
@keyframes splashGreeting {
  from { opacity: 0; transform: translateY(6px); }
  to   { opacity: 1; transform: translateY(0); }
}
```

## HTML (immediately after `<body>`)

```html
<div id="splash"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 716.95 164.92">
  <defs><style>
    .cls-1,.cls-2{stroke:#333}.cls-1,.cls-2,.cls-3{fill:none;stroke-linecap:round;stroke-width:17px}.cls-1,.cls-3{stroke-linejoin:round}.cls-2{stroke-miterlimit:10}.cls-3{stroke:#00b08a}
    .draw{stroke-dasharray:1;stroke-dashoffset:1}.draw-rev{stroke-dasharray:1;stroke-dashoffset:-1}
    @keyframes draw{to{stroke-dashoffset:0}}
    @keyframes breathe{0%,100%{stroke-opacity:1}50%{stroke-opacity:.72}}
    .el-cloud{animation:draw calc(.85s * var(--draw-speed,1)) cubic-bezier(.42,0,.58,1) calc(.05s * var(--draw-speed,1)) both,breathe 3.2s ease-in-out calc(2.2s * var(--draw-speed,1)) infinite}
    .el-divider{animation:draw calc(.3s * var(--draw-speed,1)) ease-out calc(.55s * var(--draw-speed,1)) both}
    .el-note-r{animation:draw calc(.8s * var(--draw-speed,1)) cubic-bezier(.42,0,.58,1) calc(.75s * var(--draw-speed,1)) both}
    .el-note-l{animation:draw calc(.8s * var(--draw-speed,1)) cubic-bezier(.42,0,.58,1) calc(.75s * var(--draw-speed,1)) both}
    .el-circle{animation:draw calc(.8s * var(--draw-speed,1)) cubic-bezier(.42,0,.58,1) calc(1.1s * var(--draw-speed,1)) both,breathe 3.2s ease-in-out calc(2.2s * var(--draw-speed,1)) infinite}
    .el-s{animation:draw calc(.8s * var(--draw-speed,1)) cubic-bezier(.42,0,.58,1) calc(1.6s * var(--draw-speed,1)) both,breathe 3.2s ease-in-out calc(2.2s * var(--draw-speed,1)) infinite}
  </style></defs>
  <g>
    <path pathLength="1" class="cls-3 draw-rev el-cloud" d="M195.39,156.4H49.82s-41.32,1.93-41.32-38.95c0-37.37,38.71-40.71,38.71-40.71,0,0,.91-22.5,19.57-32.15,19.12-9.89,34.43.18,34.43.18,0,0,5.03-24.98,37.85-34.19,31.93-8.97,56.33,14.04,56.33,14.04"/>
    <line pathLength="1" class="cls-1 draw el-divider" x1="222.66" y1="8.5" x2="222.66" y2="156.42"/>
    <path pathLength="1" class="cls-2 draw el-note-r" d="M394.68,70.21c5.37-2.28,11.28-3.53,17.48-3.53,24.78,0,44.87,20.09,44.87,44.87s-20.09,44.87-44.87,44.87-44.87-20.09-44.87-44.87V9.06"/>
    <path pathLength="1" class="cls-2 draw el-note-l" d="M312.94,152.26c-5.37,2.28-11.28,3.53-17.48,3.53-24.78,0-44.87-20.09-44.87-44.87,0-24.78,20.09-44.87,44.87-44.87s44.87,20.09,44.87,44.87c0,6.2,0,45.49,0,45.49"/>
    <circle pathLength="1" class="cls-3 draw el-circle" cx="546.26" cy="92.48" r="63.94"/>
    <path pathLength="1" class="cls-3 draw el-s" d="M636.41,136.15s7.35,20.27,36.3,20.27c28.96,0,35.74-23.88,35.74-30.88,0-11.32-2.39-25.63-36.02-33.02-33.63-7.4-36.02-22.98-36.02-33.02,0-7,6.78-30.88,35.74-30.88s36.3,20.27,36.3,20.27"/>
  </g>
</svg>
<p id="splash-greeting" class="greeting"></p>
</div>
```

## JS (two `<script>` blocks before closing `</body>`)

```html
<script>
  (function() {
    var s = document.getElementById('splash');
    var isReload = (performance.getEntriesByType('navigation')[0] || {}).type === 'reload';
    var fromNav  = sessionStorage.getItem('labos_nav') === '1';
    sessionStorage.removeItem('labos_nav');
    if (!isReload && fromNav) { s.remove(); return; }
    var h = new Date().getHours();
    var g = h < 12 ? 'Good morning' : h < 18 ? 'Good afternoon' : 'Good evening';
    var parts = (document.querySelector('labos-navbar')?.getAttribute('user-name') || '').trim().split(/\s+/);
    var first = /^(Dr\.|Prof\.|Mr\.|Mrs\.|Ms\.)$/i.test(parts[0]) ? (parts[1] || '') : (parts[0] || '');
    document.getElementById('splash-greeting').textContent = first ? g + ', ' + first : g;
    setTimeout(function() {
      s.classList.add('fade-out');
      s.addEventListener('transitionend', function() { s.remove(); }, { once: true });
    }, 3000);
  })();
</script>

<script>
  /* Set nav flag before any same-tab link navigation (including shadow DOM links) */
  document.addEventListener('click', function(e) {
    var path = e.composedPath ? e.composedPath() : [];
    var a = path.find(function(el) { return el.tagName === 'A' && el.href && !el.target; });
    if (a && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
      sessionStorage.setItem('labos_nav', '1');
    }
  }, true);
</script>
```

Also: any `window.location.href` navigation in JS must set the flag first:
```js
sessionStorage.setItem('labos_nav', '1');
window.location.href = '...';
```

## How it works
- `sessionStorage.labos_nav='1'` is set by the click interceptor before any `<a>` navigation
- On load: if flag is set AND it's not a reload → remove splash immediately, no animation
- F5 (`type === 'reload'`) always shows splash even if flag is set
- SVG paths use `pathLength="1"` + `stroke-dasharray/offset` draw technique
- `--draw-speed: 0.75` on `#splash` scales all animation durations
- Greeting reads first name from `labos-navbar[user-name]` (skips titles Dr./Prof./Mr./Mrs./Ms.)
- After 3000ms: `fade-out` class → opacity transition → element removed

**How to apply:** Copy all blocks (CSS, HTML, both JS) verbatim into every new screen. Only `breadcrumbs` and `user-name` on `labos-navbar` change per screen.
