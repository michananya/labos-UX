/**
 * LabOS Shared Web Components
 * ----------------------------
 * Usage in any screen HTML:
 *
 *   <script src="../shared/labos-components.js"></script>
 *
 *   <labos-navbar
 *     breadcrumbs='[{"label":"Admin"},{"label":"User Management"}]'
 *     user-name="John Smith"
 *     user-org="LabOS laboratory">
 *   </labos-navbar>
 *
 *   <labos-button variant="default" icon="add">Add User</labos-button>
 *   <labos-button variant="warn"    icon="delete" disabled>Delete</labos-button>
 *
 *   <labos-grid title="Users" id="my-grid"></labos-grid>
 *   <script>
 *     document.getElementById('my-grid').setData(
 *       [{field:'name',label:'Name'}, {field:'email',label:'Email'}],
 *       [{name:'Alice', email:'alice@example.com'}]
 *     );
 *   </script>
 */

// ─── Design tokens ────────────────────────────────────────────────────────────
// CSS custom properties pierce Shadow DOM — define on :host so each component
// inherits them. Override on :root in the page for global theming.
// Design-system tokens — injected once into <head>; CSS custom properties cascade into all Shadow DOMs
(function () {
  if (document.getElementById('labos-tokens')) return;
  const s = document.createElement('style');
  s.id = 'labos-tokens';
  s.textContent =
    ':root {\n' +
    '  --primary:          #265F68;\n' +
    '  --primary-dark:     #1F5156;\n' +
    '  --primary-nav:      #266268;\n' +
    '  --primary-20:       #D5E0E1;\n' +
    '  --primary-border:   #C7DDDF;\n' +
    '  --navbar-text:      #a2bfc2;\n' +
    '  --navbar-search-bg: #1a4246;\n' +
    '  --accent:           #5ABA47;\n' +
    '  --accent-hover:     #52A840;\n' +
    '  --warn:             #D20000;\n' +
    '  --warn-hover:       #B90000;\n' +
    '  --surface:          #F5F5F5;\n' +
    '  --white:            #ffffff;\n' +
    '  --black:            #333333;\n' +
    '  --disabled-op:      0.4;\n' +
    "  --font:             'Open Sans', 'Segoe UI', Arial, sans-serif;\n" +
    '  --radius:           3px;\n' +
    '  --screen-bg:        #ffffff;\n' +
    '  --overlay-shadow:   0 4px 4px 0 rgba(0, 0, 0, 0.25);\n' +
    '  --menu-item-height: 48px;\n' +
    '  --menu-item-fs:     14px;\n' +
    '  --menu-item-fw:     400;\n' +
    '  --menu-item-px:     16px;\n' +
    '  --transition:       background 150ms ease, opacity 150ms ease,\n' +
    '                      border-color 150ms ease, box-shadow 150ms ease;\n' +
    '  --blue:              #1773E0;\n' +
    '  --blue-darken-15:    #104F9B;\n' +
    '  --blue-lighten-25:   #84B7F2;\n' +
    '  --blue-lighten-45:   #E1EDFC;\n' +
    '  --green:             #5ABA47;\n' +
    '  --green-darken-15:   #3F8331;\n' +
    '  --green-lighten-25:  #ADDDA4;\n' +
    '  --green-lighten-45:  #F0F9EE;\n' +
    '  --red:               #FF0000;\n' +
    '  --red-darken-15:     #B30000;\n' +
    '  --red-lighten-25:    #FE8080;\n' +
    '  --red-lighten-45:    #FFE5E5;\n' +
    '  --orange:            #FFA500;\n' +
    '  --orange-darken-15:  #B37300;\n' +
    '  --orange-lighten-25: #FFD280;\n' +
    '  --orange-lighten-45: #FFF6E5;\n' +
    '  --brown:             #D08F1F;\n' +
    '  --brown-darken-15:   #8D6115;\n' +
    '  --brown-lighten-25:  #ECC582;\n' +
    '  --brown-lighten-45:  #FAEEDB;\n' +
    '  --magenta:           #C040B0;\n' +
    '  --magenta-darken-15: #872D7C;\n' +
    '  --magenta-lighten-25:#E0A0D8;\n' +
    '  --magenta-lighten-45:#F9EDF7;\n' +
    '  --pink:              #EF1AC5;\n' +
    '  --pink-darken-15:    #B00C90;\n' +
    '  --pink-lighten-25:   #F791E3;\n' +
    '  --pink-lighten-45:   #FEF1FB;\n' +
    '}';
  document.head.appendChild(s);
})();

// Global Material Icons font-weight fix — injected once into <head>
(function () {
  if (document.getElementById('labos-mi-fw')) return;
  const s = document.createElement('style');
  s.id = 'labos-mi-fw';
  s.textContent = '.material-icons { font-weight: 400; }';
  document.head.appendChild(s);
})();

// Global screen-layout utilities — injected once into <head>
(function () {
  if (document.getElementById('labos-layout')) return;
  const s = document.createElement('style');
  s.id = 'labos-layout';
  s.textContent = '.split-view { border-top: 1px solid #E4E4E4; } .action-bar { margin-bottom: 12px; }';
  document.head.appendChild(s);
})();

// Per-component Shadow DOM reset — box-sizing + Material Icons font-weight
const HOST_BOX = ':host, :host * { box-sizing: border-box; } .material-icons { font-weight: 400; }';



// Resolve logo path relative to this script file
const _scriptDir = (() => {
  const scripts = document.querySelectorAll('script[src]');
  for (const s of scripts) {
    if (s.src.includes('labos-components')) {
      return s.src.substring(0, s.src.lastIndexOf('/') + 1);
    }
  }
  return './';
})();
const DEFAULT_LOGO = _scriptDir + 'LabOS_logo_White.svg';


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-DROPDOWN  (shared portal utility — not a custom element)
// ═══════════════════════════════════════════════════════════════════════════════
//
// All dropdown-opening components use this for a consistent floating item list.
//
// Constructor options:
//   direction  — 'bottom-left'* | 'bottom-right' | 'top-left' | 'top-right'
//   minWidth   — minimum width in px (actual min-width = max(minWidth, anchorWidth))
//   maxHeight  — max-height in px (default 300; null = none)
//   keepFocus  — prevents mousedown on portal from stealing focus (autocomplete)
//
// open(anchorEl, items, onSelect, opts?)  — create / reposition portal
// refresh(items, onSelect)                — re-render items without repositioning
// close()                                 — remove portal
// setHighlight(idx)                       — toggle .lbd-active on item
// get isOpen / getPortal()
//
// items shape: [{ label, value, icon?, disabled? }]
// ─────────────────────────────────────────────────────────────────────────────
(function _injectLabosDropdownCss() {
  if (document.getElementById('labos-dropdown-css')) return;
  const s = document.createElement('style');
  s.id = 'labos-dropdown-css';
  s.textContent = `
    @keyframes labos-drop { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
    [data-labos-portal] {
      position: fixed;
      background: #fff;
      box-shadow: 0 4px 4px 0 rgba(0,0,0,.25);
      z-index: 9999;
      overflow-y: auto;
      animation: labos-drop .12s ease;
    }
    [data-labos-portal] .lbd-item {
      display: flex; align-items: center; gap: 8px;
      height: 48px; padding: 0 16px;
      font-family: 'Open Sans','Segoe UI',Arial,sans-serif;
      font-size: 14px; font-weight: 400; color: #333333;
      cursor: pointer; white-space: nowrap; box-sizing: border-box;
      transition: background .12s;
    }
    [data-labos-portal] .lbd-item:hover:not([disabled]),
    [data-labos-portal] .lbd-item.lbd-active { background: #F5F5F5; }
    [data-labos-portal] .lbd-item[disabled]   { opacity: .38; pointer-events: none; }
    [data-labos-portal] .lbd-item__icon {
      font-family: 'Material Icons'; font-size: 16px;
      font-style: normal; line-height: 1; color: #265F68;
    }
  `;
  document.head.appendChild(s);
})();

class LabosDropdown {
  constructor({ direction = 'bottom-left', minWidth = 0, maxHeight = 300, keepFocus = false } = {}) {
    this._direction = direction;
    this._minWidth  = minWidth;
    this._maxHeight = maxHeight;
    this._keepFocus = keepFocus;
    this._portal    = null;
  }

  get isOpen()  { return !!this._portal; }
  getPortal()   { return this._portal; }

  open(anchorEl, items, onSelect, opts = {}) {
    if (this._portal) this._portal.remove();
    const direction = opts.direction ?? this._direction;
    const rect      = anchorEl.getBoundingClientRect();
    const portal    = document.createElement('div');
    portal.setAttribute('data-labos-portal', '');
    portal.style.minWidth = Math.max(this._minWidth, rect.width) + 'px';
    if (this._maxHeight) portal.style.maxHeight = this._maxHeight + 'px';

    const [vDir, hDir] = direction.split('-');
    portal.style[vDir === 'bottom' ? 'top'  : 'bottom'] =
      vDir === 'bottom' ? (rect.bottom + 1) + 'px' : (window.innerHeight - rect.top + 1) + 'px';
    portal.style[hDir === 'left'   ? 'left' : 'right'] =
      hDir === 'left'  ? rect.left + 'px'           : (window.innerWidth - rect.right) + 'px';

    if (this._keepFocus) portal.addEventListener('mousedown', e => e.preventDefault());
    portal.innerHTML = this._itemsHtml(items);
    this._bindItems(portal, items, onSelect);
    document.body.appendChild(portal);
    this._portal = portal;
  }

  refresh(items, onSelect) {
    if (!this._portal) return;
    this._portal.innerHTML = this._itemsHtml(items);
    if (this._keepFocus) this._portal.addEventListener('mousedown', e => e.preventDefault());
    this._bindItems(this._portal, items, onSelect);
  }

  close() {
    if (this._portal) { this._portal.remove(); this._portal = null; }
  }

  setHighlight(idx) {
    if (!this._portal) return;
    const items = [...this._portal.querySelectorAll('.lbd-item:not([disabled])')];
    items.forEach((el, i) => el.classList.toggle('lbd-active', i === idx));
    if (idx >= 0 && items[idx]) items[idx].scrollIntoView({ block: 'nearest' });
  }

  _itemsHtml(items) {
    return items.map(it => {
      const icon = it.icon ? `<span class="lbd-item__icon">${it.icon}</span>` : '';
      return `<div class="lbd-item" data-value="${it.value ?? ''}" data-label="${it.label ?? ''}" ${it.disabled ? 'disabled' : ''}>${icon}<span>${it.label ?? ''}</span></div>`;
    }).join('');
  }

  _bindItems(portal, items, onSelect) {
    portal.querySelectorAll('.lbd-item').forEach((el, i) => {
      if (items[i]?.disabled) return;
      el.addEventListener('click', () => onSelect?.(items[i]));
    });
  }
}


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-NAVBAR
// ═══════════════════════════════════════════════════════════════════════════════
const NAVBAR_CSS = `
  ${HOST_BOX}
  :host { display: block; }

  nav {
    height: 50px;
    background: var(--primary-nav);
    display: flex;
    align-items: center;
    width: 100%;
    box-sizing: border-box;
  }

  /* ── Left ── */
  .left {
    display: flex;
    align-items: center;
    gap: 12px;
    padding-left: 17px;
    flex: 1;
    min-width: 0;
  }

  .logo { display: flex; align-items: center; flex-shrink: 0; }
  .logo img { height: 30px; width: auto; display: block; margin-bottom: 3px; }

  /* ── Breadcrumbs ── */
  .bc { display: flex; align-items: center; }
  .bc-item { display: flex; align-items: center; }
  .bc-arrow {
    font-family: 'Material Icons';
    font-size: 24px; width: 24px; height: 24px;
    color: var(--navbar-text);
    margin: 0 4px;
    font-style: normal; line-height: 1;
  }
  .bc-label {
    font-family: var(--font);
    font-size: 16px; font-weight: 400;
    color: var(--navbar-text);
    white-space: nowrap;
    text-decoration: none;
    transition: color 150ms ease;
  }
  .bc-label:not(.bc-label--current):hover { color: #d4e8ea; }

  /* ── Right ── */
  .right {
    display: flex;
    align-items: center;
    gap: 4px;
    padding-right: 16px;
    flex-shrink: 0;
  }

  /* Icon buttons */
  .icon-btn {
    width: 32px; height: 32px;
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; border-radius: var(--radius);
    cursor: pointer; color: var(--navbar-text);
    font-family: var(--font);
    transition: background 150ms ease;
  }
  .icon-btn:hover { background: rgba(255,255,255,0.12); }
  .icon-btn span {
    font-family: 'Material Icons';
    font-size: 24px; font-style: normal; line-height: 1;
  }

  /* Separator */
  .sep {
    display: block;
    width: 1px; height: 28px;
    background: rgba(162,191,194,0.5);
    margin: 0 4px;
  }

  /* User */
  .user-btn {
    display: flex; align-items: center; gap: 4px;
    background: none; border: none; border-radius: var(--radius);
    cursor: pointer; padding: 4px 6px;
    transition: background 150ms ease;
  }
  .user-btn:hover { background: rgba(255,255,255,0.12); }
  .user-text { display: flex; flex-direction: column; align-items: flex-end; }
  .user-name {
    font-family: var(--font); font-size: 12px;
    color: var(--navbar-text); white-space: nowrap; line-height: 1.4;
  }
  .user-org {
    font-family: var(--font); font-size: 12px;
    color: var(--navbar-text); white-space: nowrap; line-height: 1.4; opacity: 0.75;
  }
  .user-arrow {
    font-family: 'Material Icons';
    font-size: 18px; color: var(--navbar-text);
    font-style: normal; line-height: 1;
  }

  /* Search */
  .search { position: relative; width: 215px; height: 30px; flex-shrink: 0; }
  .search input {
    width: 100%; height: 100%;
    background: var(--navbar-search-bg); border: none; border-radius: var(--radius);
    padding: 0 10px;
    font-family: var(--font); font-size: 14px; color: var(--navbar-text);
    outline: none; box-sizing: border-box;
  }
  .search input::placeholder { color: var(--navbar-text); }
`;

class LabosNavbar extends HTMLElement {
  static get observedAttributes() {
    return ['breadcrumbs', 'user-name', 'user-org', 'logo-src'];
  }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const crumbs  = JSON.parse(this.getAttribute('breadcrumbs') || '[]');
    const userName = this.getAttribute('user-name') || '';
    const userOrg  = this.getAttribute('user-org')  || '';
    const logoSrc  = this.getAttribute('logo-src')  || DEFAULT_LOGO;

    const bcHtml = crumbs.map((item, i) => {
      const last  = i === crumbs.length - 1;
      const label = last
        ? `<span class="bc-label bc-label--current">${item.label}</span>`
        : `<a href="${item.route || '#'}" class="bc-label">${item.label}</a>`;
      return `<div class="bc-item">
        <span class="bc-arrow">keyboard_arrow_right</span>
        ${label}
      </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${NAVBAR_CSS}</style>
      <nav>
        <div class="left">
          <button class="icon-btn" title="Toggle menu" part="menu-btn">
            <span>menu</span>
          </button>
          <div class="logo">
            <img src="${logoSrc}" alt="LabOS">
          </div>
          <div class="bc">${bcHtml}</div>
        </div>

        <div class="right">
          <div class="search">
            <input type="text" placeholder="Search…" part="search-input">
          </div>
          <button class="icon-btn" title="Chat"><span>question_answer</span></button>
          <button class="icon-btn" title="Flag"><span>flag</span></button>
          <button class="icon-btn" title="Columns"><span>view_column</span></button>
          <button class="icon-btn" title="Mail"><span>markunread</span></button>
          <button class="user-btn" part="user-btn">
            <div class="user-text">
              <span class="user-name">${userName}</span>
              <span class="user-org">${userOrg}</span>
            </div>
            <span class="user-arrow">arrow_drop_down</span>
          </button>
          <span class="sep"></span>
          <button class="icon-btn" title="Help"><span>help</span></button>
          <button class="icon-btn" title="Fullscreen"><span>fullscreen</span></button>
        </div>
      </nav>
    `;

    // Forward search input event out
    this.shadowRoot.querySelector('input').addEventListener('input', e => {
      this.dispatchEvent(new CustomEvent('labos-search', {
        detail: e.target.value, bubbles: true, composed: true,
      }));
    });

    // Forward menu toggle
    this.shadowRoot.querySelector('[title="Toggle menu"]').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('labos-menu-toggle', { bubbles: true, composed: true }));
    });
  }
}
customElements.define('labos-navbar', LabosNavbar);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
const BUTTON_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; }
  :host([hidden]) { display: none; }

  button {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    height: 36px;
    padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--radius);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 400;
    cursor: pointer;
    white-space: nowrap;
    transition: var(--transition);
    box-sizing: border-box;
    user-select: none;
  }

  .icon {
    font-family: 'Material Icons';
    font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
  }

  /* ── Variants ── */
  :host([variant="default"]) button, :host(:not([variant])) button {
    background: var(--white);
    border-color: var(--primary-20);
    color: var(--primary);
  }
  :host([variant="default"]) button:hover:not(:disabled),
  :host(:not([variant]))     button:hover:not(:disabled) {
    background: var(--surface);
  }
  :host([variant="default"]) button:focus-visible,
  :host([variant="default"]) button:active,
  :host(:not([variant]))     button:focus-visible,
  :host(:not([variant]))     button:active {
    outline: none; box-shadow: 0 0 7px 0 var(--primary-20);
  }

  :host([variant="primary"]) button {
    background: var(--primary); border-color: var(--primary); color: var(--white);
  }
  :host([variant="primary"]) button:hover:not(:disabled) {
    background: var(--primary-dark); border-color: var(--primary-dark);
  }
  :host([variant="primary"]) button:focus-visible,
  :host([variant="primary"]) button:active {
    outline: none; box-shadow: 0 0 7px 0 var(--primary);
  }

  :host([variant="accent"]) button {
    background: var(--accent); border-color: var(--accent); color: var(--white);
  }
  :host([variant="accent"]) button:hover:not(:disabled) {
    background: var(--accent-hover); border-color: var(--accent-hover);
  }
  :host([variant="accent"]) button:focus-visible,
  :host([variant="accent"]) button:active {
    outline: none; box-shadow: 0 0 7px 0 var(--accent);
  }

  :host([variant="warn"]) button {
    background: var(--warn); border-color: var(--warn); color: var(--white);
  }
  :host([variant="warn"]) button:hover:not(:disabled) {
    background: var(--warn-hover); border-color: var(--warn-hover);
  }
  :host([variant="warn"]) button:focus-visible,
  :host([variant="warn"]) button:active {
    outline: none; box-shadow: 0 0 7px 0 var(--warn);
  }

  /* ── Sizes ── */
  :host([size="xsmall"]) button { height: 24px; padding: 0 8px;  font-size: 12px; }
  :host([size="small"])  button { height: 30px; padding: 0 10px; font-size: 13px; }
  :host([size="large"])  button { height: 44px; padding: 0 16px; font-size: 14px; }

  /* ── Cancel (dialog cancel button) ── */
  :host([cancel]) button:focus-visible,
  :host([cancel]) button:focus,
  :host([cancel]) button:active {
    box-shadow: 0 0 7px 0 var(--primary-20);
  }

  /* ── Icon-only ── */
  :host([icon-only]) button {
    width: 36px; padding: 0;
    border-radius: 50%;
    border-color: transparent;
    background: transparent;
    justify-content: center;
  }
  :host([icon-only]) .icon { color: var(--primary, #265F68); }
  :host([icon-only][variant="default"]) button:hover:not(:disabled),
  :host([icon-only]:not([variant]))     button:hover:not(:disabled) {
    background: rgba(38,95,104,.12);
    border-color: transparent;
  }
  :host([icon-only]) button:focus-visible {
    outline: none;
    box-shadow: 0 0 7px 0 var(--primary);
  }

  /* Icon-only sizes — width tracks height */
  :host([icon-only][size="large"])  button { width: 44px; }
  :host([icon-only][size="small"])  button { width: 30px; }
  :host([icon-only][size="xsmall"]) button { width: 24px; }

  /* ── Shape: square / rounded (icon-only with visible border) ── */
  :host([shape="square"]) button,
  :host([shape="rounded"]) button {
    width: 36px; padding: 0;
    justify-content: center;
  }
  :host([shape="square"])  button { border-radius: var(--radius); }
  :host([shape="rounded"]) button { border-radius: 50%; }

  :host([shape="square"][size="large"])  button,
  :host([shape="rounded"][size="large"])  button { width: 44px; }
  :host([shape="square"][size="small"])  button,
  :host([shape="rounded"][size="small"])  button { width: 30px; }
  :host([shape="square"][size="xsmall"]) button,
  :host([shape="rounded"][size="xsmall"]) button { width: 24px; }

  /* ── Borderless ── */
  :host([borderless]) button {
    border-color: transparent; background: transparent; color: var(--primary); font-weight: 600;
  }
  :host([borderless]) button:hover:not(:disabled) {
    background: rgba(38,95,104,.08); border-color: transparent;
  }

  /* ── Disabled ── */
  :host([disabled]) button {
    cursor: not-allowed;
    pointer-events: none;
  }
`;

class LabosButton extends HTMLElement {
  static get observedAttributes() { return ['variant', 'size', 'disabled', 'icon', 'type', 'cancel', 'shape', 'borderless']; }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const icon = this.getAttribute('icon') || '';
    const type = this.getAttribute('type') || 'button';
    const iconHtml = icon ? `<span class="icon">${icon}</span>` : '';

    this.shadowRoot.innerHTML = `
      <style>${BUTTON_CSS}</style>
      <button type="${type}" ${this.hasAttribute('disabled') ? 'disabled' : ''}>
        ${iconHtml}<slot></slot>
      </button>
    `;

    this.shadowRoot.querySelector('button').addEventListener('click', e => {
      if (this.hasAttribute('disabled')) { e.stopImmediatePropagation(); return; }
    });
  }
}
customElements.define('labos-button', LabosButton);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BUTTON-GROUP
// ═══════════════════════════════════════════════════════════════════════════════
//
// Usage:
//   <labos-button-group></labos-button-group>
//   el.setItems([{ icon:'print', title:'Print', value:'print' }, ...]);
//   el.addEventListener('labos-select', e => console.log(e.detail));
//
// Item shape : { icon, title?, value?, disabled? }
// Attrs      : size (large | small | xsmall), disabled
// Events     : labos-select → { icon, value, index }
//
const BUTTON_GROUP_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; align-items: center; }
  .bg__btn {
    display: flex; align-items: center; justify-content: center;
    width: 36px; height: 36px; padding: 0;
    background: var(--white, #fff);
    border: 1px solid var(--primary-20, #D5E0E1);
    color: var(--primary, #265F68);
    cursor: pointer; user-select: none;
    margin-right: -1px; position: relative;
    transition: background 120ms;
  }
  .bg__btn:first-child { border-radius: 3px 0 0 3px; }
  .bg__btn:last-child  { border-radius: 0 3px 3px 0; margin-right: 0; }
  .bg__btn:hover:not(:disabled) { background: var(--surface, #F5F5F5); z-index: 1; }
  .bg__btn:disabled { opacity: 0.4; cursor: not-allowed; }
  .bg__icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400; font-style: normal;
    line-height: 1; color: var(--primary, #265F68);
  }
  :host([size="large"])  .bg__btn { width: 44px; height: 44px; }
  :host([size="small"])  .bg__btn { width: 30px; height: 30px; }
  :host([size="small"])  .bg__icon { font-size: 16px; }
  :host([size="xsmall"]) .bg__btn { width: 24px; height: 24px; }
  :host([size="xsmall"]) .bg__icon { font-size: 14px; }
  :host([disabled]) .bg__btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
`;
class LabosButtonGroup extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items = [];
    this._render();
  }
  setItems(items) { this._items = items || []; this._render(); }
  _render() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>${BUTTON_GROUP_CSS}</style>`;
    (this._items || []).forEach((item, i) => {
      const btn = document.createElement('button');
      btn.className = 'bg__btn';
      btn.title = item.title || item.icon || '';
      if (item.disabled) btn.disabled = true;
      const ic = document.createElement('span');
      ic.className = 'bg__icon'; ic.textContent = item.icon || '';
      btn.appendChild(ic);
      btn.addEventListener('click', () => this.dispatchEvent(new CustomEvent('labos-select', {
        detail: { icon: item.icon, value: item.value ?? item.icon, index: i },
        bubbles: true, composed: true,
      })));
      this.shadowRoot.appendChild(btn);
    });
  }
}
customElements.define('labos-button-group', LabosButtonGroup);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BUTTON-TOGGLE-GROUP
// ═══════════════════════════════════════════════════════════════════════════════
//
// Usage:
//   <labos-button-toggle-group value="list"></labos-button-toggle-group>
//   el.setItems([{ icon:'view_list', label:'List', value:'list' }, ...]);
//   el.addEventListener('labos-select', e => console.log(e.detail));
//
// Item shape : { icon?, label?, value }
// Attrs      : value (selected), size (large | small | xsmall), disabled
// Events     : labos-select → { label, value, index }
//
const BUTTON_TOGGLE_GROUP_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; align-items: center; }
  .btg__wrap { display: inline-flex; align-items: center; }
  .btg__btn {
    display: flex; align-items: center; justify-content: center; gap: 7px;
    height: 36px; padding: 0 12px;
    background: var(--white, #fff);
    border: 1px solid var(--primary-20, #D5E0E1);
    color: var(--primary, #265F68);
    cursor: pointer; user-select: none;
    font-family: var(--font, 'Open Sans', sans-serif); font-size: 14px; font-weight: 400;
    margin-right: -1px; position: relative; white-space: nowrap;
    transition: background 120ms;
    border-radius: 0;
  }
  .btg__btn--icon-only { width: 36px; padding: 0; }
  .btg__wrap .btg__btn:first-child { border-radius: 3px 0 0 3px; }
  .btg__wrap .btg__btn:last-child  { border-radius: 0 3px 3px 0; margin-right: 0; }
  .btg__btn:hover:not(.btg__btn--selected) { background: var(--surface, #F5F5F5); z-index: 1; }
  .btg__btn--selected {
    background: var(--primary, #265F68); border-color: var(--primary-dark, #1F5156);
    color: #fff; z-index: 1;
  }
  .btg__btn--selected .btg__icon { color: #fff; }
  .btg__icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400; font-style: normal;
    line-height: 1; color: var(--primary, #265F68); flex-shrink: 0;
  }
  :host([size="large"])  .btg__btn           { height: 44px; padding: 0 16px; }
  :host([size="large"])  .btg__btn--icon-only { width: 44px; padding: 0; }
  :host([size="small"])  .btg__btn           { height: 30px; padding: 0 10px; font-size: 13px; }
  :host([size="small"])  .btg__btn--icon-only { width: 30px; padding: 0; }
  :host([size="small"])  .btg__icon { font-size: 16px; }
  :host([size="xsmall"]) .btg__btn           { height: 24px; padding: 0 8px;  font-size: 12px; }
  :host([size="xsmall"]) .btg__btn--icon-only { width: 24px; padding: 0; }
  :host([size="xsmall"]) .btg__icon { font-size: 14px; }
  :host([disabled]) .btg__btn { opacity: 0.4; cursor: not-allowed; pointer-events: none; }
`;
class LabosButtonToggleGroup extends HTMLElement {
  static get observedAttributes() { return ['value', 'disabled']; }
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items = [];
    this._render();
  }
  attributeChangedCallback(n) { if (n === 'value') this._syncSelection(); }
  setItems(items) { this._items = items || []; this._render(); }
  setValue(val)   { this.setAttribute('value', String(val)); }
  _render() {
    if (!this.shadowRoot) return;
    const sel = this.getAttribute('value');
    this.shadowRoot.innerHTML = `<style>${BUTTON_TOGGLE_GROUP_CSS}</style><div class="btg__wrap"></div>`;
    const wrap = this.shadowRoot.querySelector('.btg__wrap');
    (this._items || []).forEach((item, i) => {
      const btn = document.createElement('button');
      const iconOnly = item.icon && !item.label;
      btn.className = 'btg__btn' + (iconOnly ? ' btg__btn--icon-only' : '') +
                      (String(item.value) === sel ? ' btg__btn--selected' : '');
      btn.dataset.value = String(item.value);
      if (item.icon) {
        const ic = document.createElement('span');
        ic.className = 'btg__icon'; ic.textContent = item.icon;
        btn.appendChild(ic);
      }
      if (item.label) {
        const lbl = document.createElement('span'); lbl.textContent = item.label;
        btn.appendChild(lbl);
      }
      btn.addEventListener('click', () => {
        this.setAttribute('value', String(item.value));
        this._syncSelection();
        this.dispatchEvent(new CustomEvent('labos-select', {
          detail: { label: item.label || '', value: item.value, index: i },
          bubbles: true, composed: true,
        }));
      });
      wrap.appendChild(btn);
    });
  }
  _syncSelection() {
    if (!this.shadowRoot) return;
    const sel = this.getAttribute('value');
    this.shadowRoot.querySelectorAll('.btg__btn').forEach(btn => {
      const active = btn.dataset.value === sel;
      btn.classList.toggle('btg__btn--selected', active);
      const ic = btn.querySelector('.btg__icon');
      if (ic) ic.style.color = active ? '#fff' : '';
    });
  }
}
customElements.define('labos-button-toggle-group', LabosButtonToggleGroup);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-GRID
// ───────────────────────────────────────────────────────────────────────────────
// API:
//   title attr       — titlebar label
//   row-drag attr    — enables drag-to-reorder rows
//   mode attr        — 'simple' (default): all data loaded at once, no load-all button
//                      'infinity-scroll': paged loading, shows "Load entire list" chip button
//   height attr      — 'content' (default): height follows row count, no internal scroll
//                      'fill': grows to fill parent container, internal scroll when rows overflow
//   setData(cols, rows)
//   setSelection(indices)
//   selectedRows     — getter
//   row-expand attr  — enables expand-panel column (more_horiz button per row)
//   setExpandContent(index, html) — fill the panel for a given row index
//   Events:
//     'labos-selection-change' → e.detail = { selected, indices }
//     'labos-sort'             → e.detail = { field, direction }
//     'labos-row-expand'       → e.detail = { index, row, panel }  (row-expand mode)
//     'labos-row-order-change' → e.detail = { rows }  (row-drag mode)
// ═══════════════════════════════════════════════════════════════════════════════
const GRID_CSS = `
  ${HOST_BOX}
  :host { display: flex; flex-direction: column; }

  .grid-wrap {
    display: flex; flex-direction: column;
  }
  #grid-body { overflow: hidden; border-bottom: 1px solid #e2e2e2; }

  /* ── Title bar ── */
  .titlebar {
    display: flex; align-items: center; justify-content: space-between;
    padding-bottom: 8px;
  }
  .titlebar__title { font-family: var(--font); font-size: 14px; font-weight: 700; color: var(--black); }
  .titlebar__right { display: flex; align-items: center; gap: 10px; }
  .titlebar__count {
    font-family: var(--font); font-size: 14px; font-weight: 600; color: var(--black);
    white-space: nowrap;
  }
  .titlebar__chip-btn {
    width: 28px; height: 28px;
    background: var(--white); border: 1px solid var(--primary-border, #C8DDDF);
    border-radius: 18px; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    color: var(--primary, #265F68); transition: background 120ms, border-color 120ms;
    outline: none; flex-shrink: 0;
  }
  .titlebar__chip-btn:not(:disabled):hover:not([selected]) { background: #EDF4F5; }
  .titlebar__chip-btn:not(:disabled):hover[selected]        { background: #C8D8D9; }
  .titlebar__chip-btn[selected] { background: #D8E7E8; border-color: #6D9CA1; }
  .chip__icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400;
    font-style: normal; line-height: 1; flex-shrink: 0;
  }
  .titlebar__more { display: flex; align-items: center; }

  /* ── Header — #dbdbdb ── */
  .grid-header {
    display: grid; height: 35px;
    background: #dbdbdb;
    border-bottom: 1px solid #e2e2e2;
    align-items: stretch;
    position: sticky; top: 0; z-index: 1;
  }
  .grid-header-cell {
    display: flex; align-items: center;
    position: relative;
    overflow: hidden;
  }
  .grid-header-cell:not(:first-child):not(:last-child)::after {
    content: ''; position: absolute; right: 0;
    top: 50%; transform: translateY(-50%);
    width: 1px; height: 20px; background: #B4B4B4;
    pointer-events: none;
  }
  .col-resize-handle {
    position: absolute; top: 0; right: -4px;
    width: 8px; height: 100%;
    cursor: ew-resize; z-index: 2;
  }
  .grid-header-cell:first-child    { border-right: none; justify-content: center; }
  .grid-header-cell--action        { border-right: none; border-left: 1px solid #d9d9d9; justify-content: center; }

  .grid-header-cell__inner {
    display: flex; align-items: center; justify-content: space-between;
    width: 100%; height: 100%; padding: 0 8px;
    overflow: hidden;
  }
  .grid-header-cell__label {
    font-family: var(--font); font-size: 14px; font-weight: 700; color: #666;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .btn-icon {
    width: 36px; height: 36px; padding: 0;
    display: inline-flex; align-items: center; justify-content: center;
    border-radius: 50%; border: none; background: transparent;
    cursor: pointer; color: var(--primary);
    transition: background 120ms;
    user-select: none;
  }
  .btn-icon:hover { background: rgba(38,95,104,.12); }
  .btn-icon.btn-sm { width: 30px; height: 30px; }
  .btn-icon .material-icons,
  .btn-icon .icon { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; }

  .filter-btn { position: relative; }
  .filter-dot {
    display: none; position: absolute; top: 6px; right: 5px;
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--orange, #FFA500); pointer-events: none;
  }
  .filter-btn[data-active] .filter-dot { display: block; }

  /* ── Rows ── */
  .grid-row {
    display: grid; height: 34px;
    background: var(--white);
    border-top: 1px solid #e2e2e2;
    align-items: center;
    cursor: default; transition: var(--transition);
  }
  #grid-body > .grid-header + .grid-row,
  #grid-body > .grid-header + .grid-row-wrap > .grid-row { border-top: none; }
  .grid-row:hover    { background: #f8f8f8; }
  .grid-row.selected { background: var(--primary-20); }

  .grid-cell {
    font-family: var(--font); font-size: 14px; color: var(--black);
    padding: 0 8px;
    overflow: hidden;
    height: 100%; display: flex; align-items: center;
  }
  .grid-cell__inner {
    display: block; width: 100%;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .grid-cell:first-child { padding: 0; justify-content: center; }
  .grid-cell--action     { padding: 0; justify-content: center; border-left: 1px solid #d9d9d9; }

  /* ── Badges ── */
  .badge { display:inline-flex; align-items:center; height:20px; padding:0 6px; border-radius:3px; font-size:11px; font-weight:600; font-family:var(--font); }
  .badge-admin  { background:#D5E0E1; color:#265F68; }
  .badge-user   { background:#e8f5e9; color:#2e7d32; }
  .badge-viewer { background:#fff3e0; color:#e65100; }

  /* ── Row action icon ── */
  .row-action { display: flex; align-items: center; }

  /* ── Row expand panel ── */
  .grid-row-wrap { display: flex; flex-direction: column; }
  .row-expand-panel {
    display: none;
    background: #f4f4f4;
    padding: 20px 20px 20px 50px;
    overflow: hidden;
  }
  .row-expand-panel.open { display: block; }
  .grid-row.row-expanded          { background: #f4f4f4; }
  .grid-row.row-expanded:hover    { background: #f4f4f4; }
  .grid-row.row-expanded.selected { background: var(--primary-20); }

  /* ── Inactive rows ── */
  .grid-row.inactive .grid-cell { opacity: 0.45; }
  .grid-row.inactive:hover { background: var(--white); }

  /* ── Emergency-active rows ── */
  .grid-row.em-active           { background: var(--red-lighten-45, #FFE5E5); }
  .grid-row.em-active:hover     { background: var(--red-lighten-45, #FFE5E5); filter: brightness(0.97); }
  .grid-row.em-active.selected  { background: var(--red-lighten-45, #FFE5E5); filter: brightness(0.94); }

  /* ── Indicator column (type:'indicator') ── */
  .grid-header-cell--indicator { border-right: none; }
  .grid-cell--indicator        { padding: 0; justify-content: center; overflow: visible; }

  .em-indicator-dot {
    display: inline-block;
    width: 10px; height: 10px; border-radius: 50%;
    background: var(--red-darken-15, #B30000);
    flex-shrink: 0;
  }

  /* ── Keyboard focus ── */
  #grid-body { outline: none; }
  .grid-cell.cell-focused { box-shadow: inset 0 0 0 1px var(--primary); }

  /* ── Icon-only column ── */
  .grid-header-cell--icon-only { justify-content: center; }
  .grid-cell--icon-only        { padding: 0; justify-content: center; }

  /* ── Sortable columns ── */
  .grid-header-cell--sortable .grid-header-cell__inner { cursor: pointer; }
  .grid-header-cell--sortable:hover .grid-header-cell__label { color: var(--primary, #265F68); }
  .sort-icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400; line-height: 1;
    color: var(--primary, #265F68);
    display: none; align-items: center; flex-shrink: 0;
    margin-left: 2px; transition: transform 150ms ease; user-select: none;
  }
  .sort-icon--active { display: inline-flex; }

  /* height=”fill” — styles applied via JS in _render() */

  /* ── Row dragging ── */
  .row-drag-handle {
    display: none; align-items: center; justify-content: center; flex-shrink: 0;
    width: 18px; height: 18px;
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400; line-height: 1;
    color: #999999; cursor: grab;
    user-select: none; -webkit-user-select: none;
  }
  .grid-body--draggable .row-drag-handle,
  .grid-body--drag-disabled .row-drag-handle       { display: inline-flex; }
  .grid-body--drag-disabled .row-drag-handle       { opacity: 0.6; cursor: default; }
  .grid-body--draggable .grid-cell:first-child,
  .grid-body--drag-disabled .grid-cell:first-child { justify-content: flex-start; padding-left: 2px; gap: 2px; }
  .row-dragging { opacity: 0.3; pointer-events: none; }
`;

let _gridTipEl = null;
function _getGridTip() {
  if (!_gridTipEl || !document.body.contains(_gridTipEl)) {
    _gridTipEl = document.createElement('div');
    _gridTipEl.style.cssText = 'position:fixed;background:#333333;color:#ffffff;font-size:12px;font-weight:400;height:20px;padding:0 7px;line-height:20px;border-radius:3px;white-space:nowrap;z-index:99999;pointer-events:none;display:none;font-family:Open Sans,Segoe UI,Arial,sans-serif;box-shadow:0 2px 6px rgba(0,0,0,.2);letter-spacing:.1px';
    document.body.appendChild(_gridTipEl);
  }
  return _gridTipEl;
}

class LabosGrid extends HTMLElement {
  static get observedAttributes() { return ['title', 'row-drag', 'mode', 'height', 'row-expand']; }

  constructor() {
    super();
    this._columns     = [];
    this._rows        = [];
    this._selected    = new Set();
    this._focusedIdx  = -1;
    this._anchorIdx   = -1;
    this._focusedCell = null;
    this._colWidths    = null;
    this._visibleCols  = null;
    this._sortField      = null;
    this._sortDir        = null;
    this._originalRows   = [];
    this._rowDrag        = this.hasAttribute('row-drag');
    this._rowExpand      = this.hasAttribute('row-expand');
    this._expandedRows   = new Set();
    this._dragSrcIdx     = -1;
    this._dragOverIdx    = -1;
    this._dragInsertBefore = true;
    this._dragClone        = null;
    this._pendingOrder     = [];
    this._colFilters    = new Map();
    this._filterField   = null;
    this._filterPopover = null;
  }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag')   this._rowDrag   = this.hasAttribute('row-drag');
    if (name === 'row-expand') this._rowExpand = this.hasAttribute('row-expand');
    if (this.shadowRoot) this._render();
  }

  /** Main API — call this to load data */
  setData(columns, rows) {
    this._columns      = columns;
    this._originalRows = rows;
    this._colFilters   = new Map();
    this._expandedRows = new Set();
    this._rows         = this._applySort(rows);
    this._selected.clear();
    this._focusedIdx  = -1;
    this._anchorIdx   = -1;
    this._focusedCell = null;
    this._colWidths   = null;
    const defaultHidden = columns.some(c => c.hidden);
    this._visibleCols = defaultHidden
      ? new Set(columns.map((c, i) => c.hidden ? null : i).filter(i => i !== null))
      : null;
    this._render();
  }

  get selectedRows() {
    return [...this._selected].map(i => this._rows[i]);
  }

  setExpandContent(index, html) {
    const panel = this.shadowRoot?.querySelector(`.row-expand-panel[data-panel="${index}"]`);
    if (panel) panel.innerHTML = html;
  }

  setSelection(indices) {
    this._selected = new Set(indices);
    this._updateRows();
    this._syncSelectAll();
    if (indices.length > 0) {
      const first = Math.min(...indices);
      this.shadowRoot?.querySelector(`.grid-row[data-row="${first}"]`)
        ?.scrollIntoView({ block: 'nearest' });
    }
  }

  _applySort(rows) {
    if (!this._sortField || !this._sortDir) return rows;
    const f   = this._sortField;
    const dir = this._sortDir === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const av = String(a[f] ?? '').toLowerCase();
      const bv = String(b[f] ?? '').toLowerCase();
      return av < bv ? -dir : av > bv ? dir : 0;
    });
  }

  get mode() { return this.getAttribute('mode') || 'infinity-scroll'; }
  get _canDrag() { return this._rowDrag && !this._sortField; }

  get _activeCols() {
    if (!this._visibleCols) return this._columns;
    return this._columns.filter((_, i) => this._visibleCols.has(i));
  }

  _colTemplate() {
    const firstW = this._rowDrag ? '55px' : '35px';
    const cols = this._activeCols;
    const isNarrowIcon = c => c.type === 'icon-only' && !c.label;
    const dataCols = this._colWidths
      ? cols.map((c, i) => isNarrowIcon(c) ? '44px' : c.type === 'indicator' ? '32px' : this._colWidths[i] + 'px').join(' ')
      : cols.map(c  => isNarrowIcon(c) ? '44px' : c.type === 'indicator' ? '32px' : '1fr').join(' ');
    return this._rowExpand ? `${firstW} ${dataCols} 35px` : `${firstW} ${dataCols}`;
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const title   = this.getAttribute('title') || '';
    const count   = this._rows.length;
    const colTpl  = this._colTemplate();

    const activeCols  = this._activeCols;
    const headerCells = activeCols.map((c, ci) => {
      if (c.type === 'icon-only' && !c.label) {
        return `<div class="grid-header-cell grid-header-cell--icon-only" title="${c.title || ''}">
          <span style="font-family:'Material Icons';font-size:16px;font-weight:400;color:#666;line-height:1">${c.icon || ''}</span>
        </div>`;
      }
      if (c.type === 'indicator') {
        return `<div class="grid-header-cell grid-header-cell--indicator"></div>`;
      }
      const nextIsIconOnly = activeCols[ci + 1]?.type === 'icon-only' && !activeCols[ci + 1]?.label;
      const canResize = ci < activeCols.length - 1 && !nextIsIconOnly;
      const isSortable = !!c.sortable;
      const isSorted   = isSortable && this._sortField === c.field;
      const sortStyle  = isSorted ? (this._sortDir === 'asc' ? 'transform:rotate(-90deg)' : 'transform:rotate(90deg)') : '';
      const sortIcon   = isSortable
        ? '<span class="sort-icon' + (isSorted ? ' sort-icon--active' : '') + '" style="' + sortStyle + '">arrow_right_alt</span>'
        : '';
      const cellClass  = 'grid-header-cell' + (isSortable ? ' grid-header-cell--sortable' : '');
      const sortAttr   = isSortable ? 'data-sort-field="' + c.field + '"' : '';
      return `<div class="${cellClass}" ${sortAttr}>
        <div class="grid-header-cell__inner">
          <span class="grid-header-cell__label">${c.label}</span>
          ${sortIcon}
          ${c.filterable ? `<button class="btn-icon btn-sm filter-btn" data-filter-btn="${c.field}" style="margin-left:auto;color:var(--primary,#265F68)"><span class="material-icons">filter_list</span><span class="filter-dot"></span></button>` : ``}
        </div>
        ${canResize ? `<div class="col-resize-handle" data-col="${ci}"></div>` : ''}
      </div>`;
    }).join('');

    const dataRows = this._rows.map((row, ri) => {
      const cells = activeCols.map((c, ci) => {
        const val = row[c.field] ?? '';
        if (c.type === 'icon-only') {
          const cellClass = c.label ? 'grid-cell' : 'grid-cell grid-cell--icon-only';
          if (!val) return `<div class="${cellClass}" data-col="${ci}"></div>`;
          const color = c.color || (c.clickable ? '#265F68' : '#666666');
          const icon = `<span style="font-family:'Material Icons';font-size:16px;font-weight:400;color:${color};line-height:1;cursor:${c.clickable ? 'pointer' : 'default'}">${c.icon || ''}</span>`;
          return `<div class="${cellClass}" data-col="${ci}">${icon}</div>`;
        }
        if (c.type === 'indicator') {
          return `<div class="grid-cell grid-cell--indicator" data-col="${ci}">${c.render ? c.render(val, row) : ''}</div>`;
        }
        if (c.render) return `<div class="grid-cell" data-col="${ci}">${c.render(val, row)}</div>`;
        return `<div class="grid-cell" data-col="${ci}" data-tip="${val}"><span class="grid-cell__inner">${val}</span></div>`;
      }).join('');
      const sel      = this._selected.has(ri) ? 'selected'  : '';
      const inactive = row.inactive             ? 'inactive' : '';
      const emActive = row._emActive            ? 'em-active': '';
      const dragHandle = this._rowDrag
        ? `<span class="row-drag-handle" data-drag-row="${ri}">drag_indicator</span>`
        : '';
      const actionCell = this._rowExpand
        ? `<div class="grid-cell grid-cell--action"><button class="btn-icon btn-sm row-action" data-row="${ri}"><span class="material-icons">more_horiz</span></button></div>`
        : '';
      const rowEl = `<div class="grid-row ${sel} ${inactive} ${emActive}" data-row="${ri}" style="grid-template-columns:${colTpl}">
          <div class="grid-cell">
            ${dragHandle}
            <labos-checkbox class="row-cb" data-row="${ri}" ${sel ? 'checked' : ''}></labos-checkbox>
          </div>
          ${cells}
          ${actionCell}
        </div>`;
      if (this._rowExpand) {
        return `<div class="grid-row-wrap">${rowEl}<div class="row-expand-panel" data-panel="${ri}"></div></div>`;
      }
      return rowEl;
    }).join('');

    this.shadowRoot.innerHTML = `
      <style>${GRID_CSS}</style>
      <div class="grid-wrap">
        <div class="titlebar">
          <span class="titlebar__title">${title}</span>
          <div class="titlebar__right">
            <span class="titlebar__count">${count} items</span>
            ${this.mode === 'infinity-scroll' ? `<button class="titlebar__chip-btn" title="Load entire list"><span class="chip__icon">keyboard_double_arrow_down</span></button>` : ''}
            <labos-icon-menu class="titlebar__more" icon="more_vert" size="small" direction="bottom-right"></labos-icon-menu>
          </div>
        </div>
        <div id="grid-body" class="${this._canDrag ? 'grid-body--draggable' : this._rowDrag ? 'grid-body--drag-disabled' : ''}" tabindex="0">
          <div class="grid-header" style="grid-template-columns:${colTpl}">
            <div class="grid-header-cell">
              <labos-checkbox id="check-all"></labos-checkbox>
            </div>
            ${headerCells}
            ${this._rowExpand ? '<div class="grid-header-cell grid-header-cell--action"></div>' : ''}
          </div>
          ${dataRows}
        </div>
      </div>
    `;

    // Tint filter buttons for columns that have an active filter
    this._colFilters?.forEach((_, field) => {
      const btn = this.shadowRoot.querySelector(`[data-filter-btn="${field}"]`);
      if (btn) btn.setAttribute('data-active', '');
    });

    if (this.getAttribute('height') === 'fill') {
      this.style.flex         = '1';
      this.style.minHeight    = '0';
      this.style.overflow     = 'hidden';
      this.style.marginBottom = '20px';
      const wrap = this.shadowRoot.querySelector('.grid-wrap');
      if (wrap) { wrap.style.flex = '1'; wrap.style.minHeight = '0'; wrap.style.overflow = 'hidden'; }
      const body = this.shadowRoot.querySelector('#grid-body');
      if (body) { body.style.flex = '1'; body.style.minHeight = '0'; body.style.overflowY = 'auto'; }
    }

    this.shadowRoot.querySelector('.titlebar__more')?.setItems([
      { label: 'Column selection',     value: 'col-select' },
      { label: 'Export to CSV',        value: 'export-csv' },
      { label: 'Export to Excel',      value: 'export-excel' },
      { label: 'Fit to grid size',     value: 'fit-grid' },
      { label: 'Fit to content size',  value: 'fit-content' },
      { label: 'Data entry direction', value: 'data-direction' },
      { label: 'No. of items in list', value: 'items-count' },
    ]);

    this._attachEvents();
  }

  _attachEvents() {
    const sr = this.shadowRoot;

    // Select-all checkbox
    sr.getElementById('check-all')?.addEventListener('labos-change', e => {
      const checked = e.detail.checked;
      this._rows.forEach((_, i) => checked ? this._selected.add(i) : this._selected.delete(i));
      this._updateRows();
      this._emitSelectionChange();
    });

    // Row checkboxes
    sr.querySelectorAll('.row-cb').forEach(cb => {
      cb.addEventListener('labos-change', e => {
        e.stopPropagation();
        const ri = +cb.dataset.row;
        e.detail.checked ? this._selected.add(ri) : this._selected.delete(ri);
        this._updateRow(ri);
        this._syncSelectAll();
        this._emitSelectionChange();
      });
    });

    // Row click — focus clicked cell only (selection via checkbox)
    sr.querySelectorAll('.grid-row').forEach(row => {
      row.addEventListener('click', e => {
        if (e.target.closest && e.target.closest('labos-checkbox')) return;
        if (e.target.closest && e.target.closest('.row-action')) return;
        const ri   = +row.dataset.row;
        const cell = e.target.closest('.grid-cell[data-col]');
        const ci   = cell ? +cell.dataset.col : 0;
        this._setFocusedCell(ri, ci);
        sr.getElementById('grid-body')?.focus({ preventScroll: true });
      });
    });

    // Keyboard navigation
    sr.getElementById('grid-body')?.addEventListener('keydown', e => {
      const arrows = ['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight'];
      if (!arrows.includes(e.key) && e.key !== ' ') return;
      e.preventDefault();
      const total = this._rows.length;
      if (total === 0) return;

      // Space → toggle selection on the focused row
      if (e.key === ' ' && this._focusedCell) {
        const ri = this._focusedCell.ri;
        this._selected.has(ri) ? this._selected.delete(ri) : this._selected.add(ri);
        this._updateRow(ri);
        this._emitSelectionChange();
        return;
      }

      // Shift + Up/Down → multi-select rows based on focused cell row
      if (e.shiftKey && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
        const cur  = this._focusedCell ? this._focusedCell.ri : 0;
        const next = e.key === 'ArrowDown' ? Math.min(cur + 1, total - 1) : Math.max(cur - 1, 0);
        if (this._anchorIdx < 0) this._anchorIdx = cur;
        this._extendSelection(next);
        if (this._focusedCell) this._setFocusedCell(next, this._focusedCell.ci);
        return;
      }

      // Plain arrows → move cell focus
      if (this._focusedCell) {
        let { ri, ci } = this._focusedCell;
        if (e.key === 'ArrowDown')  ri = Math.min(ri + 1, total - 1);
        if (e.key === 'ArrowUp')    ri = Math.max(ri - 1, 0);
        if (e.key === 'ArrowRight') ci = Math.min(ci + 1, this._activeCols.length - 1);
        if (e.key === 'ArrowLeft')  ci = Math.max(ci - 1, 0);
        this._setFocusedCell(ri, ci);
      }
    });

    // Row expand (more_horiz) — toggle expand panel (multiple rows can be open)
    sr.querySelectorAll('.row-action').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const ri = +btn.dataset.row;
        const isExpanded = this._expandedRows.has(ri);

        if (isExpanded) {
          this._expandedRows.delete(ri);
          sr.querySelector(`.grid-row[data-row="${ri}"]`)?.classList.remove('row-expanded');
          sr.querySelector(`.row-expand-panel[data-panel="${ri}"]`)?.classList.remove('open');
        } else {
          this._expandedRows.add(ri);
          sr.querySelector(`.grid-row[data-row="${ri}"]`)?.classList.add('row-expanded');
          const panel = sr.querySelector(`.row-expand-panel[data-panel="${ri}"]`);
          if (panel) {
            panel.classList.add('open');
            this.dispatchEvent(new CustomEvent('labos-row-expand', {
              detail: { index: ri, row: this._rows[ri], panel },
              bubbles: true, composed: true,
            }));
          }
        }
      });
    });

    // Titlebar chip-btn toggle
    sr.querySelector('.titlebar__chip-btn')?.addEventListener('click', e => {
      const btn = e.currentTarget;
      btn.toggleAttribute('selected');
    });

    // Titlebar menu actions
    sr.querySelector('.titlebar__more')?.addEventListener('labos-select', e => {
      if (e.detail.value === 'col-select') this._openColSelect();
    });

    // Column resize
    sr.querySelectorAll('.col-resize-handle').forEach(handle => {
      handle.addEventListener('mousedown', e => {
        e.preventDefault();
        const ci = +handle.dataset.col;
        if (!this._colWidths) this._initColWidths();
        const startX     = e.clientX;
        const startLeft  = this._colWidths[ci];
        const startRight = this._colWidths[ci + 1];
        const MIN        = 60;

        let _dragged = false;
        const onMove = ev => {
          _dragged = true;
          const dx      = ev.clientX - startX;
          const clampDx = Math.min(startLeft - MIN, Math.max(-(startRight - MIN), dx));
          this._colWidths[ci]     = startLeft  + clampDx;
          this._colWidths[ci + 1] = startRight - clampDx;
          this._applyColWidths();
        };
        const onUp = () => {
          document.removeEventListener('mousemove', onMove);
          document.removeEventListener('mouseup', onUp);
          if (_dragged) {
            this._resizeDragged = true;
            setTimeout(() => { this._resizeDragged = false; }, 0);
          }
        };
        document.addEventListener('mousemove', onMove);
        document.addEventListener('mouseup', onUp);
      });
    });

    // Sort header click
    sr.querySelectorAll('.grid-header-cell--sortable').forEach(cell => {
      cell.addEventListener('click', e => {
        if (this._resizeDragged) return;
        if (e.target.closest('.btn-icon')) return;
        const field = cell.dataset.sortField;
        if (!field) return;
        if (this._sortField !== field) {
          this._sortField = field;
          this._sortDir   = 'asc';
        } else if (this._sortDir === 'asc') {
          this._sortDir = 'desc';
        } else {
          this._sortField = null;
          this._sortDir   = null;
        }
        const filteredBase = this._colFilters.size === 0
          ? this._originalRows
          : this._originalRows.filter(row =>
              [...this._colFilters.entries()].every(([f, allowed]) =>
                !allowed || allowed.has(String(row[f] ?? ''))
              )
            );
        this._rows = this._applySort(filteredBase);
        this._selected.clear();
        this._render();
        this.dispatchEvent(new CustomEvent('labos-sort', {
          detail: { field: this._sortField, direction: this._sortDir },
          bubbles: true, composed: true,
        }));
      });
    });

    // Filter icon click
    sr.querySelectorAll('[data-filter-btn]').forEach(btn => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        this._openFilterPopover(btn.dataset.filterBtn, btn);
      });
    });

    // Cell overflow tooltip (bind once via delegation)
    if (!this._tipReady) {
      this._tipReady = true;
      const tip = _getGridTip();
      sr.addEventListener('mouseover', e => {
        const cell = e.composedPath().find(n => n.dataset?.tip !== undefined);
        tip.style.display = 'none';
        if (!cell) return;
        const inner = cell.querySelector('.grid-cell__inner');
        if (!inner || inner.scrollWidth <= inner.clientWidth) return;
        tip.textContent   = cell.dataset.tip;
        tip.style.display = 'block';
        const rect = cell.getBoundingClientRect();
        const x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
        const y = rect.top - tip.offsetHeight - 6;
        tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
        tip.style.top  = Math.max(4, y) + 'px';
      });
      sr.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
    }

    this._attachDragEvents();
  }

  _attachDragEvents() {
    if (!this._canDrag) return;
    const sr = this.shadowRoot;

    sr.querySelectorAll('.row-drag-handle').forEach(handle => {
      handle.addEventListener('pointerdown', e => {
        if (e.button !== 0) return;
        e.preventDefault();
        e.stopPropagation();

        const ri = +handle.dataset.dragRow;
        this._dragWasSelected = this._selected.has(ri);
        this._dragRows     = this._dragWasSelected ? new Set(this._selected) : new Set([ri]);
        this._dragSrcIdx   = ri;
        this._pendingOrder = this._rows.map((_, i) => i);
        this._lastDragY    = e.clientY;

        const srcRow = sr.querySelector(`.grid-row[data-row="${ri}"]`);
        const rect   = srcRow.getBoundingClientRect();
        this._dragOffsetX = e.clientX - rect.left;
        this._dragOffsetY = e.clientY - rect.top;
        this._dragRowH    = rect.height;

        const clone = srcRow.cloneNode(true);
        Object.assign(clone.style, {
          position:      'fixed',
          left:          rect.left + 'px',
          top:           rect.top  + 'px',
          width:         rect.width + 'px',
          pointerEvents: 'none',
          zIndex:        '9999',
          background:    '#fff',
          boxShadow:     '0 4px 4px 0 rgba(0,0,0,.25)',
          opacity:       '1',
          transition:    'none',
          margin:        '0',
        });
        sr.appendChild(clone);
        this._dragClone = clone;

        requestAnimationFrame(() => {
          sr.querySelectorAll('.grid-row').forEach(r => {
            r.style.transition = 'transform 200ms ease';
            if (r !== this._dragClone && this._dragRows.has(+r.dataset.row)) r.classList.add('row-dragging');
          });
        });

        handle.setPointerCapture(e.pointerId);

        const onMove = ev => this._handleDragMove(ev);
        const onEnd  = ev => {
          handle.removeEventListener('pointermove', onMove);
          handle.removeEventListener('pointerup',   onEnd);
          handle.removeEventListener('pointercancel', onEnd);
          this._handleDragEnd();
        };
        handle.addEventListener('pointermove', onMove);
        handle.addEventListener('pointerup',   onEnd);
        handle.addEventListener('pointercancel', onEnd);
      });
    });
  }

  _handleDragMove(e) {
    if (!this._dragClone) return;
    const sr = this.shadowRoot;

    const cloneTop = e.clientY - this._dragOffsetY;
    this._dragClone.style.top  = cloneTop + 'px';
    this._dragClone.style.left = (e.clientX - this._dragOffsetX) + 'px';

    const movingDown = e.clientY >= this._lastDragY;
    this._lastDragY  = e.clientY;
    const cloneMidY  = cloneTop + this._dragRowH / 2;

    const allRowEls  = [...sr.querySelectorAll('.grid-row')];
    const nonDragged = allRowEls
      .filter(r => !this._dragRows.has(+r.dataset.row))
      .map(r => ({ idx: +r.dataset.row, rect: r.getBoundingClientRect() }))
      .sort((a, b) => a.rect.top - b.rect.top);

    let insertBefore = nonDragged.length;
    for (let i = 0; i < nonDragged.length; i++) {
      const r   = nonDragged[i];
      const thr = movingDown
        ? r.rect.top + r.rect.height * 0.8
        : r.rect.top + r.rect.height * 0.2;
      if (cloneMidY < thr) { insertBefore = i; break; }
    }

    const draggedSorted = [...this._dragRows].sort((a, b) => a - b);
    const newOrder = nonDragged.map(r => r.idx);
    newOrder.splice(insertBefore, 0, ...draggedSorted);

    if (newOrder.join() !== this._pendingOrder.join()) {
      this._pendingOrder = newOrder;
      allRowEls.forEach(rowEl => {
        const domPos    = +rowEl.dataset.row;
        const visualPos = this._pendingOrder.indexOf(domPos);
        rowEl.style.transform = `translateY(${(visualPos - domPos) * this._dragRowH}px)`;
      });
    }
  }

  _handleDragEnd() {
    const sr = this.shadowRoot;

    if (this._dragClone) { this._dragClone.remove(); this._dragClone = null; }

    sr.querySelectorAll('.grid-row').forEach(r => {
      r.style.transition = '';
      r.style.transform  = '';
      r.classList.remove('row-dragging');
    });

    const draggedIndices = [...this._dragRows].sort((a, b) => a - b);
    if (!draggedIndices.length || !this._pendingOrder.length) {
      this._dragRows = new Set(); this._dragSrcIdx = -1;
      return;
    }

    const oldRows = [...this._rows];
    const newRows = this._pendingOrder.map(i => oldRows[i]);
    const at      = this._pendingOrder.indexOf(draggedIndices[0]);

    const newSel = new Set();
    [...this._selected].forEach(si => {
      const ni = this._pendingOrder.indexOf(si);
      if (ni !== -1) newSel.add(ni);
    });
    // If the dragged row was originally unselected, ensure it stays unselected
    if (!this._dragWasSelected) {
      draggedIndices.forEach(si => {
        const ni = this._pendingOrder.indexOf(si);
        if (ni !== -1) newSel.delete(ni);
      });
    }

    this._rows         = newRows;
    this._originalRows = newRows;
    this._selected     = newSel;
    this._dragRows     = new Set();
    this._dragSrcIdx   = -1;
    this._dragOverIdx  = -1;
    this._pendingOrder = [];
    this._render();
    this.dispatchEvent(new CustomEvent('labos-row-order-change', {
      detail: { rows: this._rows, movedIndices: draggedIndices, toIndex: at },
      bubbles: true, composed: true,
    }));
  }

  _updateRow(ri) {
    const row = this.shadowRoot?.querySelector(`.grid-row[data-row="${ri}"]`);
    if (row) {
      const sel = this._selected.has(ri);
      row.classList.toggle('selected', sel);
      row.classList.toggle('inactive', !!this._rows[ri]?.inactive);
      row.classList.toggle('em-active', !!this._rows[ri]?._emActive);
      const cb = row.querySelector('.row-cb');
      if (cb) cb.checked = sel;
    }
  }

  _updateRows() {
    this.shadowRoot?.querySelectorAll('.grid-row').forEach(row => {
      const ri = +row.dataset.row;
      row.classList.toggle('selected', this._selected.has(ri));
      row.classList.toggle('inactive', !!this._rows[ri]?.inactive);
      row.classList.toggle('em-active', !!this._rows[ri]?._emActive);
      const cb = row.querySelector('.row-cb');
      if (cb) cb.checked = this._selected.has(ri);
    });
  }

  _syncSelectAll() {
    const ca = this.shadowRoot?.getElementById('check-all');
    if (!ca) return;
    const total = this._rows.length;
    const sel   = this._selected.size;
    if (sel === 0) {
      ca.removeAttribute('checked');
      ca.removeAttribute('indeterminate');
    } else if (sel === total) {
      ca.setAttribute('checked', '');
      ca.removeAttribute('indeterminate');
    } else {
      ca.removeAttribute('checked');
      ca.setAttribute('indeterminate', '');
    }
  }

  _moveFocus(idx) {
    if (idx < 0 || idx >= this._rows.length) return;
    this._selected.clear();
    this._selected.add(idx);
    this._focusedIdx = idx;
    this._anchorIdx  = idx;
    this._updateRows();
    this._syncSelectAll();
    this._emitSelectionChange();
    this._scrollToRow(idx);
  }

  _extendSelection(idx) {
    if (idx < 0 || idx >= this._rows.length) return;
    this._focusedIdx = idx;
    const from = Math.min(this._anchorIdx, idx);
    const to   = Math.max(this._anchorIdx, idx);
    this._selected.clear();
    for (let i = from; i <= to; i++) this._selected.add(i);
    this._updateRows();
    this._syncSelectAll();
    this._emitSelectionChange();
    this._scrollToRow(idx);
  }

  _initColWidths() {
    const cells = this.shadowRoot.querySelectorAll('.grid-header-cell');
    this._colWidths = this._activeCols.map((_, ci) =>
      cells[ci + 1]?.getBoundingClientRect().width ?? 150
    );
  }

  _applyColWidths() {
    const tpl = this._colTemplate();
    const sr  = this.shadowRoot;
    if (sr?.querySelector('.grid-header'))
      sr.querySelector('.grid-header').style.gridTemplateColumns = tpl;
    sr?.querySelectorAll('.grid-row').forEach(r => r.style.gridTemplateColumns = tpl);
  }

  _setFocusedCell(ri, ci) {
    this.shadowRoot?.querySelector('.grid-cell.cell-focused')
      ?.classList.remove('cell-focused');
    if (ri < 0 || ri >= this._rows.length || ci < 0 || ci >= this._activeCols.length) return;
    this._focusedCell = { ri, ci };
    this.shadowRoot
      ?.querySelector(`.grid-row[data-row="${ri}"] .grid-cell[data-col="${ci}"]`)
      ?.classList.add('cell-focused');
    this._scrollToRow(ri);
  }

  _scrollToRow(idx) {
    this.shadowRoot?.querySelector(`.grid-row[data-row="${idx}"]`)
      ?.scrollIntoView({ block: 'nearest' });
  }

  _openColSelect() {
    const dlg = document.createElement('labos-dialog');
    dlg.setAttribute('title', 'Column selection');

    const checkState = new Map(
      this._columns.map((_, i) => [i, this._visibleCols === null || this._visibleCols.has(i)])
    );

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;padding:4px 0;';

    this._columns.forEach((col, i) => {
      const cb = document.createElement('labos-checkbox');
      cb.setAttribute('label', col.label);
      if (checkState.get(i)) cb.setAttribute('checked', '');
      cb.addEventListener('labos-change', e => checkState.set(i, e.detail.checked));
      wrap.appendChild(cb);
    });

    dlg.appendChild(wrap);

    const cancelBtn = document.createElement('labos-button');
    cancelBtn.setAttribute('slot', 'footer');
    cancelBtn.setAttribute('variant', 'default');
    cancelBtn.setAttribute('cancel', '');
    cancelBtn.setAttribute('icon', 'close');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => dlg.hide());
    dlg.appendChild(cancelBtn);

    const okBtn = document.createElement('labos-button');
    okBtn.setAttribute('slot', 'footer');
    okBtn.setAttribute('variant', 'accent');
    okBtn.setAttribute('icon', 'check');
    okBtn.textContent = 'OK';
    okBtn.addEventListener('click', () => {
      const newVisible = new Set(
        [...checkState.entries()].filter(([, v]) => v).map(([k]) => k)
      );
      this._visibleCols = newVisible.size === this._columns.length ? null : newVisible;
      this._colWidths   = null;
      this._focusedCell = null;
      this._render();
      dlg.hide();
    });
    dlg.appendChild(okBtn);

    document.body.appendChild(dlg);
    dlg.show();
    dlg.addEventListener('labos-close', () => document.body.removeChild(dlg), { once: true });
  }


  // ── Column filter popover ─────────────────────────────────────────────────
  _openFilterPopover(field, triggerBtn) {
    // Toggle: clicking same button while open → close
    if (this._filterPopover && this._filterField === field) {
      this._filterPopover.hide();
      return;
    }
    // Close any other open filter popover
    if (this._filterPopover) {
      this._filterPopover.hide();
    }
    this._filterField = field;

    // Boolean (icon-only) columns get a fixed Yes/No filter
    const col = this._columns?.find(c => c.field === field);
    if (col?.type === 'icon-only') {
      this._openBoolFilterPopover(field, triggerBtn);
      return;
    }

    // Unique sorted values for this column
    const uniqueVals = [...new Set(
      this._originalRows.map(r => String(r[field] ?? '')).filter(v => v !== '')
    )].sort((a, b) => a.localeCompare(b));

    const currentFilter = this._colFilters.get(field) ?? null;
    let searchQuery = '';

    // ── Popover shell ──────────────────────────────────────────────────────
    const pop = document.createElement('labos-popover');
    pop.setAttribute('size', 'small');

    // ── Content wrapper ────────────────────────────────────────────────────
    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;min-width:0;';

    // Search field
    const search = document.createElement('labos-rounded-search');
    search.setAttribute('mode', 'filter');
    search.setAttribute('placeholder', 'Search');
    search.style.cssText = 'display:block;margin-bottom:10px;';
    wrap.appendChild(search);

    // Checkbox list
    const list = document.createElement('div');
    list.style.cssText = 'max-height:240px;overflow-y:auto;display:flex;flex-direction:column;padding:2px 10px;margin-left:-10px;margin-right:-10px;';
    wrap.appendChild(list);

    // Select-all row
    const selectAllCb = document.createElement('labos-checkbox');
    selectAllCb.setAttribute('label', '(Select all)');
    selectAllCb.style.cssText = '';
    const selectAllRow = document.createElement('div');
    selectAllRow.style.cssText = 'height:30px;display:flex;align-items:center;';
    selectAllRow.appendChild(selectAllCb);
    list.appendChild(selectAllRow);

    // Per-value state map
    const cbState = new Map();    // val → boolean
    const cbEls   = new Map();    // val → { cb, row }

    uniqueVals.forEach(val => {
      cbState.set(val, currentFilter === null || currentFilter.has(val));
      const row = document.createElement('div');
      row.style.cssText = 'height:30px;display:flex;align-items:center;';
      row.dataset.fval  = val;
      const cb = document.createElement('labos-checkbox');
      cb.setAttribute('label', val);
      if (cbState.get(val)) cb.setAttribute('checked', '');
      row.appendChild(cb);
      list.appendChild(row);
      cbEls.set(val, { cb, row });
    });

    // Footer
    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:12px;';
    const resetBtn = document.createElement('labos-button');
    resetBtn.setAttribute('variant', 'default');
    resetBtn.setAttribute('borderless', '');
    resetBtn.setAttribute('icon', 'replay');
    resetBtn.textContent = 'Reset';
    const applyBtn = document.createElement('labos-button');
    applyBtn.setAttribute('variant', 'accent');
    applyBtn.setAttribute('icon', 'check');
    applyBtn.textContent = 'Apply';
    footer.appendChild(resetBtn);
    footer.appendChild(applyBtn);
    wrap.appendChild(footer);
    pop.appendChild(wrap);
    document.body.appendChild(pop);

    // ── Helpers ────────────────────────────────────────────────────────────
    const syncSelectAll = () => {
      const visible = uniqueVals.filter(v => cbEls.get(v).row.style.display !== 'none');
      const allOn   = visible.length > 0 && visible.every(v => cbState.get(v));
      const noneOn  = visible.every(v => !cbState.get(v));
      if (allOn) {
        selectAllCb.setAttribute('checked', '');
        selectAllCb.removeAttribute('indeterminate');
      } else if (noneOn) {
        selectAllCb.removeAttribute('checked');
        selectAllCb.removeAttribute('indeterminate');
      } else {
        selectAllCb.removeAttribute('checked');
        selectAllCb.setAttribute('indeterminate', '');
      }
    };

    // Set initial select-all state
    syncSelectAll();

    // ── Events ─────────────────────────────────────────────────────────────
    search.addEventListener('labos-input', e => {
      searchQuery = e.detail.value.toLowerCase().trim();
      cbEls.forEach(({ row }, val) => {
        row.style.display = (!searchQuery || val.toLowerCase().includes(searchQuery)) ? '' : 'none';
      });
      syncSelectAll();
    });

    cbEls.forEach(({ cb }, val) => {
      cb.addEventListener('labos-change', e => {
        cbState.set(val, e.detail.checked);
        syncSelectAll();
      });
    });

    selectAllCb.addEventListener('labos-change', e => {
      const checked = e.detail.checked;
      cbEls.forEach(({ cb, row }, val) => {
        if (row.style.display !== 'none') {
          cbState.set(val, checked);
          if (checked) cb.setAttribute('checked', '');
          else         cb.removeAttribute('checked');
        }
      });
    });

    resetBtn.addEventListener('click', () => {
      cbState.forEach((_, v) => cbState.set(v, true));
      cbEls.forEach(({ cb }) => { cb.setAttribute('checked', ''); });
      search.shadowRoot?.querySelector('.pill-input') && (search.shadowRoot.querySelector('.pill-input').value = '');
      cbEls.forEach(({ row }) => { row.style.display = ''; });
      searchQuery = '';
      syncSelectAll();
    });

    applyBtn.addEventListener('click', () => {
      const allOn = [...cbState.values()].every(v => v);
      if (allOn) {
        this._colFilters.delete(field);
      } else {
        this._colFilters.set(field, new Set([...cbState.entries()].filter(([, v]) => v).map(([k]) => k)));
      }
      this._applyFiltersAndRender();
      pop.hide();
    });

    pop.addEventListener('labos-close', () => {
      pop.remove();
      if (this._filterField === field) {
        this._filterField   = null;
        this._filterPopover = null;
      }
    }, { once: true });

    this._filterPopover = pop;
    pop.show(triggerBtn);
  }

  _openBoolFilterPopover(field, triggerBtn) {
    const currentFilter = this._colFilters.get(field) ?? null;

    const pop = document.createElement('labos-popover');
    pop.setAttribute('size', 'small');

    const wrap = document.createElement('div');
    wrap.style.cssText = 'display:flex;flex-direction:column;min-width:0;';

    const list = document.createElement('div');
    list.style.cssText = 'display:flex;flex-direction:column;padding:2px 10px;margin-left:-10px;margin-right:-10px;';
    wrap.appendChild(list);

    const cbState = new Map([
      ['yes', currentFilter === null || currentFilter.has('yes')],
      ['no',  currentFilter === null || currentFilter.has('no')],
    ]);

    const selectAllCb = document.createElement('labos-checkbox');
    selectAllCb.setAttribute('label', 'Select all');
    const selectAllRow = document.createElement('div');
    selectAllRow.style.cssText = 'height:30px;display:flex;align-items:center;';
    selectAllRow.appendChild(selectAllCb);
    list.appendChild(selectAllRow);

    const syncSelectAll = () => {
      const allOn  = [...cbState.values()].every(v => v);
      const noneOn = [...cbState.values()].every(v => !v);
      if (allOn)       { selectAllCb.setAttribute('checked', '');    selectAllCb.removeAttribute('indeterminate'); }
      else if (noneOn) { selectAllCb.removeAttribute('checked');     selectAllCb.removeAttribute('indeterminate'); }
      else             { selectAllCb.removeAttribute('checked');     selectAllCb.setAttribute('indeterminate', ''); }
    };

    const cbEls = new Map();
    [['yes', 'Yes'], ['no', 'No']].forEach(([val, lbl]) => {
      const row = document.createElement('div');
      row.style.cssText = 'height:30px;display:flex;align-items:center;';
      const cb = document.createElement('labos-checkbox');
      cb.setAttribute('label', lbl);
      if (cbState.get(val)) cb.setAttribute('checked', '');
      cb.addEventListener('labos-change', e => { cbState.set(val, e.detail.checked); syncSelectAll(); });
      row.appendChild(cb);
      list.appendChild(row);
      cbEls.set(val, cb);
    });

    syncSelectAll();

    selectAllCb.addEventListener('labos-change', e => {
      cbEls.forEach((cb, val) => {
        cbState.set(val, e.detail.checked);
        if (e.detail.checked) cb.setAttribute('checked', '');
        else                  cb.removeAttribute('checked');
      });
    });

    const footer = document.createElement('div');
    footer.style.cssText = 'display:flex;justify-content:flex-end;align-items:center;gap:8px;margin-top:12px;';
    const resetBtn = document.createElement('labos-button');
    resetBtn.setAttribute('variant', 'default');
    resetBtn.setAttribute('borderless', '');
    resetBtn.setAttribute('icon', 'replay');
    resetBtn.textContent = 'Reset';
    const applyBtn = document.createElement('labos-button');
    applyBtn.setAttribute('variant', 'accent');
    applyBtn.setAttribute('icon', 'check');
    applyBtn.textContent = 'Apply';
    footer.appendChild(resetBtn);
    footer.appendChild(applyBtn);
    wrap.appendChild(footer);
    pop.appendChild(wrap);
    document.body.appendChild(pop);

    resetBtn.addEventListener('click', () => {
      cbState.set('yes', true); cbState.set('no', true);
      cbEls.forEach(cb => cb.setAttribute('checked', ''));
      syncSelectAll();
    });

    applyBtn.addEventListener('click', () => {
      const allOn = [...cbState.values()].every(v => v);
      if (allOn) {
        this._colFilters.delete(field);
      } else {
        this._colFilters.set(field, new Set([...cbState.entries()].filter(([, v]) => v).map(([k]) => k)));
      }
      this._applyFiltersAndRender();
      pop.hide();
    });

    pop.addEventListener('labos-close', () => {
      pop.remove();
      if (this._filterField === field) { this._filterField = null; this._filterPopover = null; }
    }, { once: true });

    this._filterPopover = pop;
    pop.show(triggerBtn);
  }

  _applyFiltersAndRender() {
    const base = this._colFilters.size === 0
      ? this._originalRows
      : this._originalRows.filter(row =>
          [...this._colFilters.entries()].every(([field, allowed]) => {
            if (!allowed) return true;
            const c = this._columns?.find(col => col.field === field);
            const val = c?.type === 'icon-only' ? (row[field] ? 'yes' : 'no') : String(row[field] ?? '');
            return allowed.has(val);
          })
        );
    this._rows = this._applySort(base);
    this._selected.clear();
    this._focusedIdx  = -1;
    this._focusedCell = null;
    this._render();
    this._emitSelectionChange();
  }

  _emitSelectionChange() {
    this.dispatchEvent(new CustomEvent('labos-selection-change', {
      detail: { selected: this.selectedRows, indices: [...this._selected] },
      bubbles: true, composed: true,
    }));
  }
}
customElements.define('labos-grid', LabosGrid);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-DIALOG
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   title   — header text
//   size    — "default" (520px) | "medium" (660px) | "large" (880px) | "xl" (1140px)
//   open    — boolean presence attribute; add to show, remove to hide
//
// Slots:
//   (default)   — dialog body content
//   footer      — action buttons row
//
// Methods:
//   show()      — adds the `open` attribute
//   hide()      — removes `open` and dispatches `labos-close`
//
// Events:
//   labos-close — fired when the dialog closes (close btn, backdrop, Escape)
// ─────────────────────────────────────────────────────────────────────────────
const DIALOG_CSS = `
  ${HOST_BOX}
  :host { display: contents; }

  .overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 1000;
    align-items: center; justify-content: center;
  }
  :host([open]) .overlay { display: flex; }

  .dialog {
    display: flex; flex-direction: column;
    border-radius: 4px; overflow: hidden;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.25);
    background: var(--white);
    width: 520px; max-width: 95vw;
  }
  :host([size="medium"]) .dialog { width: 660px; }
  :host([size="large"])  .dialog { width: 880px; }
  :host([size="xl"])     .dialog { width: 1140px; }
  :host([size="xl"])     .dialog__body { padding: 30px; max-height: 80vh; overflow: hidden; display: flex; flex-direction: column; }

  :host([fixed-height]) .dialog      { height: 80vh; }
  :host([fixed-height]) .dialog__body { flex: 1; max-height: none; overflow-y: auto; display: flex; flex-direction: column; min-height: 0; }

  :host([fullscreen]) .dialog       { height: 92vh; width: 95vw; max-width: 95vw; }
  :host([fullscreen]) .dialog__body { flex: 1; max-height: none; overflow-y: auto; display: flex; flex-direction: column; min-height: 0; }

  .dialog__header {
    display: flex; align-items: center; justify-content: space-between;
    background: #aaaaaa; padding: 9px 12px; height: 40px; flex-shrink: 0;
    border-radius: 4px 4px 0 0;
    cursor: move;
  }
  .dialog__header-end { display: flex; align-items: center; gap: 12px; }
  .dialog__title {
    font-family: var(--font); font-size: 16px; font-weight: 600; color: var(--white);
  }
  .dialog__close, .dialog__expand {
    display: flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; background: none; border: none;
    cursor: pointer; color: var(--white); opacity: 0.85; padding: 0;
    transition: opacity 150ms ease;
    font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
  }
  .dialog__close:hover, .dialog__expand:hover { opacity: 1; }
  .dialog__expand { display: none; }
  :host([size="xl"]) .dialog__expand { display: flex; }
  .expand-icon--close { display: none; }
  :host([fullscreen]) .expand-icon--open  { display: none; }
  :host([fullscreen]) .expand-icon--close { display: inline; }

  .dialog__body {
    padding: 30px;
    font-family: var(--font); font-size: 14px; line-height: 1.6;
    overflow-y: auto; min-height: 80px; max-height: 60vh;
  }

  ::slotted(labos-grid) { margin-left: -30px; margin-right: -30px; }

  .dialog__footer {
    display: flex; justify-content: flex-end; align-items: center;
    gap: 10px; padding: 0 30px 30px; flex-shrink: 0;
  }

  .confirm-banner {
    display: none; align-items: center; gap: 16px;
    padding: 24px 30px 0; flex-shrink: 0;
  }
  :host([type="confirm"]) .confirm-banner { display: flex; }
  :host([type="warning"]) .confirm-banner { display: flex; }
  :host([type="warning"]) .confirm-banner__icon { color: #F99D20; }
  :host([type="warning"]) .confirm-banner__text { display: none; }
  .confirm-banner__icon {
    font-family: 'Material Icons'; font-style: normal; font-weight: normal;
    font-size: 48px; line-height: 1; color: #D20000; flex-shrink: 0;
  }
  .confirm-banner__text {
    font-family: var(--font); font-size: 30px; font-weight: 400;
    color: #D20000; line-height: 1.2;
  }
`;

class LabosDialog extends HTMLElement {
  static get observedAttributes() { return ['title', 'size', 'open', 'type']; }

  connectedCallback() {
    if (!this.shadowRoot) this._init();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown',     this._onKeydown);
    document.removeEventListener('pointermove', this._onDragMove);
    document.removeEventListener('pointerup',   this._onDragEnd);
  }

  attributeChangedCallback(name, _old, val) {
    if (!this.shadowRoot) return;
    if (name === 'title') {
      const el = this.shadowRoot.querySelector('.dialog__title');
      if (el) el.textContent = this.getAttribute('type') === 'warning' ? 'Alert' : (val || '');
    }
    // 'open' and 'size' are handled purely by :host([open]) / :host([size=...]) CSS
  }

  show() {
    this.setAttribute('open', '');
    if (this.getAttribute('type') === 'confirm') {
      requestAnimationFrame(() => {
        const cancelBtn = this.querySelector('labos-button[cancel]');
        cancelBtn?.shadowRoot?.querySelector('button')?.focus();
      });
    }
    if (this.getAttribute('type') === 'warning') {
      requestAnimationFrame(() => {
        const okBtn = this.querySelector('labos-button:not([cancel])');
        okBtn?.shadowRoot?.querySelector('button')?.focus();
      });
    }
  }

  hide() {
    this.removeAttribute('open');
    this.removeAttribute('fullscreen');
    const dlg = this.shadowRoot?.querySelector('.dialog');
    if (dlg) { dlg.style.position = ''; dlg.style.left = ''; dlg.style.top = ''; dlg.style.margin = ''; }
    this.dispatchEvent(new CustomEvent('labos-close', { bubbles: true, composed: true }));
  }

  _init() {
    this.attachShadow({ mode: 'open' });
    // Auto-close on cancel button
    this.addEventListener('click', e => {
      const cancelBtn = e.composedPath().find(el => el.tagName === 'LABOS-BUTTON' && el.hasAttribute('cancel'));
      if (cancelBtn) this.hide();
    });
    // Validate mandatory fields before any footer confirm button (capture phase — fires before page handlers)
    this.addEventListener('click', e => {
      const path = e.composedPath();
      const confirmBtn = path.find(el => el.tagName === 'LABOS-BUTTON' && el.getAttribute('slot') === 'footer' && !el.hasAttribute('cancel'));
      if (!confirmBtn) return;
      const mandatory = [...this.querySelectorAll('[mandatory]')].filter(f => window.getComputedStyle(f).display !== 'none');
      const empty = mandatory.filter(f => !f.hasAttribute('data-has-items') && !(f.value || '').trim());
      mandatory.filter(f => (f.value || '').trim()).forEach(f => f.removeAttribute('invalid'));
      if (empty.length) {
        empty.forEach(f => f.setAttribute('invalid', ''));
        e.stopImmediatePropagation();
        empty[0].focus?.();
      }
    }, true);
    const title = this.getAttribute('title') || '';
    const _type = this.getAttribute('type') || '';
    const _effectiveTitle = _type === 'warning' ? 'Alert' : title;
    const _bannerText = 'Action confirmation';
    this.shadowRoot.innerHTML = `
      <style>${DIALOG_CSS}</style>
      <div class="overlay" part="overlay">
        <div class="dialog" part="dialog">
          <div class="dialog__header">
            <span class="dialog__title">${_effectiveTitle}</span>
            <div class="dialog__header-end">
              <button class="dialog__expand" aria-label="Toggle fullscreen">
                <span class="expand-icon expand-icon--open">open_in_full</span>
                <span class="expand-icon expand-icon--close">close_fullscreen</span>
              </button>
              <button class="dialog__close" aria-label="Close">close</button>
            </div>
          </div>
          <div class="confirm-banner">
            <span class="confirm-banner__icon">warning</span>
            <span class="confirm-banner__text">${_bannerText}</span>
          </div>
          <div class="dialog__body"><slot></slot></div>
          <div class="dialog__footer"><slot name="footer"></slot></div>
        </div>
      </div>
    `;

    this.shadowRoot.querySelector('.dialog__close')
      .addEventListener('click', () => this.hide());

    this.shadowRoot.querySelector('.dialog__expand')
      .addEventListener('click', () => {
        this.hasAttribute('fullscreen')
          ? this.removeAttribute('fullscreen')
          : this.setAttribute('fullscreen', '');
      });

    // Clicking outside the dialog (on the overlay) does NOT close it.

    const FOCUSABLE = 'button,input,select,textarea,a[href],[tabindex]:not([tabindex="-1"])';
    this.shadowRoot.querySelector('.dialog')
      .addEventListener('mousedown', e => {
        const hit = e.composedPath().find(n => n.matches?.(FOCUSABLE));
        if (!hit) document.activeElement?.blur();
      });

    // ── Drag ────────────────────────────────────────────────────────────────
    const dragHandle = this.shadowRoot.querySelector('.dialog__header');
    const dragTarget = this.shadowRoot.querySelector('.dialog');
    let _drag = null;

    dragHandle.addEventListener('pointerdown', e => {
      if (e.composedPath().some(n => n.tagName === 'BUTTON')) return;
      const rect = dragTarget.getBoundingClientRect();
      _drag = { ox: e.clientX - rect.left, oy: e.clientY - rect.top };
      dragTarget.style.position = 'absolute';
      dragTarget.style.margin   = '0';
      dragTarget.style.left     = rect.left + 'px';
      dragTarget.style.top      = rect.top  + 'px';
      document.body.style.cursor     = 'move';
      document.body.style.userSelect = 'none';
      e.preventDefault();
    });

    this._onDragMove = e => {
      if (!_drag) return;
      const w = dragTarget.offsetWidth, h = dragTarget.offsetHeight;
      const l = Math.max(0, Math.min(e.clientX - _drag.ox, window.innerWidth  - w));
      const t = Math.max(0, Math.min(e.clientY - _drag.oy, window.innerHeight - h));
      dragTarget.style.left = l + 'px';
      dragTarget.style.top  = t + 'px';
    };

    this._onDragEnd = () => {
      if (!_drag) return;
      _drag = null;
      document.body.style.cursor     = '';
      document.body.style.userSelect = '';
    };

    document.addEventListener('pointermove', this._onDragMove);
    document.addEventListener('pointerup',   this._onDragEnd);
  }

  _onKeydown = (e) => {
    if (!this.hasAttribute('open')) return;
    if (e.key === 'Escape') { this.hide(); return; }
    if (e.key === 'Enter' && e.ctrlKey) {
      const accent = this.querySelector('labos-button[variant="accent"]');
      accent?.shadowRoot?.querySelector('button')?.click();
    }
  };
}
customElements.define('labos-dialog', LabosDialog);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-ALERT
// ═══════════════════════════════════════════════════════════════════════════════
//
// Generic validation / informational alert dialog.
// Fixed layout: warning icon + message. Single OK button.
//
// Usage:
//   <labos-alert id="my-alert"></labos-alert>
//
//   document.getElementById('my-alert').show('Please select at least one item');
//   document.getElementById('my-alert').show('Custom message', 'Warning');
//
// Attributes:
//   open    — boolean presence attribute (managed by show/hide)
//   type    — "warning" (default) | "info"  → changes icon & icon color
//
// Events:
//   labos-close — fired when alert closes
// ─────────────────────────────────────────────────────────────────────────────
const ALERT_CSS = `
  ${HOST_BOX}
  :host { display: contents; }

  .overlay {
    display: none;
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 1100;
    align-items: center; justify-content: center;
  }
  :host([open]) .overlay { display: flex; }

  .dialog {
    display: flex; flex-direction: column;
    border-radius: 4px; overflow: hidden;
    box-shadow: 0 4px 5px 0 rgba(0,0,0,0.25);
    background: var(--white);
    width: 520px; max-width: 95vw;
  }

  .header {
    display: flex; align-items: center; justify-content: space-between;
    background: #aaaaaa; padding: 9px 12px; height: 40px; flex-shrink: 0;
    border-radius: 4px 4px 0 0;
  }
  .header__title {
    font-family: var(--font); font-size: 16px; font-weight: 600; color: var(--white);
  }
  .header__close {
    display: flex; align-items: center; justify-content: center;
    width: 18px; height: 18px; background: none; border: none;
    cursor: pointer; color: var(--white); opacity: 0.85; padding: 0;
    transition: opacity 150ms ease;
    font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
  }
  .header__close:hover { opacity: 1; }

  .body {
    display: flex; flex-direction: column; align-items: flex-start;
    gap: 16px; padding: 30px; min-height: 80px;
  }
  .body__icon {
    font-family: 'Material Icons';
    font-size: 48px; font-style: normal; line-height: 1;
  }
  :host([type="info"])    .body__icon { color: #3367D1; }
  :host(:not([type])) .body__icon,
  :host([type="warning"]) .body__icon { color: var(--warning, #F99D20); }

  .body__message {
    font-family: var(--font); font-size: 14px; color: var(--black); line-height: 1.6;
  }

  .footer {
    display: flex; justify-content: flex-end; align-items: center;
    padding: 0 30px 30px;
  }
  .ok-btn {
    display: inline-flex; align-items: center; gap: 7px;
    height: 36px; padding: 0 12px;
    background: var(--white); border: 1px solid var(--primary-20); border-radius: var(--radius);
    font-family: var(--font); font-size: 14px; font-weight: 400;
    color: var(--primary); cursor: pointer;
    transition: var(--transition);
  }
  .ok-btn:hover { background: var(--surface); }
  .ok-btn:focus-visible, .ok-btn:focus, .ok-btn:active { outline: none; box-shadow: 0 0 7px 0 var(--primary-20); }
  .ok-icon {
    font-family: 'Material Icons'; font-size: 16px; font-style: normal; line-height: 1;
  }
`;

const ALERT_ICONS = { warning: 'warning', info: 'info' };

class LabosAlert extends HTMLElement {
  static get observedAttributes() { return ['type']; }

  connectedCallback() {
    if (!this.shadowRoot) this._init();
    document.addEventListener('keydown', this._onKeydown);
  }

  disconnectedCallback() {
    document.removeEventListener('keydown', this._onKeydown);
  }

  /** Show the alert. Optionally override message and title. */
  show(message = '', title = 'Alert') {
    if (!this.shadowRoot) this._init();
    this.shadowRoot.querySelector('.header__title').textContent = title;
    this.shadowRoot.querySelector('.body__message').textContent = message;
    this._updateIcon();
    this.setAttribute('open', '');
    requestAnimationFrame(() => this.shadowRoot?.querySelector('.ok-btn')?.focus());
  }

  hide() {
    this.removeAttribute('open');
    this.dispatchEvent(new CustomEvent('labos-close', { bubbles: true, composed: true }));
  }

  attributeChangedCallback(name) {
    if (name === 'type' && this.shadowRoot) this._updateIcon();
  }

  _updateIcon() {
    const type = this.getAttribute('type') || 'warning';
    const iconEl = this.shadowRoot?.querySelector('.body__icon');
    if (iconEl) iconEl.textContent = ALERT_ICONS[type] || 'warning';
  }

  _init() {
    this.attachShadow({ mode: 'open' });
    const type = this.getAttribute('type') || 'warning';
    this.shadowRoot.innerHTML = `
      <style>${ALERT_CSS}</style>
      <div class="overlay" part="overlay">
        <div class="dialog" part="dialog">
          <div class="header">
            <span class="header__title">Alert</span>
            <button class="header__close" aria-label="Close">close</button>
          </div>
          <div class="body">
            <span class="body__icon">${ALERT_ICONS[type] || 'warning'}</span>
            <span class="body__message"></span>
          </div>
          <div class="footer">
            <button class="ok-btn"><span class="ok-icon">check</span>OK</button>
          </div>
        </div>
      </div>
    `;
    this.shadowRoot.querySelector('.header__close').addEventListener('click', () => this.hide());
    this.shadowRoot.querySelector('.ok-btn').addEventListener('click', () => this.hide());
    // Clicking outside the dialog (on the overlay) does NOT close it.
  }

  _onKeydown = (e) => {
    if (e.key === 'Escape' && this.hasAttribute('open')) this.hide();
  };
}
customElements.define('labos-alert', LabosAlert);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosBadge  <labos-badge>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   label   — display text
//   bg      — background color (hex). Ignored when variant="empty".
//   variant — dark* | bright | empty
//             dark:   bg color, white text (#FFFFFF)
//             bright: bg color, dark text (#333333)
//             empty:  no fill, inset border (#CCCCCC), text #666666
// ───────────────────────────────────────────────────────────────────────────────
const BADGE_CSS = `
  ${HOST_BOX}
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    height: 20px;
    padding: 0 7px;
    border-radius: 3px;
    font-family: var(--font);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    box-sizing: border-box;
    letter-spacing: .1px;
  }
  :host([rounded]) { border-radius: 10px; }
`;

class LabosBadge extends HTMLElement {
  static get observedAttributes() { return ['label', 'bg', 'variant', 'rounded']; }
  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const label   = this.getAttribute('label') || '';
    const variant = this.getAttribute('variant') || 'dark';
    const bg      = this.getAttribute('bg') || '';

    this.style.padding = '0 7px';
    if (variant === 'empty') {
      this.style.background = '';
      this.style.color      = '#666666';
      this.style.boxShadow  = 'inset 0 0 0 1px #CCCCCC';
    } else {
      this.style.background = bg;
      this.style.color      = variant === 'bright' ? '#333333' : '#FFFFFF';
      this.style.boxShadow  = '';
    }

    this.shadowRoot.innerHTML = `<style>${BADGE_CSS}</style><span>${label}</span>`;
  }
}
customElements.define('labos-badge', LabosBadge);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosBadgeSelect  <labos-badge-select>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   label   — current display text
//   bg      — background color (hex). Ignored when variant="empty".
//   variant — dark* | bright | empty
//   rounded — boolean, border-radius 10px
// Methods:
//   setItems(items)  — [{ label, value }]
// Events:
//   labos-select  — { label, value }
// ───────────────────────────────────────────────────────────────────────────────
const BADGE_SELECT_CSS = `
  ${HOST_BOX}
  :host {
    display: inline-flex;
    align-items: center;
    height: 20px;
    padding: 0 2px 0 7px;
    border-radius: 3px;
    font-family: var(--font);
    font-size: 11px;
    font-weight: 600;
    white-space: nowrap;
    box-sizing: border-box;
    letter-spacing: .1px;
    cursor: pointer;
    gap: 2px;
    user-select: none;
  }
  :host([rounded]) { border-radius: 10px; }
  span { position: relative; top: -1px; }
  .chevron {
    font-family: 'Material Icons';
    font-size: 14px;
    font-style: normal;
    line-height: 1;
  }
`;

class LabosBadgeSelect extends HTMLElement {
  static get observedAttributes() { return ['label', 'bg', 'variant', 'rounded']; }

  constructor() {
    super();
    this._items   = [];
    this._wasOpen = false;
    this._dd      = new LabosDropdown({ minWidth: 0 });
  }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }

  setItems(items) {
    this._items = items;
    if (this._dd.isOpen) this._dd.refresh(items, item => this._onSelect(item));
  }

  _onSelect(item) {
    this.setAttribute('label', item.label);
    this._dd.close();
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: item, bubbles: true, composed: true,
    }));
  }

  _render() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.addEventListener('mousedown', () => { this._wasOpen = this._dd.isOpen; });
      this.addEventListener('click', () => {
        if (this._wasOpen) return;
        this._dd.open(this, this._items, item => this._onSelect(item));
      });
    }

    const label   = this.getAttribute('label') || '';
    const variant = this.getAttribute('variant') || 'dark';
    const bg      = this.getAttribute('bg') || '';

    this.style.padding = '0 2px 0 7px';
    if (variant === 'empty') {
      this.style.background = '';
      this.style.color      = '#666666';
      this.style.boxShadow  = 'inset 0 0 0 1px #CCCCCC';
    } else {
      this.style.background = bg;
      this.style.color      = variant === 'bright' ? '#333333' : '#FFFFFF';
      this.style.boxShadow  = '';
    }

    this.shadowRoot.innerHTML = `
      <style>${BADGE_SELECT_CSS}</style>
      <span>${label}</span>
      <span class="chevron">expand_more</span>`;
  }
}
customElements.define('labos-badge-select', LabosBadgeSelect);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-MASTER-LIST
// ═══════════════════════════════════════════════════════════════════════════════
//
// Vertical checkbox-selection list, 400px wide.
// Each row can have up to 3 text lines, a badge, and a date in the meta column.
//
// Usage:
//   <labos-master-list id="list"></labos-master-list>
//   <script>
//     document.getElementById('list').setData([
//       { row1: 'Sample 12-123456', row2: 'John Doe · 34Y', row3: 'Lab A — Priority',
//         badge: { text: 'Active', variant: 'accent-l' }, date: '08/08/2025' },
//       { row1: 'Order L0112128', row2: 'Ann Smith',
//         badge: { text: 'Pending', variant: 'warning-l' }, date: '08/07/2025', selected: true },
//     ]);
//   </script>
//
// Row data shape:
//   { row1: string, row2?: string, row3?: string,
//     badge?: { text: string, variant?: string },
//     date?: string, selected?: boolean }
//
// badge.variant: 'neutral-c'* | 'primary-c' | 'accent-c' | 'error-c' (dark)
//                'primary-l'  | 'accent-l'  | 'error-l'  | 'warning-l' | 'neutral-l' (bright)
//
// Events:
//   labos-selection-change  — { selected: rowData[], indices: number[] }
// ─────────────────────────────────────────────────────────────────────────────
const MASTER_LIST_CSS = `
  ${HOST_BOX}
  :host {
    display: flex;
    flex: 1;
    min-height: 0;
    overflow: hidden;
    border-top: 1px solid #E4E4E4;
  }

  .container {
    width: 400px;
    height: 100%;
    background: var(--white);
    box-sizing: border-box;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }

  /* ── Header ── */
  .header {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 16px 10px;
    border-bottom: 1px solid #E4E4E4;
    flex-shrink: 0;
  }
  .header-label {
    flex: 1;
    font-family: var(--font); font-size: 14px;
    color: var(--black);
  }
  labos-checkbox.header-check { flex-shrink: 0; }

  .list {
    flex: 1;
    overflow-y: auto;
  }

  /* ── Row ── */
  .item {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    padding: 10px;
    box-shadow: inset 0 -1px 0 0 #E4E4E4;
    cursor: pointer;
    transition: background 120ms ease;
  }
  .item:hover     { background: var(--surface); }
  .item.selected  { background: var(--primary-20); }
  .item.inactive > * { opacity: 0.45; }
  .item.inactive:hover { background: var(--white); }
  .item:focus { outline: 1px solid #A2BFC2; outline-offset: -1px; }

  /* ── Checkbox ── */
  labos-checkbox.check { flex-shrink: 0; height: 22px; }

  /* ── Content ── */
  .content { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  .row1 {
    font-family: var(--font); font-size: 14px; font-weight: 600;
    color: var(--black); height: 22px; line-height: 22px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .row2 {
    font-family: var(--font); font-size: 13px;
    color: var(--black); height: 20px; line-height: 20px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .row3 {
    font-family: var(--font); font-size: 13px;
    color: var(--black); height: 20px; line-height: 20px;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }

  /* ── Meta (badge + date) ── */
  .meta {
    display: flex; flex-direction: column; align-items: flex-end;
    gap: 4px; flex-shrink: 0;
  }
  .date {
    font-family: var(--font); font-size: 13px; font-weight: 400;
    color: var(--black); letter-spacing: .1px; white-space: nowrap;
  }

  /* ── Detail panel ── */
  .detail {
    flex: 1;
    border-left: 1px solid #E4E4E4;
    overflow-y: auto;
    background: var(--white);
  }
  .item-identity { display: flex; align-items: center; gap: 10px; padding: 12px 16px 0; }
  .item-title    { font-size: 20px; font-weight: 600; color: var(--black, #333); }
  .item-actions  { display: flex; align-items: center; gap: 6px; padding: 10px 16px 16px; }
  .detail-content { padding: 0 16px 24px; }
  .detail-meta   { display: flex; flex-wrap: wrap; gap: 24px; }
  .detail-field  { display: flex; flex-direction: column; gap: 3px; min-width: 140px; }
  .detail-label  { font-size: 12px; color: #888; }
  .detail-value  { font-size: 14px; font-weight: 600; color: var(--black, #333); }
  .detail-empty  { color: #999; font-size: 14px; padding: 16px; }
  a.item-link    { color: var(--primary); font-weight: 600; text-decoration: none; }
`;

class LabosMasterList extends HTMLElement {
  constructor() {
    super();
    this._rows      = [];
    this._selected  = new Set();
    this._active    = null;  // roving tabindex index
    this._selCursor = null;  // Shift+Arrow extension cursor
  }

  connectedCallback() { this._render(); }

  setData(rows) {
    this._rows = rows;
    this._selected.clear();
    this._active    = null;
    this._selCursor = null;
    rows.forEach((r, i) => { if (r.selected) this._selected.add(i); });
    this._render();
  }

  get selectedRows() {
    return [...this._selected].map(i => this._rows[i]);
  }

  clearSelection() {
    this._selected.clear();
    this._updateDOM();
    this._emit();
  }

  get detailPanel() { return this.shadowRoot?.querySelector('.detail'); }

  setFocus(index) {
    if (index >= 0 && index < this._rows.length) {
      this._moveFocus(index);
    }
  }

  _tabIdx(i) {
    return i === (this._active ?? 0) ? 0 : -1;
  }

  _badgeHtml({ text, variant }) {
    const MAP = {
      'neutral-c': ['#333333',                 'dark'  ],
      'primary-c': ['var(--primary)',           'dark'  ],
      'accent-c':  ['var(--accent)',            'dark'  ],
      'error-c':   ['var(--warn)',              'dark'  ],
      'primary-l': ['var(--primary-20)',        'bright'],
      'accent-l':  ['var(--green-lighten-45)',  'bright'],
      'error-l':   ['var(--red-lighten-45)',    'bright'],
      'warning-l': ['var(--orange-lighten-45)', 'bright'],
      'neutral-l': ['var(--surface)',           'bright'],
    };
    const [bg, v] = MAP[variant] || MAP['neutral-c'];
    return `<labos-badge label="${text}" bg="${bg}" variant="${v}"></labos-badge>`;
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const sr = this.shadowRoot;

    // Initialize shell once — preserves .detail content across re-renders
    if (!sr.querySelector('.container')) {
      sr.innerHTML = `<style>${MASTER_LIST_CSS}</style>
        <div class="container"></div>
        <div class="detail"><p class="detail-empty">Select an item to view details</p></div>`;
    }

    const checkState = this._getCheckState();
    const items = this._rows.map((row, i) => {
      const sel   = this._selected.has(i);
      const badge = row.badge ? this._badgeHtml(row.badge) : '';
      const date  = row.date ? `<span class="date">${row.date}</span>` : '';
      const row2  = row.row2 ? `<div class="row2">${row.row2}</div>` : '';
      const row3  = row.row3 ? `<div class="row3">${row.row3}</div>` : '';
      const inactive = row.inactive ? ' inactive' : '';
      return `
        <div class="item${sel ? ' selected' : ''}${inactive}"
             role="option" aria-selected="${sel}"
             tabindex="${this._tabIdx(i)}" data-i="${i}">
          <labos-checkbox class="check"${sel ? ' checked' : ''}></labos-checkbox>
          <div class="content">
            <div class="row1">${row.row1}</div>
            ${row2}${row3}
          </div>
          ${(badge || date) ? `<div class="meta">${badge}${date}</div>` : ''}
        </div>`;
    }).join('');

    sr.querySelector('.container').innerHTML = `
      <div class="header">
        <labos-checkbox class="header-check"${checkState === 'all' ? ' checked' : ''}${checkState === 'partial' ? ' indeterminate' : ''}></labos-checkbox>
        <span class="header-label">${this._getHeaderLabel()}</span>
        <labos-icon-menu class="header-menu" icon="more_vert" direction="bottom-right"></labos-icon-menu>
      </div>
      <div class="list" role="listbox" aria-multiselectable="true">${items}</div>`;

    this._attachEvents();
    this._initHeaderMenu();
  }

  _getCheckState() {
    const n = this._selected.size;
    if (n === 0) return 'none';
    return n === this._rows.length ? 'all' : 'partial';
  }

  _getHeaderLabel() {
    const n = this._selected.size;
    return n === 0 ? 'No rows selected' : `${n} rows selected`;
  }

  _initHeaderMenu() {
    const menu = this.shadowRoot.querySelector('.header-menu');
    if (!menu) return;
    menu.setItems([{ label: 'Display settings', value: 'display-settings' }]);
    menu.addEventListener('labos-select', e => {
      this.dispatchEvent(new CustomEvent('labos-menu-select', {
        detail: e.detail, bubbles: true, composed: true,
      }));
    });
  }

  _updateHeaderDOM() {
    const sr = this.shadowRoot;
    if (!sr) return;
    const checkEl = sr.querySelector('.header-check');
    const labelEl = sr.querySelector('.header-label');
    if (!checkEl || !labelEl) return;
    const state = this._getCheckState();
    checkEl.toggleAttribute('checked', state === 'all');
    checkEl.toggleAttribute('indeterminate', state === 'partial');
    labelEl.textContent = this._getHeaderLabel();
  }

  _attachEvents() {
    const headerCheck = this.shadowRoot.querySelector('.header-check');
    headerCheck.addEventListener('labos-change', () => {
      if (this._selected.size === this._rows.length && this._rows.length > 0) {
        this._selected.clear();
      } else {
        this._rows.forEach((_, i) => this._selected.add(i));
      }
      this._updateDOM();
      this._emit();
    });

    const list = this.shadowRoot.querySelector('.list');
    list.addEventListener('keydown', e => this._onKeydown(e));

    this.shadowRoot.querySelectorAll('.item').forEach(el => {
      const i = +el.dataset.i;

      // Native focus updates the roving tabindex anchor
      el.addEventListener('focus', () => {
        this._active = i;
        this._updateTabindex();
      });

      // Checkbox: multi-select toggle, focus stays on current item
      const chkEl = el.querySelector('.check');
      chkEl.addEventListener('labos-change', e => {
        e.stopPropagation();
        this._selected.has(i) ? this._selected.delete(i) : this._selected.add(i);
        this._updateDOM();
        this._emit();
      });
      chkEl.addEventListener('click', e => e.stopPropagation());

      // Row click: single-select (or Ctrl/Meta+click to toggle into multi-select)
      el.addEventListener('click', e => {
        if (e.ctrlKey || e.metaKey) {
          this._selected.has(i) ? this._selected.delete(i) : this._selected.add(i);
        } else {
          this._selected.clear();
          this._selected.add(i);
        }
        this._selCursor = i;
        this._active = i;
        this._updateTabindex();
        el.focus();
        this._updateDOM();
        this._emit();
      });
    });
  }

  _onKeydown(e) {
    const count = this._rows.length;
    if (!count) return;
    const cur = this._active ?? 0;

    switch (e.key) {
      case 'ArrowDown': {
        e.preventDefault();
        if (e.shiftKey) {
          const old = this._selCursor ?? cur;
          const t   = Math.min(old + 1, count - 1);
          if (t !== old) {
            if (old < cur) { this._selected.delete(old); }  // shrink upward extension
            else           { this._selected.add(t); }       // extend downward
            this._selCursor = t;
            this._updateDOM(); this._emit();
          }
        } else {
          const next = Math.min(cur + 1, count - 1);
          this._selCursor = next;
          this._selected.clear(); this._selected.add(next);
          this._moveFocus(next); this._updateDOM(); this._emit();
        }
        break;
      }
      case 'ArrowUp': {
        e.preventDefault();
        if (e.shiftKey) {
          const old = this._selCursor ?? cur;
          const t   = Math.max(old - 1, 0);
          if (t !== old) {
            if (old > cur) { this._selected.delete(old); }  // shrink downward extension
            else           { this._selected.add(t); }       // extend upward
            this._selCursor = t;
            this._updateDOM(); this._emit();
          }
        } else {
          const prev = Math.max(cur - 1, 0);
          this._selCursor = prev;
          this._selected.clear(); this._selected.add(prev);
          this._moveFocus(prev); this._updateDOM(); this._emit();
        }
        break;
      }
      case 'Home':
        e.preventDefault();
        this._selCursor = 0;
        this._selected.clear(); this._selected.add(0);
        this._moveFocus(0); this._updateDOM(); this._emit();
        break;
      case 'End':
        e.preventDefault();
        this._selCursor = count - 1;
        this._selected.clear(); this._selected.add(count - 1);
        this._moveFocus(count - 1); this._updateDOM(); this._emit();
        break;
      case 'Enter':
        e.preventDefault();
        this._selCursor = cur;
        this._selected.clear(); this._selected.add(cur);
        this._updateDOM(); this._emit();
        break;
      case ' ':
        e.preventDefault();
        this._selected.has(cur) ? this._selected.delete(cur) : this._selected.add(cur);
        this._updateDOM();
        this._emit();
        break;
    }
  }

  _moveFocus(index) {
    this._active = index;
    this._updateTabindex();
    this.shadowRoot.querySelectorAll('.item')[index]?.focus();
  }

  _updateTabindex() {
    this.shadowRoot?.querySelectorAll('.item').forEach(el => {
      el.tabIndex = +el.dataset.i === this._active ? 0 : -1;
    });
  }

  _updateDOM() {
    this.shadowRoot?.querySelectorAll('.item').forEach(el => {
      const i   = +el.dataset.i;
      const sel = this._selected.has(i);
      el.classList.toggle('selected', sel);
      el.setAttribute('aria-selected', String(sel));
      el.querySelector('.check')?.toggleAttribute('checked', sel);
    });
    this._updateHeaderDOM();
  }

  _updateAll() {
    this._updateTabindex();
    this._updateDOM();
  }

  _emit() {
    this.dispatchEvent(new CustomEvent('labos-selection-change', {
      detail: { selected: this.selectedRows, indices: [...this._selected] },
      bubbles: true, composed: true,
    }));
  }
}
customElements.define('labos-master-list', LabosMasterList);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosInput  <labos-input>
// ───────────────────────────────────────────────────────────────────────────────
// API (attributes):
//   placeholder  — floating label text
//   hint         — hint text shown below the field (omit to hide)
//   value        — initial value
//   type         — input type (text|email|password|number|date…), default: text
//   state        — "error" | "warning" for coloured underline + label
//   icon         — trailing Material icon name (static, non-clickable)
//   mandatory    — boolean attr, shows red triangle at bottom-right
//   disabled     — boolean attr
//   maxlength    — max chars; shows X/Y counter on hint row; error message when exceeded
// JS API:
//   setSuffixActions([{ icon, value, title? }])  — clickable icon buttons after the trail
// Internal reflected attrs (set by component, not the consumer):
//   focused, filled
// Events:
//   labos-input         → e.detail.value  (on every keystroke)
//   labos-change        → e.detail.value  (on blur/commit)
//   labos-focus, labos-blur
//   labos-suffix-action → e.detail = { value, icon }  (suffix action button clicked)
// ═══════════════════════════════════════════════════════════════════════════════

const INPUT_CSS = `
  ${HOST_BOX}
  :host { display: block; }
  :host([disabled]) { opacity: var(--disabled-op, 0.4); pointer-events: none; }

  .wrap { display: flex; flex-direction: column; width: 100%; }

  /* ── Field row ── */
  .field-row {
    display: flex; align-items: flex-end; gap: 6px;
    position: relative;
  }

  .field-inner { flex: 1; height: 40px; position: relative; min-width: 0; }

  /* ── Floating label ── */
  .label {
    position: absolute; left: 0; bottom: 5px;
    font-family: var(--font); font-size: 14px; line-height: 1.2;
    color: #aaaaaa; pointer-events: none;
    transition: bottom 150ms ease, font-size 150ms ease, color 150ms ease;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%;
  }
  :host([focused]) .label,
  :host([filled])  .label { bottom: 24px; font-size: 12px; color: #AAAAAA; }
  :host([focused]) .label { color: var(--primary, #265F68); }

  :host([state="error"])           .label { color: #f99d20; }
  :host([state="error"][focused])  .label,
  :host([state="error"][filled])   .label { color: #f99d20; }
  :host([state="warning"])         .label { color: var(--warning, #F99D20); }

  /* ── Native input ── */
  .input {
    position: absolute; left: 0; right: 0; bottom: 2px;
    height: 22px; border: none; outline: none; background: transparent;
    font-family: var(--font); font-size: 14px; color: var(--black, #333);
    padding: 0; box-sizing: border-box; width: 100%;
  }
  .input::placeholder { color: transparent; }

  /* ── Trailing icon ── */
  .trail {
    display: flex; align-items: center; gap: 6px;
    padding-bottom: 6px; flex-shrink: 0;
  }
  .trail:empty { display: none; }
  .trail-icon {
    font-family: 'Material Icons'; font-size: 18px;
    font-style: normal; font-weight: normal; line-height: 1;
    color: #aaaaaa; user-select: none;
  }
  .trail-action {
    font-family: 'Material Icons'; font-size: 18px;
    font-style: normal; font-weight: normal; line-height: 1;
    color: var(--primary, #265F68);
    cursor: pointer; border: none; background: none; padding: 0;
    display: inline-flex; align-items: center;
    opacity: 0.8; transition: opacity 150ms;
  }
  .trail-action:hover { opacity: 1; }

  /* ── Mandatory corner triangle ── */
  .mandatory-dot {
    display: none; position: absolute; right: 0; bottom: 0;
    width: 0; height: 0;
    border-left: 6px solid transparent;
    border-bottom: 6px solid var(--warn, #D20000);
  }
  :host([mandatory]) .mandatory-dot { display: block; }

  /* ── Underline ── */
  .underline { height: 1px; background: #DDDDDD; position: relative; }
  .underline::after {
    content: ''; position: absolute;
    left: 50%; right: 50%; bottom: 0; height: 2px;
    background: var(--primary, #265F68);
    transition: left 150ms ease, right 150ms ease;
  }
  :host([focused])                  .underline::after { left: 0; right: 0; }
  :host([state="error"])            .underline        { background: #f99d20; }
  :host([state="error"][focused])   .underline::after { background: #f99d20; }
  :host([state="warning"])          .underline        { background: var(--warning, #F99D20); }
  :host([state="warning"][focused]) .underline::after { background: var(--warning, #F99D20); }

  /* ── Hint ── */
  .hint {
    font-family: var(--font); font-size: 12px; color: #aaaaaa;
    margin-top: 2px; height: 17px; line-height: 17px; display: block;
  }
  :host([state="error"])   .hint { color: #f99d20; }
  :host([state="warning"]) .hint { color: var(--warning, #F99D20); }

  /* ── Hint row (hint + maxlength counter on same line) ── */
  .hint-row {
    display: flex; align-items: flex-start;
    justify-content: space-between;
    margin-top: 2px; min-height: 17px;
  }
  .hint-row .hint { margin-top: 0; height: auto; flex: 1; }
  .counter {
    font-family: var(--font); font-size: 12px; color: #aaaaaa;
    line-height: 17px; flex-shrink: 0; margin-left: 8px;
  }
  :host([overlimit]) .hint    { color: #D20000; }
  :host([overlimit]) .counter { color: #D20000; }
  :host([overlimit])           .label              { color: #D20000; }
  :host([overlimit][focused])  .label              { color: #D20000; }
  :host([overlimit])           .underline          { background: #D20000; }
  :host([overlimit][focused])  .underline::after   { background: #D20000; }

  /* ── Mandatory validation (set internally on blur-when-empty) ── */
  :host([invalid])           .label        { color: #D20000; }
  :host([invalid][focused])  .label        { color: #D20000; }
  :host([invalid])           .underline    { background: #D20000; }
  :host([invalid][focused])  .underline::after { background: #D20000; }
`;

class LabosInput extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'hint', 'value', 'type', 'state', 'icon', 'mandatory', 'disabled', 'maxlength'];
  }

  connectedCallback() { if (!this.shadowRoot) this._render(); }

  attributeChangedCallback(name, _old, val) {
    if (!this.shadowRoot) return;
    if (name === 'placeholder') {
      const el = this.shadowRoot.querySelector('.label');
      if (el) el.textContent = val || '';
    } else if (name === 'hint') {
      if (!this.hasAttribute('overlimit')) {
        const el = this.shadowRoot.querySelector('.hint');
        if (el) el.textContent = val || '';
      }
    } else {
      this._render();
    }
  }

  get value() { return this.shadowRoot?.querySelector('.input')?.value ?? ''; }
  set value(v) {
    const inp = this.shadowRoot?.querySelector('.input');
    if (inp) { inp.value = v; this._syncFilled(); this._syncCounter(); }
  }

  focus() { this.shadowRoot?.querySelector('.input')?.focus(); }

  _syncFilled() {
    this.shadowRoot?.querySelector('.input')?.value
      ? this.setAttribute('filled', '')
      : this.removeAttribute('filled');
  }

  _syncCounter() {
    const maxLen = parseInt(this.getAttribute('maxlength') || '') || 0;
    if (!maxLen || !this.shadowRoot) return;
    const input = this.shadowRoot.querySelector('.input');
    if (!input) return;
    const len = input.value.length;
    const counter = this.shadowRoot.querySelector('.counter');
    if (counter) counter.textContent = `${len}/${maxLen}`;
    const hintEl = this.shadowRoot.querySelector('.hint');
    if (len > maxLen) {
      this.setAttribute('overlimit', '');
      if (hintEl) hintEl.textContent = 'Character limit exceeded';
    } else {
      this.removeAttribute('overlimit');
      if (hintEl) hintEl.textContent = this.getAttribute('hint') || '';
    }
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const ph     = this.getAttribute('placeholder') || '';
    const hint   = this.getAttribute('hint');
    const type   = this.getAttribute('type') || 'text';
    const icon   = this.getAttribute('icon') || '';
    const val    = this.getAttribute('value') || '';
    const maxLen = parseInt(this.getAttribute('maxlength') || '') || 0;

    const actions    = this._suffixActions || [];
    const actionsHtml = actions.map((a, i) =>
      `<button class="trail-action" data-idx="${i}" title="${a.title || ''}">${a.icon}</button>`
    ).join('');

    const hintHtml = maxLen
      ? `<div class="hint-row"><span class="hint">${hint || ''}</span><span class="counter">0/${maxLen}</span></div>`
      : `<span class="hint">${hint || ''}</span>`;

    this.shadowRoot.innerHTML = `
      <style>${INPUT_CSS}</style>
      <div class="wrap">
        <div class="field-row">
          <div class="field-inner">
            <span class="label">${ph}</span>
            <input class="input" type="${type}" autocomplete="off">
          </div>
          <div class="trail">
            ${icon ? `<span class="trail-icon">${icon}</span>` : ''}
            ${actionsHtml}
          </div>
          <span class="mandatory-dot"></span>
        </div>
        <div class="underline"></div>
        ${hintHtml}
      </div>
    `;

    const input = this.shadowRoot.querySelector('.input');
    if (val) { input.value = val; this.setAttribute('filled', ''); this._syncCounter(); }

    input.addEventListener('focus', () => {
      this.setAttribute('focused', '');
      this.dispatchEvent(new CustomEvent('labos-focus', { bubbles: true, composed: true }));
    });
    input.addEventListener('blur', () => {
      this.removeAttribute('focused');
      this._syncFilled();
      if (this.hasAttribute('mandatory') && !input.value) this.setAttribute('invalid', '');
      this.dispatchEvent(new CustomEvent('labos-blur', {
        detail: { value: input.value }, bubbles: true, composed: true,
      }));
    });
    input.addEventListener('input', () => {
      if (input.value) this.removeAttribute('invalid');
      this._syncFilled();
      this._syncCounter();
      this.dispatchEvent(new CustomEvent('labos-input', {
        detail: { value: input.value }, bubbles: true, composed: true,
      }));
    });
    input.addEventListener('change', () => {
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { value: input.value }, bubbles: true, composed: true,
      }));
    });

    this.shadowRoot.querySelectorAll('.trail-action').forEach((btn, i) => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const a = (this._suffixActions || [])[i];
        if (!a) return;
        this.dispatchEvent(new CustomEvent('labos-suffix-action', {
          detail: { value: a.value, icon: a.icon },
          bubbles: true, composed: true,
        }));
      });
    });
  }

  setSuffixActions(actions) {
    this._suffixActions = actions || [];
    if (this.shadowRoot) this._render();
  }
}
customElements.define('labos-input', LabosInput);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosSelect  <labos-select>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   placeholder — floating label text
//   hint        — helper text below the field
//   value       — currently selected value (matched against option values)
//   state       — 'error' | 'warning'
//   mandatory   — boolean attr, shows red corner triangle
//   disabled    — boolean attr
// Internal reflected attrs (set by component, not the consumer):
//   focused, filled, open
// JS API:
//   setOptions([{ label, value }])
//   get/set value
// Events:
//   labos-change → e.detail = { label, value }
//   labos-focus, labos-blur
// ═══════════════════════════════════════════════════════════════════════════════

const SELECT_CSS = `
  ${INPUT_CSS}

  /* ── Select-specific overrides ── */
  .field-row  { cursor: pointer; user-select: none; outline: none; }
  .select-val {
    position: absolute; left: 0; right: 0; bottom: 2px;
    height: 22px; line-height: 22px;
    font-family: var(--font); font-size: 14px; color: var(--black, #333);
    overflow: hidden; white-space: nowrap; text-overflow: ellipsis;
  }
  .chevron {
    font-family: 'Material Icons'; font-size: 18px;
    font-style: normal; font-weight: normal; line-height: 1;
    color: #aaaaaa; margin-bottom: 6px; flex-shrink: 0;
    transition: transform 200ms ease;
  }
  :host([open])    .chevron { transform: rotate(180deg); color: var(--primary, #265F68); }
  :host([focused]) .chevron { color: var(--primary, #265F68); }
`;

let _labosSelectOpen = null;

class LabosSelect extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'hint', 'value', 'state', 'mandatory', 'disabled'];
  }

  constructor() {
    super();
    this._options      = [];
    this._dd           = new LabosDropdown();
    this._highlightIdx = -1;
    this._onOutsideClick  = this._onOutsideClick.bind(this);
    this._onExternalFocus = this._onExternalFocus.bind(this);
  }

  connectedCallback()    { if (!this.shadowRoot) this._render(); }
  disconnectedCallback() { this._close(); document.removeEventListener('focusin', this._onExternalFocus); }

  attributeChangedCallback(name, _old, val) {
    if (!this.shadowRoot) return;
    if (name === 'placeholder') {
      const el = this.shadowRoot.querySelector('.label');
      if (el) el.textContent = val || '';
    } else if (name === 'hint') {
      const el = this.shadowRoot.querySelector('.hint');
      if (el) el.textContent = val || '';
    } else if (name === 'value') {
      this._applyValue(val || '');
    } else {
      this._render();
    }
  }

  get value() { return this._value || ''; }
  set value(v) { this._applyValue(v); }

  _onExternalFocus(e) {
    if (!this.contains(e.target) && !this.shadowRoot?.contains(e.target)) {
      document.removeEventListener('focusin', this._onExternalFocus);
      if (this.hasAttribute('open')) this._close();
      else this.removeAttribute('focused');
    }
  }

  setOptions(options) {
    this._options = options || [];
  }

  _applyValue(v) {
    this._value = v;
    const opt   = this._options.find(o => String(o.value) === String(v));
    const label = opt ? opt.label : v;
    const el    = this.shadowRoot?.querySelector('.select-val');
    if (el) el.textContent = label || '';
    v ? this.setAttribute('filled', '') : this.removeAttribute('filled');
  }

  _onOutsideClick(e) {
    if (this.shadowRoot?.contains(e.target) || this._dd.getPortal()?.contains(e.target)) return;
    this._close();
  }

  _open() {
    this._highlightIdx = -1;
    if (_labosSelectOpen && _labosSelectOpen !== this) _labosSelectOpen._close();
    _labosSelectOpen = this;
    document.removeEventListener('focusin', this._onExternalFocus);
    this.setAttribute('open', '');
    this.setAttribute('focused', '');
    this.removeAttribute('invalid');

    const fieldRow = this.shadowRoot.querySelector('.field-row');
    this._dd.open(fieldRow, this._options, opt => {
      this._close(true);
      this._value = String(opt.value ?? opt.label ?? '');
      const valEl = this.shadowRoot?.querySelector('.select-val');
      if (valEl) valEl.textContent = opt.label || '';
      this.setAttribute('filled', '');
      this.setAttribute('focused', '');
      this.removeAttribute('invalid');
      setTimeout(() => document.addEventListener('focusin', this._onExternalFocus));
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { label: opt.label, value: opt.value },
        bubbles: true, composed: true,
      }));
    });

    setTimeout(() => {
      document.addEventListener('click', this._onOutsideClick);
      document.addEventListener('focusin', this._onExternalFocus);
    });

    this.dispatchEvent(new CustomEvent('labos-focus', { bubbles: true, composed: true }));
  }

  _close(isSelection = false) {
    if (_labosSelectOpen === this) _labosSelectOpen = null;
    this.removeAttribute('open');
    this.removeAttribute('focused');
    this._dd.close();
    document.removeEventListener('click', this._onOutsideClick);
    document.removeEventListener('focusin', this._onExternalFocus);
    if (!isSelection && this.hasAttribute('mandatory') && !this._value) {
      this.setAttribute('invalid', '');
    }
    this.dispatchEvent(new CustomEvent('labos-blur', {
      detail: { value: this._value || '' }, bubbles: true, composed: true,
    }));
  }

  _setHighlight(idx) {
    this._highlightIdx = idx;
    this._dd.setHighlight(idx);
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const ph   = this.getAttribute('placeholder') || '';
    const hint = this.getAttribute('hint') || '';

    this.shadowRoot.innerHTML = `
      <style>${SELECT_CSS}</style>
      <div class="wrap">
        <div class="field-row">
          <div class="field-inner">
            <span class="label">${ph}</span>
            <span class="select-val"></span>
          </div>
          <span class="chevron">arrow_drop_down</span>
          <span class="mandatory-dot"></span>
        </div>
        <div class="underline"></div>
        <span class="hint">${hint}</span>
      </div>
    `;

    if (this._value) this._applyValue(this._value);

    const fieldRow = this.shadowRoot.querySelector('.field-row');

    fieldRow.addEventListener('click', e => {
      e.stopPropagation();
      this.hasAttribute('open') ? this._close() : this._open();
    });

    fieldRow.setAttribute('tabindex', '0');

    fieldRow.addEventListener('focus', () => {
      this.setAttribute('focused', '');
    });
    fieldRow.addEventListener('blur', () => {
      if (!this.hasAttribute('open')) this.removeAttribute('focused');
    });

    fieldRow.addEventListener('keydown', e => {
      const isOpen = this.hasAttribute('open');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) { this._open(); this._setHighlight(0); return; }
        const items = [...(this._dd.getPortal()?.querySelectorAll('.lbd-item:not([disabled])') || [])];
        this._setHighlight(Math.min(this._highlightIdx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (!isOpen) return;
        this._setHighlight(Math.max(this._highlightIdx - 1, 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) { this._open(); return; }
        if (this._highlightIdx >= 0) {
          const items = [...(this._dd.getPortal()?.querySelectorAll('.lbd-item:not([disabled])') || [])];
          items[this._highlightIdx]?.click();
        }
      } else if (e.key === 'Escape') {
        this._close();
      }
    });
  }
}
customElements.define('labos-select', LabosSelect);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosRoundedSelect  <labos-rounded-select>
// ───────────────────────────────────────────────────────────────────────────────
// Pill-shaped select. No floating label — placeholder stays in field.
// No error / hint / mandatory states.
// API:
//   setOptions(arr)  — arr: [{ label, value, icon?, disabled? }]
//   value (get/set)  — current selected value string
// Attributes:
//   placeholder  — static placeholder text
//   size         — "default" (36px) | "small" (28px)
//   disabled     — boolean
// Events:
//   labos-change → e.detail = { label, value }
// ═══════════════════════════════════════════════════════════════════════════════

const ROUNDED_SELECT_CSS = `
  ${HOST_BOX}
  :host { display: block; position: relative; outline: none; }
  :host([disabled]) { pointer-events: none; opacity: 0.4; }

  .field {
    display: flex; align-items: center;
    height: 36px; padding: 0 8px 0 12px;
    border: 1px solid #D5E0E1; border-radius: 18px;
    background: var(--white); cursor: pointer;
    user-select: none; outline: none;
    transition: border-color 120ms;
  }
  :host([open]) .field,
  .field:focus  { border-color: #6D9CA1; }

  :host([size="small"]) .field { height: 28px; }

  /* Fixed-width variant */
  :host([width="fixed"])               .field { width: 160px; }
  :host([width="fixed"][size="small"]) .field { width: 130px; }

  .field__text {
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
    font-family: var(--font); font-size: 14px; color: var(--primary, #265F68);
    position: relative; top: -1px;
  }
  :host([size="small"]) .field__text { font-size: 13px; }
  .field__text--ph { color: #aaaaaa; }

  .field__chevron {
    font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
    color: #aaaaaa; flex-shrink: 0;
    transition: transform 200ms, color 120ms;
  }
  :host([open]) .field__chevron,
  .field:focus .field__chevron { color: var(--primary, #265F68); }
  :host([open]) .field__chevron { transform: rotate(180deg); }
`;

class LabosRoundedSelect extends HTMLElement {
  static get observedAttributes() { return ['placeholder', 'size', 'disabled']; }

  constructor() {
    super();
    this._options      = [];
    this._value        = '';
    this._dd           = new LabosDropdown();
    this._highlightIdx = -1;
    this._onOutside    = this._onOutside.bind(this);
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback()  { this._render(); }
  attributeChangedCallback() { this._render(); }

  setOptions(opts) { this._options = opts; }

  get value() { return this._value; }
  set value(v) {
    this._value = String(v ?? '');
    const opt = this._options.find(o => String(o.value ?? o.label) === this._value);
    const el  = this.shadowRoot?.querySelector('.field__text');
    if (el) {
      el.textContent = opt ? opt.label : (this.getAttribute('placeholder') || '');
      el.classList.toggle('field__text--ph', !opt);
    }
  }

  _open() {
    if (this.hasAttribute('open')) return;
    this.setAttribute('open', '');

    const field = this.shadowRoot.querySelector('.field');
    this._dd.open(field, this._options, opt => {
      this._value = String(opt.value ?? opt.label ?? '');
      this._close();
      const textEl = this.shadowRoot?.querySelector('.field__text');
      if (textEl) { textEl.textContent = opt.label; textEl.classList.remove('field__text--ph'); }
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { label: opt.label, value: opt.value },
        bubbles: true, composed: true,
      }));
    });
    this._highlightIdx = -1;
    setTimeout(() => document.addEventListener('click', this._onOutside));
  }

  _close() {
    this.removeAttribute('open');
    this._dd.close();
    document.removeEventListener('click', this._onOutside);
    this._highlightIdx = -1;
  }

  _onOutside(e) {
    if (!this.contains(e.target) && !this._dd.getPortal()?.contains(e.target)) this._close();
  }

  _setHighlight(idx) {
    this._highlightIdx = idx;
    this._dd.setHighlight(idx);
  }

  _render() {
    const ph = this.getAttribute('placeholder') || '';
    const opt = this._options.find(o => String(o.value ?? o.label) === this._value);
    const displayText = opt ? opt.label : ph;
    const isPlaceholder = !opt;

    this.shadowRoot.innerHTML = `
      <style>${ROUNDED_SELECT_CSS}</style>
      <div class="field" tabindex="0">
        <span class="field__text${isPlaceholder ? ' field__text--ph' : ''}">${displayText}</span>
        <span class="field__chevron">arrow_drop_down</span>
      </div>
    `;

    const field = this.shadowRoot.querySelector('.field');
    field.addEventListener('click', e => {
      e.stopPropagation();
      this.hasAttribute('open') ? this._close() : this._open();
    });
    field.addEventListener('keydown', e => {
      const isOpen = this.hasAttribute('open');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!isOpen) { this._open(); this._setHighlight(0); return; }
        const items = [...(this._dd.getPortal()?.querySelectorAll('.lbd-item:not([disabled])') || [])];
        this._setHighlight(Math.min(this._highlightIdx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (isOpen) this._setHighlight(Math.max(this._highlightIdx - 1, 0));
      } else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (!isOpen) { this._open(); return; }
        if (this._highlightIdx >= 0) {
          const items = [...(this._dd.getPortal()?.querySelectorAll('.lbd-item:not([disabled])') || [])];
          items[this._highlightIdx]?.click();
        }
      } else if (e.key === 'Escape') { this._close(); }
    });
    field.addEventListener('blur', () => { if (!this.hasAttribute('open')) {} });
  }
}
customElements.define('labos-rounded-select', LabosRoundedSelect);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosAutocomplete  <labos-autocomplete>
// Simple autocomplete — floating-label input + fixed option list, prefix filter
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   placeholder    — floating label text
//   hint           — helper text below the field (restored after no-match clears)
//   value          — current text value
//   state          — 'error' | 'warning'
//   mandatory      — boolean attr
//   no-match-text  — error message when no options match (default: "No item found")
//   disabled       — boolean attr
// Internal reflected attrs: focused, filled, open, invalid, no-match
// JS API:
//   setOptions([{ label, value }])
//   get/set value
// Events:
//   labos-change → e.detail = { label, value }  (option selected from list)
//   labos-input  → e.detail = { value }          (every keystroke)
//   labos-focus, labos-blur
// ═══════════════════════════════════════════════════════════════════════════════

class LabosAutocomplete extends HTMLElement {
  static get observedAttributes() {
    return ['placeholder', 'hint', 'value', 'state', 'mandatory', 'no-match-text', 'disabled'];
  }

  constructor() {
    super();
    this._options      = [];
    this._dd           = new LabosDropdown({ keepFocus: true });
    this._originalHint = '';
    this._highlightIdx = -1;
  }

  connectedCallback()    { if (!this.shadowRoot) this._render(); }
  disconnectedCallback() { this._closePortal(); }

  attributeChangedCallback(name, _old, val) {
    if (!this.shadowRoot) return;
    if (name === 'placeholder') {
      const el = this.shadowRoot.querySelector('.label');
      if (el) el.textContent = val || '';
    } else if (name === 'hint') {
      this._originalHint = val || '';
      if (!this.hasAttribute('no-match')) {
        const el = this.shadowRoot.querySelector('.hint');
        if (el) el.textContent = val || '';
      }
    } else if (name === 'value') {
      const inp = this.shadowRoot.querySelector('.input');
      if (inp) { inp.value = val || ''; this._syncFilled(); }
    } else {
      this._render();
    }
  }

  get value() { return this.shadowRoot?.querySelector('.input')?.value ?? ''; }
  set value(v) {
    const inp = this.shadowRoot?.querySelector('.input');
    if (inp) { inp.value = v || ''; this._syncFilled(); }
  }

  setOptions(options) { this._options = options || []; }

  focus() { this.shadowRoot?.querySelector('.input')?.focus(); }

  _syncFilled() {
    this.shadowRoot?.querySelector('.input')?.value
      ? this.setAttribute('filled', '')
      : this.removeAttribute('filled');
  }

  _setNoMatch(active) {
    const hintEl = this.shadowRoot?.querySelector('.hint');
    if (active) {
      this.setAttribute('no-match', '');
      if (hintEl) hintEl.textContent = this.getAttribute('no-match-text') || 'No item found';
    } else {
      this.removeAttribute('no-match');
      if (hintEl) hintEl.textContent = this._originalHint;
    }
  }

  _openPortal(filter) {
    this._highlightIdx = -1;
    const q = (filter || '').toLowerCase();
    const items = q
      ? this._options.filter(o => o.label.toLowerCase().startsWith(q))
      : [...this._options];

    if (q && items.length === 0) {
      this._setNoMatch(true);
      this._closePortal();
      return;
    }

    this._setNoMatch(false);
    this.setAttribute('open', '');

    const fieldRow = this.shadowRoot.querySelector('.field-row');
    const onSelect = item => {
      const inp = this.shadowRoot?.querySelector('.input');
      if (inp) inp.value = item.label;
      this._syncFilled();
      this.removeAttribute('invalid');
      this._setNoMatch(false);
      this._closePortal();
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { label: item.label, value: item.value },
        bubbles: true, composed: true,
      }));
    };

    if (!this._dd.isOpen) this._dd.open(fieldRow, items, onSelect);
    else                  this._dd.refresh(items, onSelect);

    if (items.length === 1) this._setHighlight(0);
  }

  _setHighlight(idx) {
    this._highlightIdx = idx;
    this._dd.setHighlight(idx);
  }

  _closePortal() {
    this.removeAttribute('open');
    this._dd.close();
  }

  setSuffixActions(actions) {
    this._suffixActions = actions || [];
    if (this.shadowRoot) this._render();
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const ph   = this.getAttribute('placeholder') || '';
    const hint = this.getAttribute('hint') || '';
    const val  = this.getAttribute('value') || '';
    this._originalHint = hint;

    const actions     = this._suffixActions || [];
    const actionsHtml = actions.map((a, i) =>
      `<button class="trail-action" data-idx="${i}" title="${a.title || ''}">${a.icon}</button>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>
        ${INPUT_CSS}
        :host([no-match])           .label             { color: #D20000; }
        :host([no-match][focused])  .label             { color: #D20000; }
        :host([no-match])           .underline         { background: #D20000; }
        :host([no-match][focused])  .underline::after  { background: #D20000; }
        :host([no-match])           .hint              { color: #D20000; }
      </style>
      <div class="wrap">
        <div class="field-row">
          <div class="field-inner">
            <span class="label">${ph}</span>
            <input class="input" type="text" autocomplete="off" spellcheck="false">
          </div>
          ${actionsHtml ? `<div class="trail">${actionsHtml}</div>` : ''}
          <span class="mandatory-dot"></span>
        </div>
        <div class="underline"></div>
        <span class="hint">${hint}</span>
      </div>
    `;

    this.shadowRoot.querySelectorAll('.trail-action').forEach((btn, i) => {
      btn.addEventListener('click', e => {
        e.stopPropagation();
        const a = (this._suffixActions || [])[i];
        if (!a) return;
        this.dispatchEvent(new CustomEvent('labos-suffix-action', {
          detail: { value: a.value, icon: a.icon },
          bubbles: true, composed: true,
        }));
      });
    });

    const input = this.shadowRoot.querySelector('.input');
    if (val) { input.value = val; this.setAttribute('filled', ''); }

    input.addEventListener('focus', () => {
      this.setAttribute('focused', '');
      if (!this.hasAttribute('no-match')) this._openPortal(input.value);
      this.dispatchEvent(new CustomEvent('labos-focus', { bubbles: true, composed: true }));
    });

    input.addEventListener('blur', () => {
      this.removeAttribute('focused');
      this._syncFilled();
      this._closePortal();
      if (this.hasAttribute('mandatory') && !input.value) this.setAttribute('invalid', '');
      this.dispatchEvent(new CustomEvent('labos-blur', {
        detail: { value: input.value }, bubbles: true, composed: true,
      }));
    });

    input.addEventListener('input', () => {
      if (input.value) this.removeAttribute('invalid');
      this._syncFilled();
      this._openPortal(input.value);
      this.dispatchEvent(new CustomEvent('labos-input', {
        detail: { value: input.value }, bubbles: true, composed: true,
      }));
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        this._setNoMatch(false); this._closePortal(); input.blur();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (!this._dd.isOpen) this._openPortal(input.value);
        const items = [...(this._dd.getPortal()?.querySelectorAll('.lbd-item') || [])];
        if (items.length) this._setHighlight(Math.min(this._highlightIdx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this._highlightIdx > 0) this._setHighlight(this._highlightIdx - 1);
      } else if (e.key === 'Enter') {
        if (this._dd.isOpen && this._highlightIdx >= 0) {
          e.preventDefault();
          const items = [...this._dd.getPortal().querySelectorAll('.lbd-item')];
          items[this._highlightIdx]?.click();
        }
      }
    });
  }
}
customElements.define('labos-autocomplete', LabosAutocomplete);

// ═══════════════════════════════════════════════════════════════════════════════
// LabosRoundedSearch  <labos-rounded-search>
// ───────────────────────────────────────────────────────────────────────────────
// API:
//   setOptions(arr)    — arr: [{ label, row2?, value? }]  (mode="search" only)
//   placeholder attr   — input placeholder text
//   action-icon attr   — optional Material Icon name shown as teal button right of search
//   mode attr          — 'search' (default): dropdown autocomplete | 'filter': no dropdown, fires on every keystroke
//   Events:
//     'labos-select'   → e.detail = { label, row2, value }  (mode="search")
//     'labos-action'   → fired when action icon is clicked
//     'labos-input'    → e.detail = { value }  (mode="filter", fires on every keystroke)
// ═══════════════════════════════════════════════════════════════════════════════

const ROUNDED_SEARCH_CSS = `
  :host { display: block; position: relative; }

  /* ── Pill input ── */
  .pill {
    display: flex; align-items: center;
    height: 36px; padding: 0 6px 0 13px;
    background: #eeeeee; border-radius: 18px;
    gap: 8px; box-sizing: border-box;
  }
  .pill-input {
    flex: 1; border: none; background: none; outline: none;
    font-family: var(--font, 'Open Sans', sans-serif);
    font-size: 14px; color: #333; min-width: 0;
  }
  .pill-input::placeholder { color: #999999; }
  .pill-icons { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
  .btn-icon { width:36px; height:36px; padding:0; display:inline-flex; align-items:center; justify-content:center; border-radius:50%; border:none; background:transparent; cursor:pointer; color:var(--primary,#265F68); transition:background 120ms; flex-shrink:0; user-select:none; }
  .btn-icon:hover { background:rgba(38,95,104,.12); }
  .btn-icon.btn-sm { width:30px; height:30px; }
  .btn-clear { color: #999; }
  .btn-clear:hover { background: rgba(0,0,0,.06); }
  [hidden] { display: none !important; }
  .btn-icon .material-icons { font-family:'Material Icons'; font-size:18px; font-style:normal; font-weight:normal; line-height:1; }

  /* ── Dropdown ── */
  @keyframes lrs-drop { from{opacity:0;transform:translateY(-4px)} to{opacity:1;transform:translateY(0)} }
  .dropdown {
    position: absolute; top: 40px; left: 0;
    min-width: 100%; width: max-content;
    background: #fff;
    box-shadow: 0 4px 4px 0 rgba(0,0,0,.25);
    max-height: 330px; overflow-y: auto;
    z-index: 1000;
    animation: lrs-drop .12s ease;
  }
  .dropdown[hidden] { display: none; animation: none; }

  /* ── Option ── */
  .option {
    min-height: var(--lrs-opt-height, 60px);
    padding: var(--lrs-opt-padding, 10px 20px);
    cursor: pointer; display: flex; flex-direction: column;
    justify-content: center; gap: 2px;
    transition: background .12s;
  }
  .option:hover:not(.option--disabled) { background: #f5f5f5; }
  .option--active:not(.option--disabled) { background: #dcdcdc; }
  .option--disabled { cursor: default; opacity: 0.4; }

  .opt-label {
    display: flex; align-items: center;
    font-family: var(--font, 'Open Sans', sans-serif);
    font-size: 14px; font-weight: var(--lrs-opt-fw, 600); color: #333;
    overflow: hidden; white-space: nowrap;
  }
  .opt-match { background: var(--primary-20, #D5E0E1); color: var(--primary, #265F68); }
  .opt-row2 {
    font-family: var(--font, 'Open Sans', sans-serif);
    font-size: 13px; font-weight: 400; color: #666;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
`;

class LabosRoundedSearch extends HTMLElement {
  constructor() {
    super();
    this._options = [];
    this._active  = -1;
    this._query   = '';
    this._open    = false;
    this._onDocClick = this._onDocClick.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._render();
    document.addEventListener('click', this._onDocClick);
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocClick);
  }

  setOptions(options) {
    this._options = options;
    if (this._open) this._renderDropdown();
  }

  get placeholder() { return this.getAttribute('placeholder') || 'Search...'; }
  get actionIcon()  { return this.getAttribute('action-icon') || ''; }
  get mode()        { return this.getAttribute('mode') || 'search'; }

  get value() { return this._query; }
  set value(v) {
    this._query = v || '';
    const inp     = this.shadowRoot?.querySelector('.pill-input');
    const clearEl = this.shadowRoot?.querySelector('[data-clear]');
    if (inp)     inp.value = this._query;
    if (clearEl) clearEl.hidden = !this._query && !this.hasAttribute('always-clear');
  }

  get _filtered() {
    const q = this._query.trim().toLowerCase();
    if (!q) return [];
    return this._options.filter(o =>
      o.label?.toLowerCase().includes(q) ||
      o.row2?.toLowerCase().includes(q)
    );
  }

  _before(label) {
    const q = this._query.trim();
    if (!q) return label;
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? label : label.substring(0, i);
  }
  _match(label) {
    const q = this._query.trim();
    if (!q) return '';
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? '' : label.substring(i, i + q.length);
  }
  _after(label) {
    const q = this._query.trim();
    if (!q) return '';
    const i = label.toLowerCase().indexOf(q.toLowerCase());
    return i < 0 ? '' : label.substring(i + q.length);
  }

  _optionHTML(opt, index) {
    const match  = this._match(opt.label);
    const before = this._before(opt.label);
    const after  = this._after(opt.label);
    const labelHTML = match
      ? `<span>${before}</span><span class="opt-match">${match}</span><span>${after}</span>`
      : `<span>${opt.label}</span>`;
    const row2HTML      = opt.row2 ? `<div class="opt-row2">${opt.row2}</div>` : '';
    const activeClass   = index === this._active ? ' option--active'   : '';
    const disabledClass = opt.disabled            ? ' option--disabled' : '';
    return `
      <div class="option${activeClass}${disabledClass}" data-i="${index}" role="option"
           aria-selected="${index === this._active}" aria-disabled="${!!opt.disabled}">
        <div class="opt-label">${labelHTML}</div>
        ${row2HTML}
      </div>`;
  }

  _render() {
    const actionHTML = this.actionIcon
      ? `<button class="btn-icon btn-sm" data-action><span class="material-icons">${this.actionIcon}</span></button>`
      : '';
    this.shadowRoot.innerHTML = `
      <style>${ROUNDED_SEARCH_CSS}</style>
      <div class="pill">
        <input class="pill-input" type="text" placeholder="${this.placeholder}"
               autocomplete="off" role="combobox" aria-haspopup="listbox" aria-expanded="false">
        <div class="pill-icons">
          <button class="btn-icon btn-sm btn-clear" data-clear${this.mode === 'filter' ? '' : ' hidden'}><span class="material-icons">close</span></button>
          ${actionHTML}
        </div>
      </div>
      <div class="dropdown" hidden role="listbox"></div>
    `;
    this._attachEvents();
  }

  _attachEvents() {
    const input    = this.shadowRoot.querySelector('.pill-input');
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const clearEl  = this.shadowRoot.querySelector('[data-clear]');

    input.addEventListener('input', () => {
      this._query  = input.value;
      this._active = -1;
      if (clearEl && !this.hasAttribute('always-clear')) clearEl.hidden = !input.value;
      if (this.mode === 'filter') {
        this.dispatchEvent(new CustomEvent('labos-input', {
          detail: { value: input.value },
          bubbles: true, composed: true,
        }));
        return;
      }
      const show = this._query.trim().length > 0 && this._filtered.length > 0;
      this._setOpen(show);
    });

    if (clearEl) {
      clearEl.addEventListener('click', () => {
        input.value  = '';
        this._query  = '';
        if (this.mode !== 'filter') clearEl.hidden = true;
        this._setOpen(false);
        if (this.mode === 'filter') {
          this.dispatchEvent(new CustomEvent('labos-input', {
            detail: { value: '' },
            bubbles: true, composed: true,
          }));
        }
        this.dispatchEvent(new CustomEvent('labos-clear', {
          bubbles: true, composed: true,
        }));
        input.focus();
      });
    }

    input.addEventListener('focus', () => {
      if (this.mode === 'filter') return;
      if (this._query.trim() && this._filtered.length > 0) this._setOpen(true);
    });

    input.addEventListener('blur', () => {
      setTimeout(() => this._setOpen(false), 150);
    });

    input.addEventListener('keydown', e => {
      if (this.mode === 'filter') return;
      if (!this._open) return;
      const count = this._filtered.length;
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        this._active = this._active < count - 1 ? this._active + 1 : 0;
        this._renderDropdown();
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this._active = this._active > 0 ? this._active - 1 : count - 1;
        this._renderDropdown();
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (this._active >= 0 && this._active < count) {
          const opt = this._filtered[this._active];
          if (!opt.disabled) this._select(opt, input);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        this._setOpen(false);
      }
    });

    dropdown.addEventListener('mousedown', e => {
      const item = e.target.closest('.option');
      if (!item || item.classList.contains('option--disabled')) return;
      const opt = this._filtered[+item.dataset.i];
      if (opt) this._select(opt, input);
    });

    const actionEl = this.shadowRoot.querySelector('[data-action]');
    if (actionEl) {
      actionEl.addEventListener('click', () => {
        this.dispatchEvent(new CustomEvent('labos-action', { bubbles: true, composed: true }));
      });
    }
  }

  _setOpen(open) {
    this._open = open;
    if (open) this._renderDropdown();
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    const input    = this.shadowRoot.querySelector('.pill-input');
    if (dropdown) dropdown.hidden = !open;
    if (input)    input.setAttribute('aria-expanded', String(open));
  }

  _renderDropdown() {
    const dropdown = this.shadowRoot.querySelector('.dropdown');
    if (!dropdown) return;
    dropdown.innerHTML = this._filtered.map((o, i) => this._optionHTML(o, i)).join('');
  }

  _select(opt, input) {
    input.value  = opt.label;
    this._query  = opt.label;
    this._active = -1;
    this._setOpen(false);
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: { label: opt.label, row2: opt.row2, value: opt.value },
      bubbles: true, composed: true,
    }));
  }

  _onDocClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target)) {
      this._setOpen(false);
    }
  }
}
customElements.define('labos-rounded-search', LabosRoundedSearch);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-CHECKBOX
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   label         — visible text label
//   checked       — boolean presence; set/remove to toggle
//   disabled      — boolean presence
//   indeterminate — boolean presence (dash mark, used for select-all)
//
// Events:
//   labos-change  — { checked: bool }
// ─────────────────────────────────────────────────────────────────────────────
const CHECKBOX_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; align-items: center; cursor: pointer; height: 30px; }
  :host([disabled]) { opacity: 0.38; pointer-events: none; }

  .lbc {
    display: inline-flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none;
    font-family: var(--font); font-size: 14px; color: var(--black);
  }

  /* Touch target + ripple container */
  .lbc__ctrl {
    position: relative;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin: -10px;
    border-radius: 50%;
  }

  /* Native input fills the touch target, invisible */
  .lbc__native {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0;
    width: 100%; height: 100%;
  }

  /* Hover/focus ripple */
  .lbc__ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(38,95,104,.12);
    pointer-events: none;
    opacity: 0;
    transition: opacity .15s;
  }
  .lbc__ctrl:hover .lbc__ripple        { opacity: 1; }
  .lbc__native:focus-visible ~ .lbc__ripple { opacity: 1; }

  /* Visual frame (the box) */
  .lbc__frame {
    width: 16px; height: 16px;
    box-sizing: border-box;
    border: 2px solid #757575;
    border-radius: 2px;
    pointer-events: none;
    transition: border-color .12s, background-color .12s;
    background-color: transparent;
    background-repeat: no-repeat;
    background-position: center;
    background-size: 11px 11px;
    flex-shrink: 0;
  }

  /* Checked */
  .lbc__native:checked ~ .lbc__frame {
    border-color: var(--primary, #265F68);
    background-color: var(--primary, #265F68);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cpolyline points='2,6 5,9.5 10,2.5' fill='none' stroke='%23fff' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  }

  /* Indeterminate (dash) */
  .lbc__native:indeterminate ~ .lbc__frame {
    border-color: var(--primary, #265F68);
    background-color: var(--primary, #265F68);
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 12 12' xmlns='http://www.w3.org/2000/svg'%3E%3Cline x1='2' y1='6' x2='10' y2='6' stroke='%23fff' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E");
  }

  .lbc__label { position: relative; top: -1px; }
`;

class LabosCheckbox extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'indeterminate', 'label']; }

  connectedCallback() { this._render(); }

  attributeChangedCallback(name, _, val) {
    if (!this.shadowRoot) return;
    const input = this.shadowRoot.querySelector('.lbc__native');
    if (!input) return;
    if (name === 'checked')       input.checked       = val !== null;
    if (name === 'disabled')      input.disabled      = val !== null;
    if (name === 'indeterminate') input.indeterminate = val !== null;
    if (name === 'label') {
      const el = this.shadowRoot.querySelector('.lbc__label');
      if (el) el.textContent = val || '';
    }
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const label         = this.getAttribute('label') || '';
    const checked       = this.hasAttribute('checked');
    const disabled      = this.hasAttribute('disabled');
    const indeterminate = this.hasAttribute('indeterminate');

    this.shadowRoot.innerHTML = `<style>${CHECKBOX_CSS}</style>
      <label class="lbc">
        <span class="lbc__ctrl">
          <input type="checkbox" class="lbc__native"
            ${checked ? 'checked' : ''}
            ${disabled ? 'disabled' : ''}>
          <span class="lbc__ripple"></span>
          <span class="lbc__frame"></span>
        </span>
        ${label ? `<span class="lbc__label">${label}</span>` : ''}
      </label>`;

    const input = this.shadowRoot.querySelector('.lbc__native');
    if (indeterminate) input.indeterminate = true;

    input.addEventListener('change', () => {
      input.checked ? this.setAttribute('checked', '') : this.removeAttribute('checked');
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { checked: input.checked },
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define('labos-checkbox', LabosCheckbox);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-RADIO
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   label    — visible text label
//   checked  — boolean presence
//   disabled — boolean presence
//   name     — radio group name (used to auto-uncheck siblings)
//   value    — value emitted in labos-change
//
// Events:
//   labos-change  — { checked: true, value: string }
// ─────────────────────────────────────────────────────────────────────────────
const RADIO_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; align-items: center; cursor: pointer; height: 30px; }
  :host([disabled]) { opacity: 0.38; pointer-events: none; }

  .lbr {
    display: inline-flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none;
    font-family: var(--font); font-size: 14px; color: var(--black);
  }

  .lbr__ctrl {
    position: relative;
    width: 36px; height: 36px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    margin: -10px;
    border-radius: 50%;
  }

  .lbr__native {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    margin: 0;
    width: 100%; height: 100%;
  }

  .lbr__ripple {
    position: absolute;
    inset: 0;
    border-radius: 50%;
    background: rgba(38,95,104,.12);
    pointer-events: none;
    opacity: 0;
    transition: opacity .15s;
  }
  .lbr__ctrl:hover .lbr__ripple             { opacity: 1; }
  .lbr__native:focus-visible ~ .lbr__ripple { opacity: 1; }

  /* Outer ring */
  .lbr__ring {
    width: 16px; height: 16px;
    box-sizing: border-box;
    border: 2px solid #757575;
    border-radius: 50%;
    pointer-events: none;
    transition: border-color .12s;
    flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
  }

  /* Inner dot */
  .lbr__dot {
    width: 8px; height: 8px;
    border-radius: 50%;
    background: var(--primary, #265F68);
    pointer-events: none;
    transform: scale(0);
    transition: transform .12s cubic-bezier(.4,0,.2,1);
  }

  /* Checked */
  .lbr__native:checked ~ .lbr__ring                { border-color: var(--primary, #265F68); }
  .lbr__native:checked ~ .lbr__ring .lbr__dot      { transform: scale(1); }

  .lbr__label { position: relative; top: -1px; }
`;

class LabosRadio extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'label']; }

  connectedCallback() { this._render(); }

  attributeChangedCallback(name, _, val) {
    if (!this.shadowRoot) return;
    const input = this.shadowRoot.querySelector('.lbr__native');
    if (!input) return;
    if (name === 'checked')  input.checked  = val !== null;
    if (name === 'disabled') input.disabled = val !== null;
    if (name === 'label') {
      const el = this.shadowRoot.querySelector('.lbr__label');
      if (el) el.textContent = val || '';
    }
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const label   = this.getAttribute('label') || '';
    const checked = this.hasAttribute('checked');
    const disabled = this.hasAttribute('disabled');
    const name  = this.getAttribute('name')  || '';
    const value = this.getAttribute('value') || '';

    this.shadowRoot.innerHTML = `<style>${RADIO_CSS}</style>
      <label class="lbr">
        <span class="lbr__ctrl">
          <input type="radio" class="lbr__native"
            ${checked  ? 'checked'  : ''}
            ${disabled ? 'disabled' : ''}
            ${name  ? `name="${name}"`   : ''}
            ${value ? `value="${value}"` : ''}>
          <span class="lbr__ripple"></span>
          <span class="lbr__ring">
            <span class="lbr__dot"></span>
          </span>
        </span>
        ${label ? `<span class="lbr__label">${label}</span>` : ''}
      </label>`;

    const input = this.shadowRoot.querySelector('.lbr__native');
    input.addEventListener('change', () => {
      if (!input.checked) return;
      this.setAttribute('checked', '');
      // Uncheck other same-name siblings in the light DOM
      const grpName = this.getAttribute('name');
      if (grpName) {
        document.querySelectorAll(`labos-radio[name="${grpName}"]`).forEach(el => {
          if (el !== this) el.removeAttribute('checked');
        });
      }
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { checked: true, value: input.value },
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define('labos-radio', LabosRadio);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosChipList  <labos-chip-list>
// ───────────────────────────────────────────────────────────────────────────────
// API:
//   setItems(arr)  — arr: [{ label?, value, icon?, counter?, selected?, disabled? }]
//                   icon = Material Icons name; omit label for icon-only circular chip
// Attributes:
//   mode     — "single" (default) | "multiple"
//   size     — "default" (36px) | "small" (28px)
//   disabled — disables all chips
// Events:
//   labos-change → e.detail = { value, selected, items }
// ═══════════════════════════════════════════════════════════════════════════════

const CHIP_LIST_CSS = `
  ${HOST_BOX}
  :host { display: flex; flex-wrap: wrap; gap: 6px; }

  .chip {
    display: inline-flex; align-items: center; justify-content: center;
    gap: 6px; height: 36px; padding: 0 14px;
    background: var(--white); border: 1px solid var(--primary-border, #C8DDDF);
    border-radius: 18px; cursor: pointer;
    font-family: var(--font); font-size: 14px; color: var(--primary, #265F68);
    white-space: nowrap; user-select: none;
    transition: background 120ms, border-color 120ms;
    outline: none; flex-shrink: 0;
  }
  .chip:not(:disabled):hover:not([selected]) { background: #EDF4F5; }
  .chip:not(:disabled):hover[selected]        { background: #C8D8D9; }
  .chip[selected]   { background: #D8E7E8; border-color: #6D9CA1; }
  .chip:disabled    { opacity: 0.4; cursor: default; }

  /* Small */
  :host([size="small"]) .chip { height: 28px; padding: 0 10px; font-size: 13px; }

  /* Icon-only → circular */
  .chip--icon-only          { padding: 0; width: 36px; }
  :host([size="small"]) .chip--icon-only { width: 28px; }

  /* Counter layout */
  .chip--counter            { gap: 10px; padding-right: 10px; }
  :host([size="small"]) .chip--counter { padding-right: 8px; }

  .chip__label { position: relative; top: -1px; }

  .chip__icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400;
    font-style: normal; line-height: 1; flex-shrink: 0;
  }
  labos-badge { flex-shrink: 0; }
`;

class LabosChipList extends HTMLElement {
  static get observedAttributes() { return ['mode', 'size', 'disabled']; }

  constructor() {
    super();
    this._items = [];
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback()  { this._render(); }
  attributeChangedCallback() { if (this._items.length) this._render(); }

  setItems(items) {
    this._items = items.map(it => ({ ...it }));
    this._render();
  }

  get items() { return this._items; }

  _isIconOnly(item) {
    return !!(item.icon && !item.label && item.counter == null);
  }

  _render() {
    const hostDisabled = this.hasAttribute('disabled');
    this.shadowRoot.innerHTML = `<style>${CHIP_LIST_CSS}</style>`;

    this._items.forEach((item, idx) => {
      const btn = document.createElement('button');
      const iconOnly = this._isIconOnly(item);
      const hasCounter = item.counter != null;

      btn.className = 'chip'
        + (iconOnly    ? ' chip--icon-only' : '')
        + (hasCounter  ? ' chip--counter'   : '');

      if (item.selected)  btn.setAttribute('selected', '');
      if (item.disabled || hostDisabled) btn.disabled = true;

      let html = '';
      if (item.icon)  html += `<span class="chip__icon">${item.icon}</span>`;
      if (item.label) html += `<span class="chip__label">${item.label}</span>`;
      if (hasCounter) html += `<labos-badge rounded label="${item.counter}" bg="#333333"></labos-badge>`;
      btn.innerHTML = html;

      btn.addEventListener('click', () => this._handleClick(idx));
      this.shadowRoot.appendChild(btn);
    });
  }

  _handleClick(idx) {
    const mode = this.getAttribute('mode') || 'single';
    const item = this._items[idx];
    if (mode === 'single') {
      const wasSelected = item.selected;
      this._items.forEach(it => { it.selected = false; });
      item.selected = !wasSelected;
    } else {
      item.selected = !item.selected;
    }
    this._render();
    this.dispatchEvent(new CustomEvent('labos-change', {
      detail: { value: item.value, selected: item.selected, items: this._items },
      bubbles: true, composed: true,
    }));
  }
}
customElements.define('labos-chip-list', LabosChipList);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-MENU-BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   label    — button text
//   icon     — optional leading Material icon name
//   variant  — 'default' | 'primary' | 'accent' | 'warn'  (default: 'default')
//   size     — 'default' | 'large' | 'small' | 'xsmall'
//   disabled — boolean presence
//
// JS API:
//   el.setItems([{ label, value, icon?, disabled? }])
//
// Events:
//   labos-select  — { label, value }
// ─────────────────────────────────────────────────────────────────────────────
const MENU_BUTTON_CSS = `
  ${HOST_BOX}
  :host { display: inline-block; position: relative; }
  :host([hidden]) { display: none; }

  .lbm-btn {
    display: inline-flex; align-items: center; gap: 7px;
    height: 36px; padding: 0 12px;
    border: 1px solid transparent;
    border-radius: var(--radius);
    font-family: var(--font); font-size: 14px; font-weight: 400;
    cursor: pointer; white-space: nowrap;
    transition: var(--transition);
    box-sizing: border-box;
    width: 100%;
  }

  .lbm-icon { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; }
  .lbm-chevron {
    font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
    margin-left: auto;
    transition: transform .2s;
  }
  :host([open]) .lbm-chevron { transform: rotate(180deg); }

  /* Variants */
  :host(:not([variant])) .lbm-btn,
  :host([variant="default"]) .lbm-btn {
    background: var(--white); border-color: var(--primary-20); color: var(--primary);
  }
  :host(:not([variant])) .lbm-btn:hover:not(:disabled),
  :host([variant="default"]) .lbm-btn:hover:not(:disabled) { background: var(--surface); }
  :host(:not([variant])) .lbm-btn:focus-visible,
  :host([variant="default"]) .lbm-btn:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary-20); }

  :host([variant="primary"]) .lbm-btn { background: var(--primary); border-color: var(--primary); color: var(--white); }
  :host([variant="primary"]) .lbm-btn:hover:not(:disabled) { background: var(--primary-dark); border-color: var(--primary-dark); }
  :host([variant="primary"]) .lbm-btn:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary); }

  :host([variant="accent"]) .lbm-btn { background: var(--accent); border-color: var(--accent); color: var(--white); }
  :host([variant="accent"]) .lbm-btn:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }
  :host([variant="accent"]) .lbm-btn:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--accent); }

  :host([variant="warn"]) .lbm-btn { background: var(--warn); border-color: var(--warn); color: var(--white); }
  :host([variant="warn"]) .lbm-btn:hover:not(:disabled) { background: var(--warn-hover); border-color: var(--warn-hover); }
  :host([variant="warn"]) .lbm-btn:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--warn); }

  /* Sizes */
  :host([size="large"])  .lbm-btn { height: 44px; padding: 0 16px; }
  :host([size="small"])  .lbm-btn { height: 30px; padding: 0 10px; font-size: 13px; }
  :host([size="xsmall"]) .lbm-btn { height: 24px; padding: 0 8px;  font-size: 12px; }

  /* Disabled */
  :host([disabled]) .lbm-btn { opacity: var(--disabled-op); cursor: not-allowed; pointer-events: none; }

`;


class LabosMenuButton extends HTMLElement {
  static get observedAttributes() { return ['label', 'icon', 'variant', 'size', 'disabled']; }

  constructor() {
    super();
    this._items = [];
    this._dd    = new LabosDropdown({ minWidth: 200 });
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }
  disconnectedCallback() { this._dd.close(); document.removeEventListener('click', this._onOutsideClick); }

  setItems(items) {
    this._items = items || [];
    if (this._dd.isOpen) this._dd.refresh(this._items, item => this._onItemSelect(item));
  }

  _onItemSelect(item) {
    this._close();
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: { label: item.label, value: item.value },
      bubbles: true, composed: true,
    }));
  }

  _onOutsideClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target) && !this._dd.getPortal()?.contains(e.target)) this._close();
  }

  _open() {
    this.setAttribute('open', '');
    const btn = this.shadowRoot.querySelector('.lbm-btn');
    this._dd.open(btn, this._items, item => this._onItemSelect(item));
    document.addEventListener('click', this._onOutsideClick);
  }

  _close() {
    this.removeAttribute('open');
    this._dd.close();
    document.removeEventListener('click', this._onOutsideClick);
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._dd.close();
    this.removeAttribute('open');
    const label = this.getAttribute('label') || '';
    const icon  = this.getAttribute('icon')  || '';
    this.shadowRoot.innerHTML = `
      <style>${MENU_BUTTON_CSS}</style>
      <button class="lbm-btn" ${this.hasAttribute('disabled') ? 'disabled' : ''}>
        ${icon ? `<span class="lbm-icon">${icon}</span>` : ''}
        <span class="lbm-label">${label}</span>
        <span class="lbm-chevron">keyboard_arrow_down</span>
      </button>
    `;
    this.shadowRoot.querySelector('.lbm-btn').addEventListener('click', e => {
      e.stopPropagation();
      if (this.hasAttribute('open')) this._close(); else this._open();
    });
  }
}
customElements.define('labos-menu-button', LabosMenuButton);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-ICON-MENU
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   icon      — Material icon name  (default: 'more_vert')
//   variant   — 'default' | 'primary' | 'accent' | 'warn'
//   size      — 'default' | 'large' | 'small' | 'xsmall'
//   direction — 'bottom-right' (default) | 'bottom-left' | 'top-right' | 'top-left'
//   disabled  — boolean presence
//
// JS API:
//   el.setItems([{ label, value, icon?, disabled? }])
//
// Events:
//   labos-select  — { label, value }
// ─────────────────────────────────────────────────────────────────────────────
const ICON_MENU_CSS = `
  ${HOST_BOX}
  :host { display: inline-block; }
  :host([hidden]) { display: none; }

  .lim-btn {
    width: 36px; height: 36px;
    display: inline-flex; align-items: center; justify-content: center;
    border: none; border-radius: 50%;
    background: transparent;
    cursor: pointer; padding: 0;
    color: var(--primary);
    transition: var(--transition);
  }
  .lim-btn:hover:not(:disabled) { background: rgba(38,95,104,.12); }
  .lim-btn:focus-visible { outline: none; box-shadow: 0 0 0 3px var(--primary-20); }

  .lim-icon { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; }

  /* Variants — icon color */
  :host([variant="accent"]) .lim-btn { color: var(--accent); }
  :host([variant="warn"])   .lim-btn { color: var(--warn); }
  :host([variant="warn"])   .lim-btn:hover:not(:disabled) { background: rgba(210,0,0,.10); }

  /* Sizes */
  :host([size="large"])  .lim-btn { width: 44px; height: 44px; }
  :host([size="large"])  .lim-icon { font-size: 24px; }
  :host([size="small"])  .lim-btn { width: 30px; height: 30px; }
  :host([size="xsmall"]) .lim-btn { width: 24px; height: 24px; }
  :host([size="xsmall"]) .lim-icon { font-size: 16px; }

  /* Disabled */
  :host([disabled]) .lim-btn { opacity: var(--disabled-op); cursor: not-allowed; pointer-events: none; }
`;

class LabosIconMenu extends HTMLElement {
  static get observedAttributes() { return ['icon', 'variant', 'size', 'direction', 'disabled']; }

  constructor() {
    super();
    this._items = [];
    this._dd    = new LabosDropdown({ minWidth: 200 });
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback()    { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }
  disconnectedCallback() { this._close(); }

  setItems(items) { this._items = items || []; }

  _onOutsideClick(e) {
    if (this.shadowRoot?.contains(e.target) || this._dd.getPortal()?.contains(e.target)) return;
    this._close();
  }

  _open() {
    this.setAttribute('open', '');
    const btn = this.shadowRoot.querySelector('.lim-btn');
    const dir = this.getAttribute('direction') || 'bottom-right';
    this._dd.open(btn, this._items, item => {
      this._close();
      this.dispatchEvent(new CustomEvent('labos-select', {
        detail: { label: item.label, value: item.value },
        bubbles: true, composed: true,
      }));
    }, { direction: dir });
    setTimeout(() => document.addEventListener('click', this._onOutsideClick));
  }

  _close() {
    this.removeAttribute('open');
    this._dd.close();
    document.removeEventListener('click', this._onOutsideClick);
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const icon = this.getAttribute('icon') || 'more_vert';
    this.shadowRoot.innerHTML = `
      <style>${ICON_MENU_CSS}</style>
      <button class="lim-btn" ${this.hasAttribute('disabled') ? 'disabled' : ''}>
        <span class="lim-icon">${icon}</span>
      </button>
    `;
    this.shadowRoot.querySelector('.lim-btn').addEventListener('click', e => {
      e.stopPropagation();
      this.hasAttribute('open') ? this._close() : this._open();
    });
  }
}
customElements.define('labos-icon-menu', LabosIconMenu);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-SPLIT-BUTTON
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   label    — main button text
//   icon     — optional leading Material icon name
//   variant  — 'default' | 'primary' | 'accent' | 'warn'  (default: 'default')
//   size     — 'default' | 'large' | 'small' | 'xsmall'
//   disabled — boolean presence
//
// JS API:
//   el.setItems([{ label, value, icon?, disabled? }])
//
// Events:
//   labos-action  — {} (main button clicked)
//   labos-select  — { label, value } (menu item selected)
// ─────────────────────────────────────────────────────────────────────────────
const SPLIT_BUTTON_CSS = `
  ${HOST_BOX}
  :host { display: inline-block; position: relative; }
  :host([hidden]) { display: none; }

  .lbs-wrap { display: inline-flex; align-items: stretch; }

  .lbs-main, .lbs-arrow {
    display: inline-flex; align-items: center;
    border: 1px solid transparent;
    font-family: var(--font); font-size: 14px; font-weight: 400;
    cursor: pointer; white-space: nowrap;
    transition: var(--transition);
    box-sizing: border-box;
  }

  .lbs-main {
    gap: 7px;
    height: 36px; padding: 0 12px;
    border-radius: var(--radius) 0 0 var(--radius);
    border-right: none;
  }

  .lbs-arrow {
    justify-content: center;
    height: 36px; width: 22px; padding: 0;
    border-radius: 0 var(--radius) var(--radius) 0;
    border-left: none;
  }

  .lbs-divider { width: 1px; flex-shrink: 0; align-self: stretch; }

  .lbs-icon    { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; }
  .lbs-chevron {
    font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1;
    transition: transform .2s;
  }
  :host([open]) .lbs-chevron { transform: rotate(180deg); }

  /* Variants */
  :host(:not([variant])) .lbs-main,
  :host(:not([variant])) .lbs-arrow,
  :host([variant="default"]) .lbs-main,
  :host([variant="default"]) .lbs-arrow {
    background: var(--white); border-color: var(--primary-20); color: var(--primary);
  }
  :host(:not([variant])) .lbs-divider,
  :host([variant="default"]) .lbs-divider { background: var(--primary-20); }
  :host(:not([variant])) .lbs-main:hover:not(:disabled),
  :host(:not([variant])) .lbs-arrow:hover:not(:disabled),
  :host([variant="default"]) .lbs-main:hover:not(:disabled),
  :host([variant="default"]) .lbs-arrow:hover:not(:disabled) { background: var(--surface); }

  :host([variant="primary"]) .lbs-main,
  :host([variant="primary"]) .lbs-arrow { background: var(--primary); border-color: var(--primary); color: var(--white); }
  :host([variant="primary"]) .lbs-divider { background: var(--primary-dark); }
  :host([variant="primary"]) .lbs-main:hover:not(:disabled),
  :host([variant="primary"]) .lbs-arrow:hover:not(:disabled) { background: var(--primary-dark); border-color: var(--primary-dark); }

  :host([variant="accent"]) .lbs-main,
  :host([variant="accent"]) .lbs-arrow { background: var(--accent); border-color: var(--accent); color: var(--white); }
  :host([variant="accent"]) .lbs-divider { background: var(--accent-hover); }
  :host([variant="accent"]) .lbs-main:hover:not(:disabled),
  :host([variant="accent"]) .lbs-arrow:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }

  :host([variant="warn"]) .lbs-main,
  :host([variant="warn"]) .lbs-arrow { background: var(--warn); border-color: var(--warn); color: var(--white); }
  :host([variant="warn"]) .lbs-divider { background: var(--warn-hover); }
  :host([variant="warn"]) .lbs-main:hover:not(:disabled),
  :host([variant="warn"]) .lbs-arrow:hover:not(:disabled) { background: var(--warn-hover); border-color: var(--warn-hover); }

  /* Sizes */
  :host([size="large"])  .lbs-main  { height: 44px; padding: 0 16px; }
  :host([size="large"])  .lbs-arrow { height: 44px; width: 34px; }
  :host([size="small"])  .lbs-main  { height: 30px; padding: 0 10px; font-size: 13px; }
  :host([size="small"])  .lbs-arrow { height: 30px; width: 26px; }
  :host([size="xsmall"]) .lbs-main  { height: 24px; padding: 0 8px; font-size: 12px; }
  :host([size="xsmall"]) .lbs-arrow { height: 24px; width: 22px; }

  /* Focus */
  :host(:not([variant])) .lbs-main:focus-visible,    :host(:not([variant])) .lbs-arrow:focus-visible,
  :host([variant="default"]) .lbs-main:focus-visible,
  :host([variant="default"]) .lbs-arrow:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary-20); }
  :host([variant="primary"]) .lbs-main:focus-visible,
  :host([variant="primary"]) .lbs-arrow:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary); }
  :host([variant="accent"]) .lbs-main:focus-visible,
  :host([variant="accent"]) .lbs-arrow:focus-visible  { outline: none; box-shadow: 0 0 7px 0 var(--accent); }
  :host([variant="warn"]) .lbs-main:focus-visible,
  :host([variant="warn"]) .lbs-arrow:focus-visible    { outline: none; box-shadow: 0 0 7px 0 var(--warn); }

  /* Disabled */
  :host([disabled]) .lbs-main,
  :host([disabled]) .lbs-arrow { opacity: var(--disabled-op); cursor: not-allowed; pointer-events: none; }

`;


class LabosSplitButton extends HTMLElement {
  static get observedAttributes() { return ['label', 'icon', 'variant', 'size', 'disabled']; }

  constructor() {
    super();
    this._items = [];
    this._dd    = new LabosDropdown({ minWidth: 200 });
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback() { this._render(); }
  attributeChangedCallback(name) {
    if (name === 'row-drag') this._rowDrag = this.hasAttribute('row-drag');
    if (this.shadowRoot) this._render();
  }
  disconnectedCallback() { this._dd.close(); document.removeEventListener('click', this._onOutsideClick); }

  setItems(items) {
    this._items = items || [];
    if (this._dd.isOpen) this._dd.refresh(this._items, item => this._onItemSelect(item));
  }

  _onItemSelect(item) {
    this._close();
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: { label: item.label, value: item.value },
      bubbles: true, composed: true,
    }));
  }

  _onOutsideClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target) && !this._dd.getPortal()?.contains(e.target)) this._close();
  }

  _open() {
    this.setAttribute('open', '');
    const wrap = this.shadowRoot.querySelector('.lbs-wrap');
    this._dd.open(wrap, this._items, item => this._onItemSelect(item));
    document.addEventListener('click', this._onOutsideClick);
  }

  _close() {
    this.removeAttribute('open');
    this._dd.close();
    document.removeEventListener('click', this._onOutsideClick);
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._dd.close();
    this.removeAttribute('open');
    const label = this.getAttribute('label') || '';
    const icon  = this.getAttribute('icon')  || '';
    this.shadowRoot.innerHTML = `
      <style>${SPLIT_BUTTON_CSS}</style>
      <div class="lbs-wrap">
        <button class="lbs-main" ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          ${icon ? `<span class="lbs-icon">${icon}</span>` : ''}
          <span class="lbs-label">${label}</span>
        </button>
        <div class="lbs-divider"></div>
        <button class="lbs-arrow" ${this.hasAttribute('disabled') ? 'disabled' : ''}>
          <span class="lbs-chevron">keyboard_arrow_down</span>
        </button>
      </div>
    `;
    this.shadowRoot.querySelector('.lbs-main').addEventListener('click', e => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('labos-action', { bubbles: true, composed: true }));
    });
    this.shadowRoot.querySelector('.lbs-arrow').addEventListener('click', e => {
      e.stopPropagation();
      if (this.hasAttribute('open')) this._close(); else this._open();
    });
  }
}
customElements.define('labos-split-button', LabosSplitButton);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BUTTON-MENU
// ═══════════════════════════════════════════════════════════════════════════════
//
// Unified menu button matching the Figma "Button menu" component.
//
// type="submenu" (default) — single button: [icon label ▾]
// type="menu"              — split button:  [icon label | ▾]  or  [icon | ▾]
//
// Usage:
//   <labos-button-menu type="menu" icon="print" label="Print"></labos-button-menu>
//   <labos-button-menu type="submenu" label="Actions" icon="tune"></labos-button-menu>
//   el.setItems([{ label, value, icon?, disabled? }]);
//   el.addEventListener('labos-select', e => ...); // dropdown item chosen
//   el.addEventListener('labos-click',  e => ...); // main action (type="menu" only)
//
// Attrs  : type (menu|submenu), icon, label, variant, size, disabled
// Events : labos-select → { label, value } | labos-click
//
const BUTTON_MENU_CSS = `
  ${HOST_BOX}
  :host { display: inline-block; position: relative; }
  :host([hidden]) { display: none; }

  .bm-wrap { display: inline-flex; align-items: stretch; }
  .bm-main, .bm-arrow, .bm-single {
    display: inline-flex; align-items: center;
    border: 1px solid transparent;
    font-family: var(--font); font-size: 14px; font-weight: 400;
    cursor: pointer; white-space: nowrap;
    transition: var(--transition); box-sizing: border-box;
  }
  .bm-icon    { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; }
  .bm-chevron { font-family: 'Material Icons'; font-size: var(--lb-icon-size, 18px); font-weight: 400; font-style: normal; line-height: 1; transition: transform .2s; }
  :host([open]) .bm-chevron { transform: rotate(180deg); }

  /* Menu (split) */
  .bm-main {
    gap: 7px; height: 36px; padding: 0 12px;
    border-radius: var(--radius) 0 0 var(--radius);
    border-right: none;
  }
  .bm-main--alone { width: 36px; padding: 0; justify-content: center; }
  .bm-divider { width: 1px; flex-shrink: 0; align-self: stretch; }
  .bm-arrow {
    justify-content: center;
    height: 36px; width: 22px; padding: 0;
    border-radius: 0 var(--radius) var(--radius) 0;
    border-left: none;
  }

  /* Submenu (single) */
  .bm-single { gap: 7px; height: 36px; padding: 0 8px 0 12px; border-radius: var(--radius); }

  /* Variants */
  :host(:not([variant])) .bm-main, :host(:not([variant])) .bm-arrow, :host(:not([variant])) .bm-single,
  :host([variant="default"]) .bm-main, :host([variant="default"]) .bm-arrow, :host([variant="default"]) .bm-single {
    background: var(--white); border-color: var(--primary-20); color: var(--primary);
  }
  :host(:not([variant])) .bm-divider, :host([variant="default"]) .bm-divider { background: var(--primary-20); }
  :host(:not([variant])) .bm-main:hover:not(:disabled), :host(:not([variant])) .bm-arrow:hover:not(:disabled),
  :host(:not([variant])) .bm-single:hover:not(:disabled),
  :host([variant="default"]) .bm-main:hover:not(:disabled), :host([variant="default"]) .bm-arrow:hover:not(:disabled),
  :host([variant="default"]) .bm-single:hover:not(:disabled) { background: var(--surface); }

  :host([variant="primary"]) .bm-main, :host([variant="primary"]) .bm-arrow, :host([variant="primary"]) .bm-single
    { background: var(--primary); border-color: var(--primary); color: var(--white); }
  :host([variant="primary"]) .bm-divider { background: var(--primary-dark); }
  :host([variant="primary"]) .bm-main:hover:not(:disabled), :host([variant="primary"]) .bm-arrow:hover:not(:disabled),
  :host([variant="primary"]) .bm-single:hover:not(:disabled) { background: var(--primary-dark); border-color: var(--primary-dark); }

  :host([variant="accent"]) .bm-main, :host([variant="accent"]) .bm-arrow, :host([variant="accent"]) .bm-single
    { background: var(--accent); border-color: var(--accent); color: var(--white); }
  :host([variant="accent"]) .bm-divider { background: var(--accent-hover); }
  :host([variant="accent"]) .bm-main:hover:not(:disabled), :host([variant="accent"]) .bm-arrow:hover:not(:disabled),
  :host([variant="accent"]) .bm-single:hover:not(:disabled) { background: var(--accent-hover); border-color: var(--accent-hover); }

  :host([variant="warn"]) .bm-main, :host([variant="warn"]) .bm-arrow, :host([variant="warn"]) .bm-single
    { background: var(--warn); border-color: var(--warn); color: var(--white); }
  :host([variant="warn"]) .bm-divider { background: var(--warn-hover); }
  :host([variant="warn"]) .bm-main:hover:not(:disabled), :host([variant="warn"]) .bm-arrow:hover:not(:disabled),
  :host([variant="warn"]) .bm-single:hover:not(:disabled) { background: var(--warn-hover); border-color: var(--warn-hover); }

  /* Sizes */
  :host([size="large"])  .bm-main   { height: 44px; padding: 0 16px; }
  :host([size="large"])  .bm-main.bm-main--alone { width: 44px; padding: 0; }
  :host([size="large"])  .bm-arrow  { height: 44px; }
  :host([size="large"])  .bm-single { height: 44px; padding: 0 8px 0 16px; }
  :host([size="small"])  .bm-main   { height: 30px; padding: 0 10px; font-size: 13px; }
  :host([size="small"])  .bm-main.bm-main--alone { width: 30px; padding: 0; }
  :host([size="small"])  .bm-arrow  { height: 30px; }
  :host([size="small"])  .bm-single { height: 30px; padding: 0 8px 0 10px; font-size: 13px; }
  :host([size="xsmall"]) .bm-main   { height: 24px; padding: 0 8px; font-size: 12px; }
  :host([size="xsmall"]) .bm-main.bm-main--alone { width: 24px; padding: 0; }
  :host([size="xsmall"]) .bm-arrow  { height: 24px; }
  :host([size="xsmall"]) .bm-single { height: 24px; padding: 0 8px; font-size: 12px; }

  /* Focus */
  :host(:not([variant])) .bm-main:focus-visible, :host(:not([variant])) .bm-arrow:focus-visible,
  :host(:not([variant])) .bm-single:focus-visible,
  :host([variant="default"]) .bm-main:focus-visible, :host([variant="default"]) .bm-arrow:focus-visible,
  :host([variant="default"]) .bm-single:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary-20); }
  :host([variant="primary"]) .bm-main:focus-visible, :host([variant="primary"]) .bm-arrow:focus-visible,
  :host([variant="primary"]) .bm-single:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--primary); }
  :host([variant="accent"]) .bm-main:focus-visible, :host([variant="accent"]) .bm-arrow:focus-visible,
  :host([variant="accent"]) .bm-single:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--accent); }
  :host([variant="warn"]) .bm-main:focus-visible, :host([variant="warn"]) .bm-arrow:focus-visible,
  :host([variant="warn"]) .bm-single:focus-visible { outline: none; box-shadow: 0 0 7px 0 var(--warn); }

  /* Disabled */
  :host([disabled]) .bm-wrap,
  :host([disabled]) .bm-single { opacity: var(--disabled-op); cursor: not-allowed; pointer-events: none; }
`;

class LabosButtonMenu extends HTMLElement {
  static get observedAttributes() { return ['label', 'icon', 'type', 'variant', 'size', 'disabled']; }

  constructor() {
    super();
    this._items = [];
    this._dd    = new LabosDropdown({ minWidth: 180 });
    this._onOutsideClick = this._onOutsideClick.bind(this);
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._render();
  }
  attributeChangedCallback() { if (this.shadowRoot) this._render(); }
  disconnectedCallback() { this._dd.close(); document.removeEventListener('click', this._onOutsideClick); }

  setItems(items) {
    this._items = items || [];
    if (this._dd.isOpen) this._dd.refresh(this._items, item => this._onItemSelect(item));
  }

  _onItemSelect(item) {
    this._close();
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: { label: item.label, value: item.value },
      bubbles: true, composed: true,
    }));
  }
  _onOutsideClick(e) {
    if (!this.contains(e.target) && !this.shadowRoot.contains(e.target) && !this._dd.getPortal()?.contains(e.target)) this._close();
  }
  _open() {
    this.setAttribute('open', '');
    this._dd.open(this.shadowRoot.querySelector('.bm-wrap'), this._items, item => this._onItemSelect(item));
    document.addEventListener('click', this._onOutsideClick);
  }
  _close() {
    this.removeAttribute('open');
    this._dd.close();
    document.removeEventListener('click', this._onOutsideClick);
  }

  _render() {
    if (!this.shadowRoot) return;
    this._dd.close(); this.removeAttribute('open');
    const type  = this.getAttribute('type') || 'submenu';
    const icon  = this.getAttribute('icon')  || '';
    const label = this.getAttribute('label') || '';
    const alone = type === 'menu' && icon && !label;

    const iconHtml    = icon  ? `<span class="bm-icon">${icon}</span>` : '';
    const labelHtml   = label ? `<span>${label}</span>` : '';
    const chevronHtml = `<span class="bm-chevron">keyboard_arrow_down</span>`;

    const inner = type === 'menu'
      ? `<button class="bm-main${alone ? ' bm-main--alone' : ''}">${iconHtml}${labelHtml}</button>
         <div class="bm-divider"></div>
         <button class="bm-arrow">${chevronHtml}</button>`
      : `<button class="bm-single">${iconHtml}${labelHtml}${chevronHtml}</button>`;

    this.shadowRoot.innerHTML = `<style>${BUTTON_MENU_CSS}</style><div class="bm-wrap">${inner}</div>`;

    const mainBtn = this.shadowRoot.querySelector('.bm-main');
    if (mainBtn) mainBtn.addEventListener('click', e => {
      e.stopPropagation();
      this.dispatchEvent(new CustomEvent('labos-click', { bubbles: true, composed: true }));
    });
    const toggleEl = this.shadowRoot.querySelector('.bm-arrow') || this.shadowRoot.querySelector('.bm-single');
    if (toggleEl) toggleEl.addEventListener('click', e => {
      e.stopPropagation();
      if (this.hasAttribute('open')) this._close(); else this._open();
    });
  }
}
customElements.define('labos-button-menu', LabosButtonMenu);

// ── LabosIcon ──────────────────────────────────────────────────────────────
const LABOS_ICON_CSS = `
  :host {
    display: inline-flex;
    align-items: center;
    --_size:   18px;
    --_color:  #666666;
    --_cursor: default;
  }
  :host([clickable]) {
    --_color:  #265F68;
    --_cursor: pointer;
  }
  span {
    font-family: 'Material Icons';
    font-size:   var(--_size);
    color:       var(--_color);
    cursor:      var(--_cursor);
    line-height: 1;
    user-select: none;
    font-style:  normal;
    font-weight: normal;
    letter-spacing: normal;
    text-transform: none;
    white-space: nowrap;
    -webkit-font-feature-settings: 'liga';
    -webkit-font-smoothing: antialiased;
  }
`;

class LabosIcon extends HTMLElement {
  static get observedAttributes() { return ['name', 'size', 'color', 'clickable']; }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>${LABOS_ICON_CSS}</style><span role="img" aria-hidden="true"></span>`;
    }
    this._update();
  }
  attributeChangedCallback() { if (this.shadowRoot) this._update(); }

  _update() {
    const size  = this.getAttribute('size');
    const color = this.getAttribute('color');
    if (size)  this.style.setProperty('--_size',  size + 'px');
    else       this.style.removeProperty('--_size');
    if (color) this.style.setProperty('--_color', color);
    else       this.style.removeProperty('--_color');
    this.shadowRoot.querySelector('span').textContent = this.getAttribute('name') || '';
  }
}
customElements.define('labos-icon', LabosIcon);

// ── LabosToast ─────────────────────────────────────────────────────────────
const TOAST_CSS = `
  ${HOST_BOX}
  :host {
    position: fixed;
    top: 58px;
    right: 10px;
    z-index: 9000;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 8px;
    pointer-events: none;
  }
  .toast {
    display: flex;
    align-items: center;
    height: 48px;
    padding: 0 12px 0 16px;
    gap: 12px;
    border-radius: var(--radius);
    box-shadow: var(--overlay-shadow);
    font-family: var(--font);
    font-size: 14px;
    font-weight: 600;
    color: #fff;
    pointer-events: auto;
    white-space: nowrap;
    animation: toast-in 220ms ease forwards;
  }
  .toast--out { animation: toast-out 220ms ease forwards; }

  .toast--success { background: var(--green); }
  .toast--warning { background: var(--orange); }
  .toast--info    { background: var(--blue); }
  .toast--error   { background: var(--red-darken-15); }

  .toast__text  { flex: 1; }
  .toast__close {
    flex-shrink: 0;
    display: inline-flex; align-items: center;
    background: none; border: none; padding: 0;
    color: #fff; cursor: pointer;
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400;
    opacity: 0.85; line-height: 1;
  }
  .toast__close:hover { opacity: 1; }

  @keyframes toast-in {
    from { transform: translateY(-100%); opacity: 0; }
    to   { transform: translateY(0);    opacity: 1; }
  }
  @keyframes toast-out {
    from { transform: translateY(0);    opacity: 1; }
    to   { transform: translateY(-100%); opacity: 0; }
  }
`;

class LabosToast extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>${TOAST_CSS}</style>`;
    }
  }

  show(message, type = 'info', duration = 3000) {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this.shadowRoot.innerHTML = `<style>${TOAST_CSS}</style>`;
    }
    const el = document.createElement('div');
    el.className = `toast toast--${type}`;
    el.innerHTML = `
      <span class="toast__text">${message}</span>
      <button class="toast__close" aria-label="Close">close</button>
    `;
    this.shadowRoot.appendChild(el);

    const dismiss = () => {
      if (el.classList.contains('toast--out')) return;
      el.classList.add('toast--out');
      el.addEventListener('animationend', () => el.remove(), { once: true });
    };

    el.querySelector('.toast__close').addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
  }

  // Static helper — auto-creates the host element if absent from the page
  static show(message, type = 'info', duration = 3000) {
    let host = document.querySelector('labos-toast');
    if (!host) {
      host = document.createElement('labos-toast');
      document.body.appendChild(host);
    }
    host.show(message, type, duration);
  }
}
customElements.define('labos-toast', LabosToast);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-TABS  <labos-tabs>
// ───────────────────────────────────────────────────────────────────────────────
// JS API:
//   setTabs([{ label, value?, disabled?, selected? }])
//   selectedIndex  — get/set
//   selectedValue  — get
// Events:
//   labos-change → { index, label, value }
// ═══════════════════════════════════════════════════════════════════════════════

const TABS_CSS = `
  ${HOST_BOX}
  :host { display: block; }

  .tabs-bar {
    display: flex;
    align-items: flex-end;
    width: 100%;
  }

  .tab {
    height: 48px;
    padding: 0 24px;
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    background: none;
    border: none;
    border-bottom: 1px solid #e0e0e0;
    outline: none;
    font-family: var(--font, 'Open Sans', sans-serif);
    font-size: 14px;
    font-weight: 600;
    color: var(--primary, #265F68);
    white-space: nowrap;
    box-sizing: border-box;
    transition: background 120ms;
  }

  .tab:hover:not([aria-selected="true"]):not([disabled]) {
    background: rgba(38,95,104,.06);
  }
  .tab:focus-visible:not([disabled]) {
    background: rgba(38,95,104,.10);
  }
  .tab[aria-selected="true"] {
    border-bottom: 2px solid var(--primary, #265F68);
  }
  .tab[disabled] {
    opacity: 0.4;
    pointer-events: none;
    cursor: default;
  }

  .tabs-filler {
    flex: 1;
    height: 48px;
    border-bottom: 1px solid #e0e0e0;
    box-sizing: border-box;
  }
`;

class LabosTabs extends HTMLElement {
  constructor() {
    super();
    this._tabs = [];
    this._selectedIndex = 0;
  }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._render();
  }

  setTabs(tabs) {
    this._tabs = tabs;
    const presel = tabs.findIndex(t => t.selected);
    this._selectedIndex = presel >= 0 ? presel : 0;
    this._render();
  }

  get selectedIndex() { return this._selectedIndex; }
  set selectedIndex(i) { this._select(i); }

  get selectedValue() {
    const t = this._tabs[this._selectedIndex];
    return t ? (t.value ?? t.label) : null;
  }

  _select(i, focusAfter = false) {
    if (i < 0 || i >= this._tabs.length || this._tabs[i]?.disabled) return;
    this._selectedIndex = i;
    this._updateDOM();
    if (focusAfter) this.shadowRoot?.querySelectorAll('.tab')[i]?.focus();
    this.dispatchEvent(new CustomEvent('labos-change', {
      detail: { index: i, label: this._tabs[i].label, value: this._tabs[i].value ?? this._tabs[i].label },
      bubbles: true, composed: true,
    }));
  }

  _updateDOM() {
    if (!this.shadowRoot) return;
    this.shadowRoot.querySelectorAll('.tab').forEach((btn, i) => {
      const sel = i === this._selectedIndex;
      btn.setAttribute('aria-selected', String(sel));
      btn.tabIndex = sel ? 0 : -1;
    });
  }

  _render() {
    if (!this.shadowRoot) return;

    const html = this._tabs.map((t, i) => {
      const sel = i === this._selectedIndex;
      return `<button class="tab" role="tab" data-index="${i}"
        tabindex="${sel ? 0 : -1}"
        aria-selected="${sel}"
        ${t.disabled ? 'disabled' : ''}
      >${t.label}</button>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${TABS_CSS}</style>
      <div class="tabs-bar" role="tablist">
        ${html}
        <div class="tabs-filler" aria-hidden="true"></div>
      </div>`;

    this.shadowRoot.querySelectorAll('.tab').forEach(btn => {
      btn.addEventListener('click', () => this._select(+btn.dataset.index));
    });

    this.shadowRoot.querySelector('.tabs-bar').addEventListener('keydown', e => {
      if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
      e.preventDefault();
      const fi = +(this.shadowRoot.querySelector('.tab:focus')?.dataset.index ?? this._selectedIndex);
      const step = e.key === 'ArrowRight' ? 1 : -1;
      let ni = fi + step;
      while (ni >= 0 && ni < this._tabs.length && this._tabs[ni]?.disabled) ni += step;
      if (ni >= 0 && ni < this._tabs.length) this._select(ni, true);
    });
  }
}
customElements.define('labos-tabs', LabosTabs);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-TAB-PANEL  <labos-tab-panel>
// ───────────────────────────────────────────────────────────────────────────────
// Container for tab content. Enforces padding-top: 20px, padding: 0 elsewhere.
// Content is slotted — each screen controls its own markup inside.
// ═══════════════════════════════════════════════════════════════════════════════

class LabosTabPanel extends HTMLElement {
  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 20px 0 0 0 !important; }
      </style>
      <slot></slot>`;
  }
}
customElements.define('labos-tab-panel', LabosTabPanel);


// ═══════════════════════════════════════════════════════════════════════════════
// LabosPopover  <labos-popover>
// ─────────────────────────────────────────────────────────────────────────────
// API:
//   show(triggerEl)   — anchor to triggerEl and make visible
//   hide()            — hide
//   toggle(triggerEl) — show if hidden, hide if visible
//   size attr         — 'small' (default, 220px) | 'medium' (320px) | 'large' (480px)
//   Events:
//     'labos-open'    → fired when popover opens
//     'labos-close'   → fired when popover closes
// ═══════════════════════════════════════════════════════════════════════════════

const _POP_W    = { small: 350, medium: 520, large: 660 };
const _POP_GAP  = 8;   // px gap between trigger edge and popover edge
const _POP_SAFE = 16;  // min px from viewport edge
const _POP_ARR  = 14;  // arrow square side (px); half sticks out past body

const POPOVER_CSS = `
  :host { display: contents; }
  [hidden] { display: none !important; }

  .pop-wrap {
    position: fixed;
    z-index: 2000;
    box-sizing: border-box;
    /* Unified shadow traces the merged body+arrow silhouette */
    filter: drop-shadow(0 4px 4px rgba(0,0,0,.25));
  }
  /* Extra space for the arrow that protrudes outside the body */
  .pop-wrap--down { padding-top:    7px; }
  .pop-wrap--up   { padding-bottom: 7px; }

  .pop-body {
    background: #fff;
    border-radius: 4px;
    padding: 16px;
    box-sizing: border-box;
    font-family: var(--font,'Open Sans','Segoe UI',Arial,sans-serif);
    font-size: 14px;
    color: #333;
    line-height: 1.5;
    position: relative;
    z-index: 1;      /* sits above arrow so it clips the arrow's inner half */
  }

  /* Rotated square: outer half visible as triangle, inner half covered by body */
  .pop-arrow {
    position: absolute;
    width: 14px; height: 14px;
    background: #fff;
    transform: rotate(45deg);
    z-index: 0;
  }
  .pop-wrap--down .pop-arrow { top: 0; }    /* arrow above body → points up   */
  .pop-wrap--up   .pop-arrow { bottom: 0; } /* arrow below body → points down */

  @keyframes _pop-down { from { opacity:0; transform:translateY(-5px); } to { opacity:1; transform:none; } }
  @keyframes _pop-up   { from { opacity:0; transform:translateY( 5px); } to { opacity:1; transform:none; } }
  .pop-wrap--down { animation: _pop-down 140ms ease; }
  .pop-wrap--up   { animation: _pop-up   140ms ease; }
`;

class LabosPopover extends HTMLElement {
  constructor() {
    super();
    this._open       = false;
    this._triggerEl  = null;
    this._onDocClick = this._onDocClick.bind(this);
    this._onResize   = this._onResize.bind(this);
  }

  connectedCallback() {
    if (this.shadowRoot) return;
    this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `
      <style>${POPOVER_CSS}</style>
      <div class="pop-wrap" hidden>
        <div class="pop-arrow"></div>
        <div class="pop-body"><slot></slot></div>
      </div>`;
  }

  disconnectedCallback() {
    document.removeEventListener('click', this._onDocClick, true);
    window.removeEventListener('resize',  this._onResize);
  }

  get size() { return this.getAttribute('size') || 'small'; }

  show(triggerEl) {
    this._triggerEl = triggerEl;
    const wrap = this._wrap;
    // Render invisible first so offsetHeight is measurable before final position
    wrap.style.visibility = 'hidden';
    wrap.removeAttribute('hidden');
    this._position();
    wrap.style.visibility = '';
    // Force animation restart even when same direction class was already set
    wrap.style.animation = 'none';
    void wrap.offsetHeight;
    wrap.style.animation = '';
    this._open = true;
    document.addEventListener('click', this._onDocClick, true);
    window.addEventListener('resize',  this._onResize);
    this.dispatchEvent(new CustomEvent('labos-open', { bubbles: true, composed: true }));
  }

  hide() {
    if (!this._open) return;
    this._wrap.setAttribute('hidden', '');
    this._open = false;
    document.removeEventListener('click', this._onDocClick, true);
    window.removeEventListener('resize',  this._onResize);
    this.dispatchEvent(new CustomEvent('labos-close', { bubbles: true, composed: true }));
  }

  toggle(triggerEl) {
    this._open ? this.hide() : this.show(triggerEl);
  }

  get _wrap()  { return this.shadowRoot.querySelector('.pop-wrap');  }
  get _arrow() { return this.shadowRoot.querySelector('.pop-arrow'); }

  _position() {
    const tr    = this._triggerEl.getBoundingClientRect();
    const vw    = window.innerWidth;
    const vh    = window.innerHeight;
    const W     = _POP_W[this.size] || _POP_W.small;
    const AHALF = _POP_ARR / 2;
    const wrap  = this._wrap;
    const arrow = this._arrow;

    // Direction: trigger in top viewport half → open down; bottom half → open up
    const goDown = (tr.top + tr.height / 2) < vh / 2;
    wrap.classList.toggle('pop-wrap--down',  goDown);
    wrap.classList.toggle('pop-wrap--up',   !goDown);

    // Horizontal: center popover on trigger, clamp within safe margins
    const trigCX = tr.left + tr.width / 2;
    let   left   = trigCX - W / 2;
    left = Math.max(_POP_SAFE, Math.min(left, vw - _POP_SAFE - W));
    wrap.style.width = W + 'px';
    wrap.style.left  = left + 'px';

    // Arrow: keep aligned to trigger center, clamped 8px from popover corners
    let arrowLeft = trigCX - left - AHALF;
    arrowLeft = Math.max(8, Math.min(arrowLeft, W - 8 - _POP_ARR));
    arrow.style.left = arrowLeft + 'px';

    // Vertical: for upward case, measure height first, then clamp to safe margins
    if (goDown) {
      const top = tr.bottom + _POP_GAP;
      wrap.style.top = Math.min(top, vh - _POP_SAFE - wrap.offsetHeight) + 'px';
    } else {
      const h   = wrap.offsetHeight;
      const top = tr.top - h - _POP_GAP;
      wrap.style.top = Math.max(_POP_SAFE, top) + 'px';
    }
  }

  _onDocClick(e) {
    if (!this._open) return;
    const path = e.composedPath();
    const inSelf    = path.includes(this) || path.some(n => n === this.shadowRoot);
    const inTrigger = this._triggerEl && path.includes(this._triggerEl);
    if (!inSelf && !inTrigger) this.hide();
  }

  _onResize() {
    if (this._open) this._position();
  }
}

customElements.define('labos-popover', LabosPopover);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-TOGGLE
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   label    — visible text label (optional)
//   checked  — boolean presence; set/remove to toggle
//   disabled — boolean presence
//
// Events:
//   labos-change  — { checked: bool }
// ─────────────────────────────────────────────────────────────────────────────
const TOGGLE_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; align-items: center; cursor: pointer; }
  :host([disabled]) { opacity: 0.38; pointer-events: none; }

  .lbt {
    display: inline-flex; align-items: center; gap: 8px;
    cursor: pointer; user-select: none;
    font-family: var(--font); font-size: 14px; color: var(--black);
  }

  .lbt__native {
    position: absolute; opacity: 0; width: 0; height: 0; pointer-events: none;
  }

  .lbt__track {
    position: relative;
    width: 36px; height: 20px;
    flex-shrink: 0;
    overflow: visible;
  }

  .lbt__track::before {
    content: '';
    position: absolute;
    top: 3px; left: 0;
    width: 36px; height: 14px;
    border-radius: 7px;
    background: rgba(51, 51, 51, 0.5);
    transition: background 200ms ease;
  }

  .lbt__thumb {
    position: absolute;
    top: 0; left: 0;
    width: 20px; height: 20px;
    border-radius: 50%;
    background: #ffffff;
    box-shadow: 0 1px 1px rgba(0,0,0,.1);
    transition: transform 200ms ease, background 200ms ease;
  }

  .lbt__native:checked ~ .lbt__track::before { background: rgba(38, 95, 104, 0.5); }
  .lbt__native:checked ~ .lbt__track .lbt__thumb { transform: translateX(16px); background: var(--primary, #265F68); }
`;

class LabosToggle extends HTMLElement {
  static get observedAttributes() { return ['checked', 'disabled', 'label']; }

  connectedCallback() { this._render(); }

  attributeChangedCallback(name, _, val) {
    if (!this.shadowRoot) return;
    const input = this.shadowRoot.querySelector('.lbt__native');
    if (!input) return;
    if (name === 'checked')  input.checked  = val !== null;
    if (name === 'disabled') input.disabled = val !== null;
    if (name === 'label') {
      const el = this.shadowRoot.querySelector('.lbt__label');
      if (el) el.textContent = val || '';
    }
  }

  get checked() { return this.hasAttribute('checked'); }
  set checked(v) { v ? this.setAttribute('checked', '') : this.removeAttribute('checked'); }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const label    = this.getAttribute('label') || '';
    const checked  = this.hasAttribute('checked');
    const disabled = this.hasAttribute('disabled');

    this.shadowRoot.innerHTML = `<style>${TOGGLE_CSS}</style>
      <label class="lbt">
        <input type="checkbox" class="lbt__native"
          ${checked  ? 'checked'  : ''}
          ${disabled ? 'disabled' : ''}>
        <span class="lbt__track">
          <span class="lbt__thumb"></span>
        </span>
        ${label ? `<span class="lbt__label">${label}</span>` : ''}
      </label>`;

    const input = this.shadowRoot.querySelector('.lbt__native');
    input.addEventListener('change', () => {
      input.checked ? this.setAttribute('checked', '') : this.removeAttribute('checked');
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { checked: input.checked },
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define('labos-toggle', LabosToggle);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-TEXT-HEADER
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   type      — 'h1'|'h2'|'h3'|'h4'|'h5'  (default: h1)  case-insensitive
//   weight    — '400'|'600'|'700'           (default: 600)
//   mandatory — boolean presence; shows red corner-mark
//
// Slot: heading text
// ─────────────────────────────────────────────────────────────────────────────
const TEXT_HEADER_CSS = `
  ${HOST_BOX}
  :host { display: inline-flex; }

  .lth {
    display: inline-flex;
    align-items: flex-end;
    gap: 3px;
    padding-bottom: 10px;
  }

  .lth__text {
    font-family: var(--font);
    color: var(--headers, #555555);
    font-weight: 600;
    line-height: 1;
    letter-spacing: 0;
    font-size: 28px;
  }

  :host([type="h2" i]) .lth__text { font-size: 22px; }
  :host([type="h3" i]) .lth__text { font-size: 18px; }
  :host([type="h4" i]) .lth__text { font-size: 16px; }
  :host([type="h5" i]) .lth__text { font-size: 14px; }

  :host([weight="400"]) .lth__text { font-weight: 400; }
  :host([weight="700"]) .lth__text { font-weight: 700; }

  .lth__dot {
    display: none;
    flex-shrink: 0;
  }
  :host([mandatory]) .lth__dot { display: block; }
`;

class LabosTextHeader extends HTMLElement {
  connectedCallback() { this._render(); }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this.shadowRoot.innerHTML = `<style>${TEXT_HEADER_CSS}</style>
      <div class="lth">
        <span class="lth__text"><slot></slot></span>
        <svg class="lth__dot" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 8 8" width="8" height="8" fill="none">
          <path d="M4 4L8 0V8H0L4 4Z" fill="var(--warn,#D20000)"/>
        </svg>
      </div>`;
  }
}
customElements.define('labos-text-header', LabosTextHeader);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-ADVANCED-SEARCH
// ═══════════════════════════════════════════════════════════════════════════════
//
// Attributes:
//   title        — dialog header (default: "Advanced Search")
//   placeholder  — search field placeholder (default: "Search…")
//   select-label — Select button text (default: "Select")
//
// Methods:
//   setData(columns, rows)    — load the results grid
//                               columns: [{ field, label, render? }]
//                               rows: array of objects
//   setSortOptions(options)   — [{ label, value, selected? }]; hides section when empty
//   setSearchMethods(options) — [{ label, value, selected? }]; default: Contains/Prefix/Exact
//   setSearchFields(fields)   — string[]; default: every column's field
//   show(query?)              — open dialog, optionally pre-fill search query
//   hide()                    — close dialog
//
// Events:
//   labos-select  — { row, index } — user confirmed a selection
//   labos-close   — dialog dismissed without selection
// ─────────────────────────────────────────────────────────────────────────────

(function () {
  if (document.getElementById('labos-adv-search-css')) return;
  const s = document.createElement('style');
  s.id = 'labos-adv-search-css';
  s.textContent = `
    .las-header    { display: flex; flex-direction: column; gap: 16px; flex-shrink: 0; }
    .las-options   { display: flex; align-items: center; gap: 32px; flex-shrink: 0; }
    .las-opt-group { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
    .las-opt-label { font-size: 14px; font-weight: 600; color: #444; white-space: nowrap; }
  `;
  document.head.appendChild(s);
})();

class LabosAdvancedSearch extends HTMLElement {
  connectedCallback() {
    if (this._initialized) return;
    this._initialized = true;
    this.style.display = 'contents';
    this._allRows      = [];
    this._columns      = [];
    this._searchFields = null;
    this._selectedIdx     = -1;
    this._selectedRow     = null;
    this._selectedRows    = [];
    this._selectedIndices = [];
    this._build();
  }

  _build() {
    // ── Dialog ──
    this._dialog = document.createElement('labos-dialog');
    this._dialog.setAttribute('title',        'Advanced search');
    this._dialog.setAttribute('size',         'xl');
    this._dialog.setAttribute('fixed-height', '');

    // ── Header: search input + option chips ──
    const header = document.createElement('div');
    header.className = 'las-header';

    this._input = document.createElement('labos-rounded-search');
    this._input.setAttribute('placeholder', 'Search');
    this._input.setAttribute('mode',        'filter');
    this._input.style.width = '300px';
    header.appendChild(this._input);

    const optRow = document.createElement('div');
    optRow.className = 'las-options';

    // Search method group (always visible)
    this._methodGroup = document.createElement('div');
    this._methodGroup.className = 'las-opt-group';
    const ml = document.createElement('span');
    ml.className = 'las-opt-label';
    ml.textContent = 'Search method:';
    this._chipMethod = document.createElement('labos-chip-list');
    this._chipMethod.setAttribute('mode', 'single');
    this._chipMethod.setAttribute('size', 'small');
    this._methodGroup.appendChild(ml);
    this._methodGroup.appendChild(this._chipMethod);
    optRow.appendChild(this._methodGroup);

    // Sort group (hidden until setSortOptions is called with items)
    this._sortGroup = document.createElement('div');
    this._sortGroup.className = 'las-opt-group';
    this._sortGroup.style.display = 'none';
    const sl = document.createElement('span');
    sl.className = 'las-opt-label';
    sl.textContent = 'Sort by:';
    this._chipSort = document.createElement('labos-chip-list');
    this._chipSort.setAttribute('mode', 'single');
    this._chipSort.setAttribute('size', 'small');
    this._sortGroup.appendChild(sl);
    this._sortGroup.appendChild(this._chipSort);
    optRow.appendChild(this._sortGroup);

    header.appendChild(optRow);
    this._dialog.appendChild(header);

    // ── Results grid ──
    this._grid = document.createElement('labos-grid');
    this._grid.setAttribute('height', 'fill');
    this._grid.setAttribute('title',  this.getAttribute('title') || '');
    this._dialog.appendChild(this._grid);

    // ── Footer buttons ──
    const cancelBtn = document.createElement('labos-button');
    cancelBtn.setAttribute('slot',    'footer');
    cancelBtn.setAttribute('variant', 'default');
    cancelBtn.setAttribute('cancel',  '');
    cancelBtn.setAttribute('icon',    'close');
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => this.hide());
    this._dialog.appendChild(cancelBtn);

    this._selectBtn = document.createElement('labos-button');
    this._selectBtn.setAttribute('slot',    'footer');
    this._selectBtn.setAttribute('variant', 'accent');
    this._selectBtn.setAttribute('icon',    'check');
    this._selectBtn.textContent = this.getAttribute('select-label') || 'Select';
    this._selectBtn.addEventListener('click', () => this._confirmSelect());
    this._dialog.appendChild(this._selectBtn);

    // Connect to DOM — triggers connectedCallback on all child custom elements
    this.appendChild(this._dialog);

    // Default search methods
    this._chipMethod.setItems([
      { label: 'Contains', value: 'contains', selected: true },
      { label: 'Prefix',   value: 'prefix' },
      { label: 'Exact',    value: 'exact' },
    ]);

    // Wire events
    this._input.addEventListener('labos-input',   () => this._refresh());
    this._chipMethod.addEventListener('labos-change', () => this._refresh());
    this._chipSort.addEventListener('labos-change',   () => this._refresh());
    this._grid.addEventListener('labos-selection-change', e => {
      const sel = e.detail.selected;
      this._selectedRows    = sel;
      this._selectedIndices = sel.map((r, i) => r._origIdx ?? e.detail.indices[i]);
      this._selectedIdx     = this._selectedIndices[0] ?? -1;
      this._selectedRow     = sel[0] ?? null;
    });
    this._dialog.addEventListener('labos-close', () => {
      this.dispatchEvent(new CustomEvent('labos-close', { bubbles: true, composed: true }));
    });
  }

  // ── Public API ────────────────────────────────────────────────────────────

  setData(columns, rows) {
    this._columns = columns;
    this._allRows = rows.map((r, i) => ({ ...r, _origIdx: i }));
    if (this._initialized) this._refresh();
  }

  setSortOptions(options) {
    if (!this._sortGroup) return;
    if (!options?.length) { this._sortGroup.style.display = 'none'; return; }
    this._sortGroup.style.display = '';
    this._chipSort.setItems(options);
    this._refresh();
  }

  setSearchMethods(options) {
    if (!options?.length || !this._chipMethod) return;
    this._chipMethod.setItems(options);
    this._refresh();
  }

  setSearchFields(fields) {
    this._searchFields = fields;
  }

  show(query = '') {
    this._selectedIdx     = -1;
    this._selectedRow     = null;
    this._selectedRows    = [];
    this._selectedIndices = [];
    this._input.value = query;
    this._refresh();
    this._dialog.show();
  }

  hide() { this._dialog?.hide(); }

  // ── Internal ──────────────────────────────────────────────────────────────

  _getRows() {
    const q      = (this._input?.value || '').trim().toLowerCase();
    const method = this._chipMethod?.items?.find(i => i.selected)?.value || 'contains';
    const sortBy = this._chipSort?.items?.find(i => i.selected)?.value;
    const fields = this._searchFields ?? this._columns.map(c => c.field);

    let rows = [...this._allRows];

    if (q) {
      rows = rows.filter(r => {
        const vals = fields.map(f => String(r[f] ?? '').toLowerCase());
        if (method === 'exact')  return vals.some(v => v === q);
        if (method === 'prefix') return vals.some(v => v.startsWith(q));
        return vals.some(v => v.includes(q));
      });
    }

    if (sortBy) {
      rows.sort((a, b) => String(a[sortBy] ?? '').localeCompare(String(b[sortBy] ?? '')));
    }

    return rows;
  }

  _refresh() {
    if (!this._grid) return;
    this._grid.setData(this._columns, this._getRows());
  }

  _confirmSelect() {
    if (!this._selectedRows?.length) return;
    const rows = this._selectedRows.map((r, i) => {
      const row = { ...r }; delete row._origIdx;
      return { row, index: this._selectedIndices[i] };
    });
    this.hide();
    this.dispatchEvent(new CustomEvent('labos-select', {
      bubbles: true, composed: true,
      detail: { rows, row: rows[0].row, index: rows[0].index },
    }));
  }
}

customElements.define('labos-advanced-search', LabosAdvancedSearch);

// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-SIMPLE-LIST
// ═══════════════════════════════════════════════════════════════════════════════
//
// Methods:
//   setItems(items)  — items: [string | { label, value, icon? }]
//
// Events:
//   labos-select  — { label, value, index }
// ─────────────────────────────────────────────────────────────────────────────
const SIMPLE_LIST_CSS = `
  ${HOST_BOX}
  :host { display: block; width: 100%; margin-bottom: 12px; }

  .ssl {
    width: 100%;
    font-family: var(--font);
    font-size: 14px;
    font-weight: 400;
    color: var(--black, #333333);
  }

  .ssl__item {
    position: relative;
    height: 40px;
    padding: 0 8px;
    display: flex;
    align-items: center;
    gap: 8px;
    border-bottom: 1px solid #dddddd;
    cursor: pointer;
    user-select: none;
    transition: background 120ms ease;
  }
  .ssl__item:first-child { border-top: 1px solid #dddddd; }
  .ssl__item:hover { background: var(--surface, #F5F5F5); }

  .ssl__icon {
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400;
    color: #666; line-height: 1; flex-shrink: 0;
  }

  .ssl__label {
    flex: 1;
    min-width: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  /* ── Actions variant ── */
  .ssl__actions {
    visibility: hidden;   /* always in flow — keeps label width stable for ellipsis */
    display: flex;
    flex-shrink: 0;
    align-items: center;
    gap: 2px;
  }
  :host([type="actions"]) .ssl__item:hover { background: transparent; }
  :host([type="actions"]) .ssl__item:hover .ssl__actions { visibility: visible; }

  .ssl__act-btn {
    display: flex; align-items: center; justify-content: center;
    width: 30px; height: 30px;
    border: none; border-radius: 50%;
    background: transparent; cursor: pointer; padding: 0;
    font-family: 'Material Icons'; font-size: 18px; font-weight: 400; line-height: 1;
    color: var(--primary, #265F68);
    transition: background 120ms ease;
  }
  .ssl__act-btn:hover { background: rgba(38,95,104,.12); }

  /* ── Tooltips (dark badge style) ── */
  .ssl__tip {
    position: absolute;
    bottom: calc(100% + 4px); left: 8px;
    background: #333333; color: #ffffff;
    font-size: 11px; line-height: 1.4;
    padding: 3px 8px; border-radius: 4px;
    white-space: nowrap; pointer-events: none;
    opacity: 0; transition: opacity 150ms ease;
    z-index: 100;
  }
  .ssl__item.ssl--overflow:hover:not(:has(.ssl__act-btn:hover)) .ssl__tip { opacity: 1; }

`;

class LabosSimpleList extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items = [];
    this._render();
    this._resizeObs = new ResizeObserver(() => this._checkOverflow());
    this._resizeObs.observe(this);
  }

  disconnectedCallback() { if (this._resizeObs) this._resizeObs.disconnect(); }

  setItems(items) {
    this._items = items || [];
    this._render();
  }

  _checkOverflow() {
    if (!this.shadowRoot) return;
    this.shadowRoot.querySelectorAll('.ssl__item').forEach(el => {
      const lbl = el.querySelector('.ssl__label');
      if (lbl) {
        if (lbl.scrollWidth > lbl.clientWidth) el.classList.add('ssl--overflow');
        else el.classList.remove('ssl--overflow');
      }
    });
  }

  _render() {
    if (!this.shadowRoot) return;
    const hasActions = this.getAttribute('type') === 'actions';
    const noEdit = this.hasAttribute('no-edit');
    const actions = hasActions
      ? `<div class="ssl__actions">
           ${!noEdit ? '<button class="ssl__act-btn ssl__act-btn--edit" data-action="edit">edit</button>' : ''}
           <button class="ssl__act-btn ssl__act-btn--delete" data-action="delete">delete</button>
         </div>`
      : '';

    const rows = (this._items || []).map((it, i) => {
      const label = typeof it === 'string' ? it : (it.label || '');
      const icon  = typeof it === 'object' && it.icon
        ? `<span class="ssl__icon">${it.icon}</span>` : '';
      return `<div class="ssl__item" data-index="${i}"><span class="ssl__tip">${label}</span>${icon}<span class="ssl__label">${label}</span>${actions}</div>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${SIMPLE_LIST_CSS}</style>
      <div class="ssl">${rows}</div>`;

    this.shadowRoot.querySelectorAll('.ssl__item').forEach(el => {
      el.addEventListener('click', e => {
        const btn = e.target.closest('.ssl__act-btn');
        const i     = +el.dataset.index;
        const it    = this._items[i];
        const label = typeof it === 'string' ? it : (it.label || '');
        const value = typeof it === 'object' ? (it.value ?? label) : label;
        const detail = { label, value, index: i };
        if (btn) {
          e.stopPropagation();
          const eventName = btn.dataset.action === 'edit' ? 'labos-edit' : 'labos-delete';
          this.dispatchEvent(new CustomEvent(eventName, { detail, bubbles: true, composed: true }));
        } else {
          this.dispatchEvent(new CustomEvent('labos-select', { detail, bubbles: true, composed: true }));
        }
      });
    });
    requestAnimationFrame(() => this._checkOverflow());
  }
}
customElements.define('labos-simple-list', LabosSimpleList);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-SIDEBAR-MENU
// ═══════════════════════════════════════════════════════════════════════════════
//
// Hierarchical sidebar navigation with slide animations between levels.
//
// Usage:
//   <labos-sidebar-menu style="height:400px"></labos-sidebar-menu>
//
//   el.setItems([
//     { label: 'Dashboard', icon: 'dashboard', value: 'dashboard' },
//     { label: 'Display',   icon: 'monitor',   value: 'display', items: [
//       { label: 'Screens', value: 'screens' },
//       { label: 'Themes',  value: 'themes'  },
//     ]},
//   ]);
//   el.addEventListener('labos-select', e => console.log(e.detail));
//
// Item shape : { label, value?, icon?, header?, counter?, items? }
// Events     : labos-select → { label, value, item }
//
const SIDEBAR_MENU_CSS = `
  ${HOST_BOX}
  :host {
    display: flex;
    flex-direction: column;
    width: 280px;
    border-right: 1px solid #eaeaea;
    background: #ffffff;
    font-family: var(--font, 'Open Sans', 'Segoe UI', Arial, sans-serif);
    overflow: hidden;
    position: relative;
    transition: width 220ms cubic-bezier(0.4,0,0.2,1);
  }
  :host([collapsed]) { width: 48px; }
  :host([collapsed]) .sm__header   { display: none; }
  :host([collapsed]) .sm__item     { padding: 0; justify-content: center; }
  :host([collapsed]) .sm__item-icon { margin-right: 0; }
  :host([collapsed]) .sm__item-label,
  :host([collapsed]) .sm__item-arrow { display: none; }
  :host([collapsed]) .sm__item-arrow--ac { display: none; }

  /* ── Accordion mode ── */
  .sm__children { overflow: hidden; height: 0; transition: height 240ms ease; }
  .sm__item-arrow--ac {
    font-family: 'Material Icons'; font-style: normal;
    font-size: 18px; color: #999999; line-height: 1;
    margin-left: auto; flex-shrink: 0;
    transition: transform 200ms ease;
  }
  .sm__item--open > .sm__item-arrow--ac { transform: rotate(180deg); }
  .sm__viewport { flex: 1; position: relative; overflow: hidden; }
  .sm__level    { position: absolute; inset: 0; display: flex; flex-direction: column; background: #ffffff; }

  /* Header */
  .sm__header {
    height: 50px; display: flex; align-items: center;
    padding: 0 8px; flex-shrink: 0;
  }
  .sm__header-title {
    font-size: 18px; font-weight: 600; color: #333333;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis; flex: 1;
  }

  /* List */
  .sm__list { flex: 1; overflow-y: auto; }
  .sm__item {
    height: 40px; display: flex; align-items: center;
    padding: 0 8px 0 16px; cursor: pointer; font-size: 14px; font-weight: 600;
    color: #333333; user-select: none;
  }
  .sm__item:hover                     { background: #f8f8f8; }
  .sm__item--selected,
  .sm__item--selected:hover           { background: #DAE5E7; }
  .sm__item--disabled,
  .sm__item--disabled:hover           { opacity: 0.35; cursor: default; pointer-events: none; }
  .sm__item-icon {
    display: inline-block; flex-shrink: 0;
    width: 18px; height: 18px; margin-right: 16px;
    background-color: #666666;
    -webkit-mask-size: contain; mask-size: contain;
    -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat;
    -webkit-mask-position: center; mask-position: center;
  }
  .sm__item--selected .sm__item-icon,
  .sm__item--selected:hover .sm__item-icon { background-color: #265F68; }
  .sm__item-label {
    flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .sm__item-arrow {
    font-family: 'Material Icons'; font-style: normal; font-weight: 400; font-size: 18px;
    color: #999999; line-height: 1; flex-shrink: 0;
  }
  .sm__item-counter {
    flex-shrink: 0;
    margin-left: 8px;
    height: 18px;
    min-width: 18px;
    padding: 0 5px;
    border-radius: 9px;
    background: #D5E0E1;
    color: #265F68;
    font-size: 11px;
    font-weight: 600;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 1;
  }
  :host([collapsed]) .sm__item-counter { display: none; }
`;

const _smIconUrl = name => `https://cdn.jsdelivr.net/npm/@material-icons/svg@1.0.33/svg/${name}/baseline.svg`;

class LabosSidebarMenu extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items    = [];
    this._stack    = [];
    this._selVal   = null;
    this._tipReady = false;
    this._initDOM();
  }

  // ── Public API ─────────────────────────────────────────────────────────────
  setItems(items, quiet = false) {
    this._items  = items || [];
    if (this.getAttribute('mode') !== 'accordion') {
      this._stack = [{ items: this._items, header: this.getAttribute('header') || null }];
    }
    this._selVal = null;
    this._initDOM();
    if (!quiet && this._items.length > 0) {
      const first = this._items[0];
      if (!Array.isArray(first.items)) {
        this._selVal = first.value ?? null;
        this._syncSelection(this._viewport().lastElementChild);
        this._dispatch(first);
      }
    }
  }

  // ── Internal ───────────────────────────────────────────────────────────────
  _initDOM() {
    if (!this.shadowRoot) return;
    this.shadowRoot.innerHTML = `<style>${SIDEBAR_MENU_CSS}</style><div class="sm__viewport"></div>`;
    const vp = this._viewport();
    if (this.getAttribute('mode') === 'accordion') {
      const lvl = this._buildAccordion(this._items || []);
      lvl.style.transform = 'translateX(0)';
      vp.appendChild(lvl);
    } else if (this._stack && this._stack.length) {
      const cur = this._stack[this._stack.length - 1];
      const lvl = this._buildLevel(cur.items, cur.header, this._stack.length > 1);
      lvl.style.transform = 'translateX(0)';
      vp.appendChild(lvl);
    }
    this._bindTooltip();
  }

  _viewport() { return this.shadowRoot.querySelector('.sm__viewport'); }

  _buildLevel(items, header, showBack) {
    const el = document.createElement('div');
    el.className = 'sm__level';

    if (showBack || header) {
      const hdr = document.createElement('div');
      hdr.className = 'sm__header';
      if (showBack) {
        const btn = document.createElement('labos-button');
        btn.setAttribute('icon', 'arrow_back');
        btn.setAttribute('icon-only', '');
        btn.setAttribute('shape', 'rounded');
        btn.setAttribute('size', 'small');
        btn.setAttribute('aria-label', 'Back');
        btn.style.cssText = 'flex-shrink:0;margin-right:8px;';
        btn.addEventListener('click', () => this._goBack());
        hdr.appendChild(btn);
      }
      if (header) {
        const t = document.createElement('span');
        t.className   = 'sm__header-title';
        t.textContent = header;
        hdr.appendChild(t);
      }
      el.appendChild(hdr);
    }

    const list = document.createElement('div');
    list.className = 'sm__list';
    (items || []).forEach(item => {
      const hasKids = Array.isArray(item.items) && item.items.length > 0;
      const row = document.createElement('div');
      row.className    = 'sm__item' + (String(item.value ?? '') === String(this._selVal ?? '') && this._selVal !== null ? ' sm__item--selected' : '') + (item.disabled ? ' sm__item--disabled' : '');
      row.dataset.value = String(item.value ?? '');
      row.dataset.tip   = item.label;

      if (item.icon) {
        const ic = document.createElement('span');
        ic.className = 'sm__item-icon';
        ic.style.setProperty('-webkit-mask-image', `url(${_smIconUrl(item.icon)})`);
        ic.style.setProperty('mask-image', `url(${_smIconUrl(item.icon)})`);
        row.appendChild(ic);
      }
      const lbl = document.createElement('span');
      lbl.className   = 'sm__item-label';
      lbl.textContent = item.label;
      row.appendChild(lbl);

      if (item.counter != null) {
        const ctr = document.createElement('span');
        ctr.className   = 'sm__item-counter';
        ctr.textContent = String(item.counter);
        row.appendChild(ctr);
      }

      if (hasKids) {
        const arr = document.createElement('span');
        arr.className   = 'sm__item-arrow';
        arr.textContent = 'navigate_next';
        row.appendChild(arr);
      }

      if (!item.disabled) row.addEventListener('click', () => {
        if (hasKids) {
          this._forward(item.items, item.header || item.label);
        } else {
          this._selVal = item.value ?? null;
          this._syncSelection(el);
          this._dispatch(item);
        }
      });
      list.appendChild(row);
    });
    el.appendChild(list);
    return el;
  }

  _forward(items, header) {
    const vp = this._viewport();
    this._stack.push({ items, header });
    const newLvl = this._buildLevel(items, header, true);
    newLvl.style.cssText = 'transform:translateX(100%);transition:none';
    vp.appendChild(newLvl);

    const oldLvl = vp.children[vp.children.length - 2];
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const t = 'transform 240ms cubic-bezier(0.4,0,0.2,1)';
      newLvl.style.transition = t; newLvl.style.transform = 'translateX(0)';
      if (oldLvl) {
        oldLvl.style.transition = t; oldLvl.style.transform = 'translateX(-100%)';
        oldLvl.addEventListener('transitionend', () => oldLvl.remove(), { once: true });
      }
    }));

    // Auto-select first leaf
    if (items.length > 0 && !Array.isArray(items[0].items)) {
      this._selVal = items[0].value ?? null;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        this._syncSelection(newLvl);
        this._dispatch(items[0]);
      }));
    }
  }

  _goBack() {
    if (this._stack.length <= 1) return;
    const vp = this._viewport();
    this._stack.pop();
    const prev = this._stack[this._stack.length - 1];
    const newLvl = this._buildLevel(prev.items, prev.header, this._stack.length > 1);
    newLvl.style.cssText = 'transform:translateX(-100%);transition:none';
    vp.appendChild(newLvl);

    const oldLvl = vp.children[vp.children.length - 2];
    requestAnimationFrame(() => requestAnimationFrame(() => {
      const t = 'transform 240ms cubic-bezier(0.4,0,0.2,1)';
      newLvl.style.transition = t; newLvl.style.transform = 'translateX(0)';
      if (oldLvl) {
        oldLvl.style.transition = t; oldLvl.style.transform = 'translateX(100%)';
        oldLvl.addEventListener('transitionend', () => oldLvl.remove(), { once: true });
      }
    }));
  }

  _syncSelection(lvl) {
    if (!lvl) return;
    lvl.querySelectorAll('.sm__item').forEach(el => {
      el.classList.toggle('sm__item--selected',
        this._selVal !== null && el.dataset.value === String(this._selVal));
    });
  }

  // ── Accordion mode ────────────────────────────────────────────────────────
  _buildAccordion(items) {
    const wrap = document.createElement('div');
    wrap.className = 'sm__level';
    const list = document.createElement('div');
    list.className = 'sm__list';
    this._appendAccordionItems(items, list, 0, list);
    wrap.appendChild(list);
    return wrap;
  }

  _appendAccordionItems(items, container, depth, rootList) {
    const openEl  = el => {
      el.style.height = el.scrollHeight + 'px';
      el.addEventListener('transitionend', () => { if (el.style.height !== '0px') el.style.height = 'auto'; }, { once: true });
    };
    const closeEl = el => {
      el.style.height = el.scrollHeight + 'px';
      requestAnimationFrame(() => requestAnimationFrame(() => { el.style.height = '0'; }));
    };

    (items || []).forEach(item => {
      const hasKids = Array.isArray(item.items) && item.items.length > 0;
      const isSelected = this._selVal !== null && String(item.value ?? '') === String(this._selVal);

      const row = document.createElement('div');
      row.className = 'sm__item' + (isSelected ? ' sm__item--selected' : '') + (item.disabled ? ' sm__item--disabled' : '');
      row.style.paddingLeft = (depth === 0 ? 16 : 50 + (depth - 1) * 16) + 'px';
      row.dataset.value = String(item.value ?? '');
      row.dataset.tip   = item.label;

      if (item.icon && depth === 0) {
        const ic = document.createElement('span');
        ic.className = 'sm__item-icon';
        ic.style.setProperty('-webkit-mask-image', `url(${_smIconUrl(item.icon)})`);
        ic.style.setProperty('mask-image', `url(${_smIconUrl(item.icon)})`);
        row.appendChild(ic);
      }
      const lbl = document.createElement('span');
      lbl.className = 'sm__item-label'; lbl.textContent = item.label;
      row.appendChild(lbl);

      if (item.counter != null) {
        const ctr = document.createElement('span');
        ctr.className   = 'sm__item-counter';
        ctr.textContent = String(item.counter);
        row.appendChild(ctr);
      }

      let childrenEl = null;
      if (hasKids) {
        const arr = document.createElement('span');
        arr.className = 'sm__item-arrow--ac'; arr.textContent = 'expand_more';
        row.appendChild(arr);

        childrenEl = document.createElement('div');
        childrenEl.className = 'sm__children';
        this._appendAccordionItems(item.items, childrenEl, depth + 1, rootList);

        row.addEventListener('click', () => {
          const isOpen = row.classList.contains('sm__item--open');
          if (isOpen) {
            row.classList.remove('sm__item--open');
            closeEl(childrenEl);
          } else {
            row.classList.add('sm__item--open');
            openEl(childrenEl);
            // Expand parent sm__children heights if already open
            let anc = container;
            while (anc) {
              if (anc.classList?.contains('sm__children') && anc.style.height === 'auto') {
                anc.style.height = anc.scrollHeight + childrenEl.scrollHeight + 'px';
                anc.addEventListener('transitionend', () => { anc.style.height = 'auto'; }, { once: true });
              }
              anc = anc.parentElement;
            }
          }
        });
      } else if (!item.disabled) {
        row.addEventListener('click', () => {
          this._selVal = item.value ?? null;
          rootList.querySelectorAll('.sm__item').forEach(el =>
            el.classList.toggle('sm__item--selected', el.dataset.value === String(this._selVal))
          );
          this._dispatch(item);
        });
      }

      container.appendChild(row);
      if (childrenEl) container.appendChild(childrenEl);
    });
  }

  _dispatch(item) {
    this.dispatchEvent(new CustomEvent('labos-select', {
      detail: { label: item.label, value: item.value, item },
      bubbles: true, composed: true,
    }));
  }

  _bindTooltip() {
    if (this._tipReady || !this.shadowRoot) return;
    this._tipReady = true;
    const tip = _getGridTip();
    this.shadowRoot.addEventListener('mouseover', e => {
      tip.style.display = 'none';
      const row = e.composedPath().find(n => n.dataset?.tip !== undefined && n.classList?.contains('sm__item'));
      if (!row) return;
      const collapsed = this.hasAttribute('collapsed');
      if (!collapsed) {
        const lbl = row.querySelector('.sm__item-label');
        if (!lbl || lbl.scrollWidth <= lbl.clientWidth) return;
      }
      tip.textContent   = row.dataset.tip;
      tip.style.display = 'block';
      const rect = row.getBoundingClientRect();
      let x, y;
      if (collapsed) {
        x = rect.right + 8;
        y = rect.top + rect.height / 2 - tip.offsetHeight / 2;
      } else {
        x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
        y = rect.top - tip.offsetHeight - 6;
      }
      tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
      tip.style.top  = Math.max(4, y) + 'px';
    });
    this.shadowRoot.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }
}
customElements.define('labos-sidebar-menu', LabosSidebarMenu);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-ARROWS-NAVIGATION  <labos-arrows-navigation>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   page   — current page, 1-based (default: 1)
//   total  — total pages (default: 1)
//
// Methods:
//   setPage(n)  — clamp to [1, total] and update; does NOT fire event
//
// Events:
//   labos-change  — { page }  — fires on prev/next click
// ───────────────────────────────────────────────────────────────────────────────
const ARROWS_NAV_CSS = `
  ${HOST_BOX}
  :host {
    display: inline-flex;
    align-items: center;
    font-family: var(--font);
  }
  .lan__count {
    font-size: 14px;
    color: var(--black, #333333);
    text-align: right;
    white-space: nowrap;
    min-width: 61px;
    padding-right: 8px;
  }
  .lan__count b { font-weight: 700; }
  .lan__btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    background: transparent;
    cursor: pointer;
    color: var(--primary, #265F68);
    transition: background 120ms ease;
    padding: 0;
    user-select: none;
    flex-shrink: 0;
  }
  .lan__btn:hover { background: rgba(38,95,104,.12); }
  .lan__btn[disabled] {
    opacity: var(--disabled-op, 0.4);
    cursor: default;
    pointer-events: none;
  }
  .lan__icon {
    font-family: 'Material Icons';
    font-size: 32px;
    font-weight: 400;
    font-style: normal;
    line-height: 1;
  }
`;

class LabosArrowsNavigation extends HTMLElement {
  static get observedAttributes() { return ['page', 'total']; }

  connectedCallback() { this._render(); }
  attributeChangedCallback() { if (this.shadowRoot) this._render(); }

  get page()  { return Math.max(1, parseInt(this.getAttribute('page')  || '1', 10)); }
  get total() { return Math.max(1, parseInt(this.getAttribute('total') || '1', 10)); }

  set page(v) { this.setAttribute('page', String(v)); }

  setPage(n) {
    this.setAttribute('page', String(Math.max(1, Math.min(this.total, n))));
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const page  = this.page;
    const total = this.total;

    this.shadowRoot.innerHTML = `
      <style>${ARROWS_NAV_CSS}</style>
      <span class="lan__count"><b>${page}</b> of <b>${total}</b></span>
      <button class="lan__btn" id="prev" ${page <= 1 ? 'disabled' : ''}>
        <span class="lan__icon">chevron_left</span>
      </button>
      <button class="lan__btn" id="next" ${page >= total ? 'disabled' : ''}>
        <span class="lan__icon">chevron_right</span>
      </button>
    `;

    this.shadowRoot.getElementById('prev').addEventListener('click', () => {
      const newPage = this.page - 1;
      this.setAttribute('page', String(newPage));
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { page: newPage },
        bubbles: true, composed: true,
      }));
    });

    this.shadowRoot.getElementById('next').addEventListener('click', () => {
      const newPage = this.page + 1;
      this.setAttribute('page', String(newPage));
      this.dispatchEvent(new CustomEvent('labos-change', {
        detail: { page: newPage },
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define('labos-arrows-navigation', LabosArrowsNavigation);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BANNER-ALERT  <labos-banner-alert>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   type        — success | info | warning | error  (default: info)
//   message     — banner text (supports HTML)
//   icon        — override default icon (material icon name)
//   no-icon     — boolean; hides indicator icon
//   closable    — boolean; shows × button; clicking hides the banner
//   expandable  — boolean; shows expand/collapse chevron
//   expanded    — boolean; current expanded state (managed internally)
//
// Methods:
//   setButtons([{ label, value, icon? }])  — set action buttons
//   setExpandContent(html)                 — set expand-panel inner HTML
//
// Events:
//   labos-close   — user clicked ×
//   labos-action  — { value, label } — action button clicked
//   labos-expand  — { expanded: bool }
// ───────────────────────────────────────────────────────────────────────────────
const BANNER_ALERT_CSS = `
  ${HOST_BOX}
  :host { display: block; width: 100%; font-family: var(--font); font-size: 14px; }
  :host([hidden]) { display: none !important; }

  .lba {
    border: 1px solid;
    overflow: hidden;
  }

  .lba__row {
    display: flex;
    align-items: flex-start;
    min-height: 50px;
    padding: 10px 15px;
  }

  /* ── expand toggle ── */
  .lba__expand-btn {
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    padding: 0; margin: 0 12px 0 0;
    color: inherit; flex-shrink: 0;
    height: 30px;
  }
  .lba__expand-icon {
    font-family: 'Material Icons'; font-size: 20px;
    font-style: normal; font-weight: 400; line-height: 1;
    transition: transform 150ms ease;
    display: block;
  }
  :host([expanded]) .lba__expand-icon { transform: rotate(180deg); }
  :host(:not([expandable])) .lba__expand-btn { display: none; }

  /* ── text container ── */
  .lba__content {
    flex: 1;
    min-height: 30px;
    display: flex;
    align-items: center;
  }
  .lba__content--multiline { margin-top: 2px; }

  /* ── indicator icon ── */
  .lba__icon {
    display: inline-flex; align-items: center; justify-content: center;
    height: 30px; flex-shrink: 0; margin-right: 12px;
    font-family: 'Material Icons'; font-size: 20px;
    font-style: normal; font-weight: 400; line-height: 1;
  }
  :host([no-icon]) .lba__icon { display: none; }

  /* ── text ── */
  .lba__text {
    font-size: 14px; font-weight: 700; line-height: 1.45;
    word-break: break-word;
  }

  /* ── action buttons ── */
  .lba__actions {
    display: flex; align-items: center; gap: 8px;
    flex-shrink: 0; margin-left: 12px;
    min-height: 30px;
  }
  .lba__actions:empty { display: none; margin-left: 0; }
  .lba__action-btn {
    display: inline-flex; align-items: center;
    height: 30px; padding: 0 10px;
    border: 1px solid var(--primary-20, #D5E0E1);
    border-radius: var(--radius, 3px);
    background: var(--white, #fff); cursor: pointer;
    font-family: var(--font); font-size: 13px; font-weight: 400;
    color: var(--primary, #265F68); white-space: nowrap;
    transition: background 120ms ease;
  }
  .lba__action-btn:hover { background: var(--surface, #F5F5F5); }

  /* ── close button ── */
  .lba__close-btn {
    display: flex; align-items: center; justify-content: center;
    background: none; border: none; cursor: pointer;
    padding: 0; margin: 0 0 0 12px;
    color: inherit; flex-shrink: 0;
    height: 30px;
  }
  .lba__close-btn:hover { opacity: 0.7; }
  .lba__close-icon {
    font-family: 'Material Icons'; font-size: 18px;
    font-style: normal; font-weight: 400; line-height: 1;
    display: block;
  }
  :host(:not([closable])) .lba__close-btn { display: none; }

  /* ── expand panel ── */
  .lba__panel {
    display: none;
    padding: 15px;
    background: #ffffff;
    border-top: 1px solid currentColor;
    font-size: 14px; line-height: 1.5;
    color: var(--black, #333);
  }
  :host([expandable][expanded]) .lba__panel { display: block; }
  .lba__panel * { margin-block-start: 0; margin-block-end: 0; }
`;

const _BANNER_TYPE_CFG = {
  default: { icon: '',             color: 'var(--primary,#265F68)',           bg: '#f2f2f2',                          border: '#dddddd'                         },
  success: { icon: 'check_circle', color: 'var(--green-darken-15,#3F8331)',  bg: 'var(--green-lighten-45,#F0F9EE)',  border: 'var(--green-lighten-25,#ADDDA4)' },
  info:    { icon: 'info',         color: 'var(--blue-darken-15,#104F9B)',   bg: 'var(--blue-lighten-45,#E1EDFC)',   border: 'var(--blue-lighten-25,#84B7F2)'  },
  warning: { icon: 'warning',      color: '#C47800',                         bg: '#FFF8EC',                          border: '#FECF80'                         },
  error:   { icon: 'cancel',       color: 'var(--red-darken-15,#B30000)',    bg: 'var(--red-lighten-45,#FFE5E5)',    border: 'var(--red-lighten-25,#FE8080)'   },
};

class LabosBannerAlert extends HTMLElement {
  static get observedAttributes() { return ['type', 'message', 'icon', 'no-icon', 'closable', 'expandable', 'expanded']; }

  connectedCallback() {
    this._buttons    = this._buttons    || [];
    this._panelHtml  = this._panelHtml  || '';
    this._render();
  }

  attributeChangedCallback(name) {
    if (!this.shadowRoot) return;
    if (name === 'expanded') {
      this._syncExpanded();
    } else {
      this._render();
    }
  }

  setButtons(items) {
    this._buttons = items || [];
    if (this.shadowRoot) this._render();
  }

  setExpandContent(html) {
    this._panelHtml = html || '';
    const panel = this.shadowRoot && this.shadowRoot.querySelector('.lba__panel');
    if (panel) panel.innerHTML = this._panelHtml;
  }

  _syncExpanded() {
    if (!this.shadowRoot) return;
    const panel = this.shadowRoot.querySelector('.lba__panel');
    if (panel) panel.innerHTML = this._panelHtml;
  }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });

    const type   = this.getAttribute('type') || 'info';
    const cfg    = _BANNER_TYPE_CFG[type] || _BANNER_TYPE_CFG.info;
    const msg    = this.getAttribute('message') || '';
    const icon   = this.getAttribute('icon') || cfg.icon;

    const actionsHtml = (this._buttons || []).map(b =>
      `<button class="lba__action-btn" data-value="${b.value ?? ''}">${b.label}</button>`
    ).join('');

    this.shadowRoot.innerHTML = `
      <style>${BANNER_ALERT_CSS}</style>
      <div class="lba" style="color:${cfg.color};background:${cfg.bg};border-color:${cfg.border};">
        <div class="lba__row">
          <button class="lba__expand-btn" title="Toggle">
            <span class="lba__expand-icon">expand_more</span>
          </button>
          ${icon ? `<span class="lba__icon">${icon}</span>` : ''}
          <div class="lba__content">
            <span class="lba__text">${msg}</span>
            <div class="lba__actions">${actionsHtml}</div>
          </div>
          <button class="lba__close-btn" title="Close">
            <span class="lba__close-icon">close</span>
          </button>
        </div>
        <div class="lba__panel" style="border-color:${cfg.border};">${this._panelHtml}</div>
      </div>`;


    if (this._ro) this._ro.disconnect();
    const content = this.shadowRoot.querySelector('.lba__content');
    if (content) {
      this._ro = new ResizeObserver(() => {
        content.classList.toggle('lba__content--multiline', content.offsetHeight > 30);
      });
      this._ro.observe(content);
    }

    this.shadowRoot.querySelector('.lba__expand-btn').addEventListener('click', () => {
      const nowExpanded = !this.hasAttribute('expanded');
      nowExpanded ? this.setAttribute('expanded', '') : this.removeAttribute('expanded');
      this.dispatchEvent(new CustomEvent('labos-expand', {
        detail: { expanded: nowExpanded }, bubbles: true, composed: true,
      }));
    });

    this.shadowRoot.querySelector('.lba__close-btn').addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('labos-close', { bubbles: true, composed: true }));
      this.setAttribute('hidden', '');
    });

    this.shadowRoot.querySelectorAll('.lba__action-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const found = (this._buttons || []).find(b => String(b.value ?? '') === btn.dataset.value);
        this.dispatchEvent(new CustomEvent('labos-action', {
          detail: { value: btn.dataset.value, label: found?.label || '' },
          bubbles: true, composed: true,
        }));
      });
    });
  }
}
customElements.define('labos-banner-alert', LabosBannerAlert);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-BOX-SELECTION-LIST  <labos-box-selection-list>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   item-width — box width, default 180px
//   mode       — single | multi  (omit for display-only, no selection)
//
// Methods:
//   setItems([{ label, sublabel?, html?, variant?, value?, disabled? }])
//     html — custom HTML content, replaces label/sublabel when provided
//   getSelected()    — returns array of selected values
//   clearSelection()
//
// Events:
//   labos-select — { value, item, selected: [values] }
// ───────────────────────────────────────────────────────────────────────────────
const BOX_SELECTION_LIST_CSS = `
  ${HOST_BOX}
  :host { display: block; }

  .lbsl {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  /* ── List layout ── */
  :host([layout="list"]) .lbsl { flex-direction: column; flex-wrap: nowrap; }
  :host([layout="list"]) .lbsl__item {
    width: 100% !important;
    height: 40px;
    min-height: 40px;
    display: flex;
    align-items: center;
    padding: 0 12px;
  }
  :host([layout="list"]) .lbsl__item--warning,
  :host([layout="list"]) .lbsl__item--success,
  :host([layout="list"]) .lbsl__item--info,
  :host([layout="list"]) .lbsl__item--error {
    border-left: 1px solid #dddddd;
  }

  .lbsl__item {
    padding: 8px 8px 8px 12px;
    border-radius: 3px;
    border: 1px solid #dddddd;
    background: #ffffff;
    box-sizing: border-box;
    font-family: var(--font);
    font-size: 14px;
    color: var(--black, #333);
    min-width: 0;
    transition: border-color 120ms ease, box-shadow 120ms ease;
  }
  .lbsl__item--selectable { cursor: pointer; }
  .lbsl__item--disabled   { opacity: var(--disabled-op, 0.4); pointer-events: none; }

  /* ── Variant left borders ── */
  .lbsl__item--warning { border-left: 3px solid #418CD8; }
  .lbsl__item--success { border-left: 3px solid #4C9D3C; }
  .lbsl__item--info    { border-left: 3px solid #D3851B; }
  .lbsl__item--error   { border-left: 3px solid #D32F2F; }

  /* ── Selected states (border + shadow per variant) ── */
  .lbsl__item--selected,
  .lbsl__item--success.lbsl__item--selected {
    border-color: #5aba47;
    box-shadow: 0 2px 6px rgba(90,186,71,0.5);
  }
  .lbsl__item--info.lbsl__item--selected {
    border-color: #00a3d9;
    box-shadow: 0 2px 6px rgba(0,163,217,0.5);
  }
  .lbsl__item--warning.lbsl__item--selected {
    border-color: #D3851B;
    box-shadow: 0 2px 6px rgba(211,133,27,0.5);
  }
  .lbsl__item--error.lbsl__item--selected {
    border-color: #D20000;
    box-shadow: 0 2px 6px rgba(210,0,0,0.5);
  }

  .lbsl__label {
    font-size: 14px;
    font-weight: 600;
    line-height: 1.4;
    word-break: break-word;
  }
  .lbsl__sublabel {
    font-size: 12px;
    color: #888;
    margin-top: 2px;
    line-height: 1.4;
    word-break: break-word;
  }
`;

class LabosBoxSelectionList extends HTMLElement {
  static get observedAttributes() { return ['item-width', 'mode', 'layout']; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items    = this._items    || [];
    this._selected = this._selected || new Set();
    this._render();
  }

  attributeChangedCallback() { if (this.shadowRoot) this._render(); }

  setItems(items) {
    this._items    = items || [];
    this._selected = new Set();
    if (this.shadowRoot) this._render();
  }

  getSelected()    { return [...this._selected]; }
  clearSelection() { this._selected = new Set(); if (this.shadowRoot) this._render(); }

  _render() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    const mode  = this.getAttribute('mode') || '';
    const width = this.getAttribute('item-width') || '180px';
    const selectable = mode === 'single' || mode === 'multi';

    const boxesHtml = this._items.map((item, i) => {
      const key      = item.value ?? i;
      const variant  = item.variant  ? ` lbsl__item--${item.variant}` : '';
      const selected = this._selected.has(key) ? ' lbsl__item--selected' : '';
      const disabled = item.disabled ? ' lbsl__item--disabled' : '';
      const sel      = selectable    ? ' lbsl__item--selectable' : '';
      const content  = item.html
        ? item.html
        : `<div class="lbsl__label">${item.label}</div>
           ${item.sublabel ? `<div class="lbsl__sublabel">${item.sublabel}</div>` : ''}`;
      return `
        <div class="lbsl__item${variant}${selected}${disabled}${sel}"
             style="width:${width}" data-index="${i}">
          ${content}
        </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${BOX_SELECTION_LIST_CSS}</style><div class="lbsl">${boxesHtml}</div>`;

    if (!selectable) return;

    this.shadowRoot.querySelectorAll('.lbsl__item').forEach(el => {
      el.addEventListener('click', () => {
        const i   = parseInt(el.dataset.index, 10);
        const item = this._items[i];
        const key  = item.value ?? i;
        if (mode === 'single') {
          this._selected = new Set([key]);
        } else {
          this._selected.has(key) ? this._selected.delete(key) : this._selected.add(key);
        }
        this._render();
        this.dispatchEvent(new CustomEvent('labos-select', {
          detail: { value: key, item, selected: [...this._selected] },
          bubbles: true, composed: true,
        }));
      });
    });
  }
}
customElements.define('labos-box-selection-list', LabosBoxSelectionList);


// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-PATIENT-SUMMARY  <labos-patient-summary>
// ───────────────────────────────────────────────────────────────────────────────
// Attributes:
//   following — boolean presence; star filled
//
// Methods:
//   setPatient({ name, gender, idNo, dob, age, phone,
//                labNo, firstName, lastName, middleName,
//                address, city, zip, country, mobile, status })
//
// Events:
//   labos-follow-change — { following: bool }
// ───────────────────────────────────────────────────────────────────────────────
const _PS_CSS = `
  :host { display: inline-flex; align-items: center; height: 36px; }
  .avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: rgba(38,98,104,0.1);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; margin-right: 10px;
  }
  .gender { font: 700 14px/1 var(--font,'Open Sans',sans-serif); color: #266268; }
  .details { display: flex; align-items: center; }
  .field { display: flex; flex-direction: column; justify-content: center; height: 36px; flex-shrink: 0; }
  .field--name { max-width: 300px; }
  .val { font: 700 14px/1 var(--font,'Open Sans',sans-serif); color: #266268; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
  .lbl { font: 600 11px/1 var(--font,'Open Sans',sans-serif); color: #999; margin-top: 4px; white-space: nowrap; }
  .sep { width: 1px; background: #e0e0e0; align-self: stretch; margin: 0 10px; flex-shrink: 0; }
  .follow--on { color: #266268; }
`;

class LabosPatientSummary extends HTMLElement {
  static get observedAttributes() { return ['following']; }

  connectedCallback() {
    if (!this.shadowRoot) {
      this.attachShadow({ mode: 'open' });
      this._patient = this._patient || {};
      this._render();
    }
    if (!this._popover) {
      this._popover = document.createElement('labos-popover');
      this._popover.setAttribute('size', 'large');
      document.body.appendChild(this._popover);
    }
  }

  disconnectedCallback() {
    if (this._popover) {
      if (typeof this._popover.hide === 'function') this._popover.hide();
      this._popover.remove();
      this._popover = null;
    }
  }

  attributeChangedCallback() {
    if (this.shadowRoot) this._render();
  }

  setPatient(data) {
    this._patient = data || {};
    this._popoverDirty = true;
    if (this.shadowRoot) this._render();
  }

  _render() {
    const p          = this._patient || {};
    const following  = this.hasAttribute('following');
    const starIcon   = following ? 'star' : 'star_border';
    const starClass  = following ? 'follow--on' : '';
    const ageStr     = p.age ? `  (${p.age})` : '';

    const field = (val, lbl) => val
      ? `<div class="sep"></div><div class="field"><span class="val">${val}${lbl === 'DOB' ? ageStr : ''}</span><span class="lbl">${lbl}</span></div>`
      : '';

    this.shadowRoot.innerHTML = `
      <style>${_PS_CSS}</style>
      <labos-button class="ps-follow ${starClass}" shape="rounded" borderless icon="${starIcon}" size="small" style="margin-right:5px"></labos-button>
      <div class="avatar"><span class="gender">${p.gender || '?'}</span></div>
      <div class="details">
        <div class="field field--name">
          <span class="val" title="${p.name || ''}">${p.name || '—'}</span>
          <span class="lbl">Patient</span>
        </div>
        ${field(p.idNo,  'ID')}
        ${field(p.dob,   'DOB')}
        ${field(p.phone, 'Phone #')}
      </div>
      <labos-button class="ps-more" shape="rounded" icon="more_horiz" borderless title="More" style="margin-left:10px"></labos-button>`;

    const followBtn = this.shadowRoot.querySelector('.ps-follow');
    if (followBtn) {
      followBtn.addEventListener('click', () => {
        const nowFollowing = !this.hasAttribute('following');
        nowFollowing ? this.setAttribute('following', '') : this.removeAttribute('following');
        this.dispatchEvent(new CustomEvent('labos-follow-change', {
          detail: { following: nowFollowing }, bubbles: true, composed: true,
        }));
      });
    }

    const moreBtn = this.shadowRoot.querySelector('.ps-more');
    if (moreBtn) {
      moreBtn.addEventListener('click', () => {
        if (!this._popover) return;
        if (this._popoverDirty !== false) {
          this._popover.innerHTML = this._buildPopoverHtml();
          this._popoverDirty = false;
        }
        this._popover.toggle(moreBtn);
      });
    }
  }

  _buildPopoverHtml() {
    const p = this._patient || {};
    const sexLabel = p.gender === 'M' ? 'Male' : p.gender === 'F' ? 'Female' : (p.gender || '');
    const ageStr   = p.age ? ` (${p.age})` : '';
    const f  = (lbl, val) => val
      ? `<div style="padding-bottom:12px"><div style="font:400 11px/1 'Open Sans',sans-serif;color:#999;margin-bottom:4px">${lbl}</div><div style="font:400 14px/1.2 'Open Sans',sans-serif;color:#333;white-space:nowrap">${val}</div></div>`
      : '';
    const h4 = t => `<div style="font:600 11px/1 'Open Sans',sans-serif;color:#999;text-transform:uppercase;letter-spacing:.06em;margin:0 0 10px;padding-bottom:6px;border-bottom:1px solid #E4E4E4">${t}</div>`;

    return `
      <div style="display:flex;justify-content:flex-start;margin-bottom:12px">
        <labos-button icon="edit">Edit</labos-button>
      </div>
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:16px">
        <div style="width:36px;height:36px;border-radius:50%;background:rgba(38,98,104,0.1);display:flex;align-items:center;justify-content:center;flex-shrink:0">
          <span style="font:700 14px/1 'Open Sans',sans-serif;color:#266268">${p.gender || '?'}</span>
        </div>
        <span style="font:600 18px/1.3 'Open Sans',sans-serif;color:#266268">${p.name || ''}&nbsp;&nbsp;|&nbsp;&nbsp;${p.dob || ''}${ageStr}</span>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr 1fr;column-gap:32px">
        <div>
          ${h4('General')}
          ${f('ID', p.idNo)}
          ${f('LAB#', p.labNo)}
          ${f('First name', p.firstName)}
          ${f('Middle name', p.middleName)}
          ${f('Last name', p.lastName)}
          ${f('Date of birth', p.dob ? p.dob + ageStr : '')}
          ${f('Sex', sexLabel)}
        </div>
        <div>
          ${h4('Address')}
          ${f('Address', p.address)}
          ${f('City', p.city)}
          ${f('Zip', p.zip)}
          ${f('Country', p.country)}
        </div>
        <div>
          ${h4('Contact information')}
          ${f('Phone number', p.phone)}
          ${f('Mobile number', p.mobile)}
          ${h4('Other')}
          ${f('Status', p.status)}
        </div>
      </div>`;
  }
}
customElements.define('labos-patient-summary', LabosPatientSummary);


// ── LabosSerialTime ────────────────────────────────────────────────────────
const SERIAL_TIME_CSS = `
  :host {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    font-family: var(--font, 'Open Sans', sans-serif);
  }
  .icon {
    font-family: 'Material Icons';
    font-size: 18px;
    color: #333;
    line-height: 1;
    font-weight: 400;
    font-style: normal;
    user-select: none;
    width: 18px;
    height: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .hours, .minutes {
    font-size: 14px;
    font-weight: 600;
    color: #333;
    line-height: 1;
    white-space: nowrap;
  }
`;

class LabosSerialTime extends HTMLElement {
  static get observedAttributes() { return ['hours', 'minutes']; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._render();
    this._bindTooltip();
  }

  attributeChangedCallback() { if (this.shadowRoot) this._render(); }

  _render() {
    const hours   = this.getAttribute('hours')   ?? '0';
    const minutes = this.getAttribute('minutes') ?? '0';
    this.shadowRoot.innerHTML = `
      <style>${SERIAL_TIME_CSS}</style>
      <span class="icon">access_time</span>
      <span class="hours">${hours}h</span>
      <span class="minutes">${minutes}m</span>
    `;
  }

  _bindTooltip() {
    if (this._tipReady) return;
    this._tipReady = true;
    const tip = _getGridTip();
    this.addEventListener('mouseenter', () => {
      const icon = this.shadowRoot?.querySelector('.icon');
      if (!icon) return;
      tip.textContent = 'Serial time';
      tip.style.display = 'block';
      const rect = icon.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
      const y = rect.top - tip.offsetHeight - 6;
      tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
      tip.style.top  = Math.max(4, y) + 'px';
    });
    this.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }
}
customElements.define('labos-serial-time', LabosSerialTime);

// ── LabosTimeline ──────────────────────────────────────────────────────────
const TIMELINE_CSS = `
  :host { display: block; font-family: var(--font, 'Open Sans', sans-serif); }

  .tl { display: flex; flex-direction: column; }

  .tl-item {
    display: grid;
    grid-template-columns: 30px 1fr;
    column-gap: 12px;
  }
  .tl-item--lined .tl-content { padding-bottom: 10px; }

  .tl-left {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  /* Circle with number */
  .tl-dot {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: #999999;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tl-dot__num {
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
    line-height: 1;
    user-select: none;
  }
  /* Circle with icon */
  .tl-dot__icon {
    font-family: 'Material Icons';
    font-size: 18px;
    color: #ffffff;
    line-height: 1;
    font-weight: 400;
    font-style: normal;
    user-select: none;
  }
  /* Icon only */
  .tl-icon-only {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .tl-icon-only__icon {
    font-family: 'Material Icons';
    font-size: 18px;
    color: #999999;
    line-height: 1;
    font-weight: 400;
    font-style: normal;
    user-select: none;
  }

  /* Connector line */
  .tl-line {
    flex: 1;
    width: 1px;
    min-height: 10px;
    margin: 5px 0;
  }
  .tl-line--solid  { background: #CCCCCC; }
  .tl-line--dashed {
    background-image: repeating-linear-gradient(
      to bottom,
      #AAAAAA 0px, #AAAAAA 2px,
      transparent 2px, transparent 5px
    );
  }

  /* Content — first line aligns to circle center */
  .tl-content {
    padding-top: calc((30px - 1.4em) / 2);
    font-size: 14px;
    color: #333333;
    line-height: 1.4;
  }
`;

class LabosTimeline extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._items = this._items || [];
    this._render();
  }

  setItems(items) {
    this._items = items || [];
    if (this.shadowRoot) this._render();
  }

  _render() {
    const items = this._items;
    const rows = items.map((item, i) => {
      const isLast = i === items.length - 1;
      const ind = item.indicator || {};
      let dotHTML = '';

      if (ind.type === 'number') {
        const bg = ind.color || '#999999';
        dotHTML = `<div class="tl-dot" style="background:${bg}"><span class="tl-dot__num">${ind.value ?? i + 1}</span></div>`;
      } else if (ind.type === 'circle-icon') {
        const bg = ind.color || '#999999';
        dotHTML = `<div class="tl-dot" style="background:${bg}"><span class="tl-dot__icon">${ind.value}</span></div>`;
      } else if (ind.type === 'icon-only') {
        const color = ind.color || '#999999';
        dotHTML = `<div class="tl-icon-only"><span class="tl-icon-only__icon" style="color:${color}">${ind.value}</span></div>`;
      }

      const showLine = !isLast && item.line !== 'none';
      const lineClass = item.line === 'dashed' ? 'tl-line--dashed' : 'tl-line--solid';
      const lineHTML = showLine ? `<div class="tl-line ${lineClass}"></div>` : '';

      return `<div class="tl-item${showLine ? ' tl-item--lined' : ''}">
        <div class="tl-left">${dotHTML}${lineHTML}</div>
        <div class="tl-content">${item.description || ''}</div>
      </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${TIMELINE_CSS}</style><div class="tl">${rows}</div>`;
  }
}
customElements.define('labos-timeline', LabosTimeline);

// ── LabosStepper ───────────────────────────────────────────────────────────
const STEPPER_CSS = `
  :host { display: block; font-family: var(--font, 'Open Sans', sans-serif); }

  .stepper { display: flex; width: 100%; }

  /* Step column */
  .step {
    flex: 1;
    max-width: 240px;
    display: flex;
    flex-direction: column;
    align-items: center;
    min-width: 0;
  }

  /* Head row: line ─ indicator ─ line */
  .step-head { display: flex; align-items: center; width: 100%; }

  .step-line          { flex: 1; height: 1px; }
  .step-line--l       { margin-right: 12px; }
  .step-line--r       { margin-left:  12px; }
  .step-line--none    { background: transparent; }
  .step-line--solid   { background: #DBDBDB; }
  .step-line--ongoing { background: #266268; }

  /* Indicator */
  .step-dot {
    flex-shrink: 0;
    width: 30px; height: 30px;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
  }
  .step-dot__num {
    font-size: 14px; font-weight: 600; color: #fff;
    line-height: 1; user-select: none;
  }
  .step-dot__icon {
    font-family: 'Material Icons'; font-size: 18px; color: #fff;
    line-height: 1; font-weight: 400; font-style: normal; user-select: none;
  }

  /* State colours */
  .step--current  .step-dot { background: #266268; }
  .step--past     .step-dot { background: #266268; }
  .step--upcoming .step-dot { background: #AAAAAA; }
  .step--error    .step-dot { background: none; }
  .step--error    .step-dot__icon { font-size: 24px; color: #D80001; }

  /* Edit hover on editable past steps */
  .step--editable { cursor: pointer; }
  .step--editable .step-icon--edit  { display: none; }
  .step--editable:hover .step-icon--check { display: none; }
  .step--editable:hover .step-icon--edit  { display: block; }

  /* Body */
  .step-body {
    padding: 12px 24px 0;
    text-align: center;
    width: 100%; box-sizing: border-box;
    min-width: 0;
  }
  .step-label, .step-sublabel {
    font-size: 14px; line-height: 1.4;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
    color: #333333;
  }
  .step-sublabel { margin-top: 2px; color: #666666; }

  /* Text state colours */
  .step--current  .step-label   { color: #266268; font-weight: 600; }
  .step--current  .step-sublabel { color: #266268; }
  .step--upcoming .step-label   { color: #AAAAAA; }
  .step--upcoming .step-sublabel { color: #AAAAAA; }
  .step--error    .step-label   { color: #D80001; font-weight: 600; }
  .step--error    .step-sublabel { color: #D80001; }
`;

class LabosStepper extends HTMLElement {
  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._steps = this._steps || [];
    this._render();
    this._bindEvents();
  }

  setSteps(steps) {
    this._steps = steps || [];
    if (this.shadowRoot) this._render();
  }

  _lineType(steps, fromIdx, toIdx) {
    const from = steps[fromIdx];
    const to   = steps[toIdx];
    if (!from || !to) return 'none';
    return (from.state === 'past' && (to.state === 'past' || to.state === 'current'))
      ? 'ongoing' : 'solid';
  }

  _render() {
    const steps = this._steps;
    const rows = steps.map((step, i) => {
      const leftType  = i === 0               ? 'none' : this._lineType(steps, i - 1, i);
      const rightType = i === steps.length - 1 ? 'none' : this._lineType(steps, i, i + 1);

      let dotHTML;
      if (step.state === 'error') {
        dotHTML = `<div class="step-dot"><span class="step-dot__icon">warning</span></div>`;
      } else if (step.state === 'past') {
        const editIcons = step.editable
          ? `<span class="step-dot__icon step-icon--check">check</span>
             <span class="step-dot__icon step-icon--edit">edit</span>`
          : `<span class="step-dot__icon">check</span>`;
        dotHTML = `<div class="step-dot">${editIcons}</div>`;
      } else {
        dotHTML = `<div class="step-dot"><span class="step-dot__num">${step.number ?? i + 1}</span></div>`;
      }

      return `<div class="step step--${step.state}${step.editable ? ' step--editable' : ''}" data-index="${i}">
        <div class="step-head">
          <div class="step-line step-line--l step-line--${leftType}"></div>
          ${dotHTML}
          <div class="step-line step-line--r step-line--${rightType}"></div>
        </div>
        <div class="step-body">
          <div class="step-label">${step.label || ''}</div>
          ${step.sublabel ? `<div class="step-sublabel">${step.sublabel}</div>` : ''}
        </div>
      </div>`;
    }).join('');

    this.shadowRoot.innerHTML = `<style>${STEPPER_CSS}</style><div class="stepper">${rows}</div>`;
  }

  _bindEvents() {
    if (this._eventsReady || !this.shadowRoot) return;
    this._eventsReady = true;
    const tip = _getGridTip();
    const sr  = this.shadowRoot;

    sr.addEventListener('mouseover', e => {
      tip.style.display = 'none';
      const el = e.composedPath().find(n =>
        n.classList?.contains('step-label') || n.classList?.contains('step-sublabel'));
      if (!el || el.scrollWidth <= el.clientWidth) return;
      tip.textContent = el.textContent;
      tip.style.display = 'block';
      const rect = el.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
      const y = rect.top - tip.offsetHeight - 6;
      tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
      tip.style.top  = Math.max(4, y) + 'px';
    });
    sr.addEventListener('mouseleave', () => { tip.style.display = 'none'; });

    sr.addEventListener('click', e => {
      const step = e.composedPath().find(n => n.classList?.contains('step--editable'));
      if (!step) return;
      const idx = +step.dataset.index;
      this.dispatchEvent(new CustomEvent('labos-step-edit', {
        detail: { index: idx, step: this._steps[idx] },
        bubbles: true, composed: true,
      }));
    });
  }
}
customElements.define('labos-stepper', LabosStepper);

// ── LabosIndication ────────────────────────────────────────────────────────
const INDICATION_CSS = `
  :host {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .ind-icon {
    font-family: 'Material Icons';
    line-height: 1;
    font-weight: 400;
    font-style: normal;
    user-select: none;
    cursor: default;
  }
  .ind-icon--svg {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: default;
  }
  .ind-icon--svg svg { display: block; }
`;

// Custom SVG icons (not in Material Icons) — exact paths from icomoon\Custom-icons\*.svg, fill="currentColor"
const INDICATION_CUSTOM_ICONS = {
  // 14 rect segments + 4 arc corners (reserve_slide.svg)
  reserve_slide: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="100%" height="100%"><rect x="12.16" y="13.5" width="1.51" height="1.51" fill="currentColor"/><rect x="12.16" y="2.99" width="1.51" height="1.51" fill="currentColor"/><path d="M14.84,15V13.5h1.51a1.45,1.45,0,0,1-.46,1.06A1.42,1.42,0,0,1,14.84,15Z" fill="currentColor"/><rect x="14.84" y="8.24" width="1.51" height="1.51" fill="currentColor"/><rect x="14.84" y="10.89" width="1.51" height="1.48" fill="currentColor"/><rect x="9.49" y="2.99" width="1.48" height="1.51" fill="currentColor"/><path d="M14.84,3a1.45,1.45,0,0,1,1.06.46,1.45,1.45,0,0,1,.46,1.06H14.85V3Z" fill="currentColor"/><rect x="9.49" y="13.5" width="1.48" height="1.51" fill="currentColor"/><path d="M2.92,15A1.5,1.5,0,0,1,1.41,13.5H2.92V15Z" fill="currentColor"/><rect x="6.8" y="2.99" width="1.48" height="1.51" fill="currentColor"/><rect x="6.8" y="13.5" width="1.48" height="1.51" fill="currentColor"/><rect x="4.11" y="2.99" width="1.48" height="1.51" fill="currentColor"/><rect x="4.11" y="13.5" width="1.48" height="1.51" fill="currentColor"/><path d="M2.92,3V4.5H1.41A1.5,1.5,0,0,1,2.92,3Z" fill="currentColor"/><rect x="1.41" y="10.89" width="1.51" height="1.48" fill="currentColor"/><rect x="1.41" y="8.24" width="1.51" height="1.51" fill="currentColor"/><rect x="14.84" y="5.62" width="1.51" height="1.51" fill="currentColor"/><rect x="1.41" y="5.62" width="1.51" height="1.51" fill="currentColor"/></svg>',
  // Two C-brackets with rounded ends + 7 dashed center squares (split_sample.svg)
  split_sample: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="100%" height="100%"><path d="m3.45,4.81v8.13c0,.64.52,1.16,1.16,1.16h2.32v-1.16h-2.32V4.81h2.32v-1.16h-2.32c-.64,0-1.16.52-1.16,1.16Z" fill="currentColor"/><path d="m14.57,4.81v8.13c0,.64-.52,1.16-1.16,1.16h-2.32v-1.16h2.32V4.81h-2.32v-1.16h2.32c.64,0,1.16.52,1.16,1.16Z" fill="currentColor"/><rect x="8.43" y="2.16" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="4.23" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="6.31" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="8.38" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="10.46" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="12.53" width="1.16" height="1.16" fill="currentColor"/><rect x="8.43" y="14.61" width="1.16" height="1.16" fill="currentColor"/></svg>',
  // 3 outline circles + connecting arcs (shared_sample.svg)
  shared_sample: '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 18 18" width="100%" height="100%"><g transform="translate(5.972,0)"><path d="M3,7C1.3,7,0,5.7,0,4s1.3-3,3-3c1.7,0,3,1.3,3,3S4.7,7,3,7z M3,2.5C2.2,2.5,1.5,3.2,1.5,4S2.2,5.5,3,5.5c0.8,0,1.5-0.7,1.5-1.5S3.8,2.5,3,2.5z" fill="currentColor"/></g><g transform="translate(10.999,9.001)"><path d="M3,7C1.3,7,0,5.7,0,4s1.3-3,3-3s3,1.3,3,3S4.7,7,3,7z M3,2.5C2.2,2.5,1.5,3.2,1.5,4S2.2,5.5,3,5.5S4.5,4.8,4.5,4S3.8,2.5,3,2.5z" fill="currentColor"/></g><g transform="translate(0.999,9.001)"><path d="M3,7C1.3,7,0,5.7,0,4s1.3-3,3-3s3,1.3,3,3S4.7,7,3,7z M3,2.5C2.2,2.5,1.5,3.2,1.5,4S2.2,5.5,3,5.5S4.5,4.8,4.5,4S3.8,2.5,3,2.5z" fill="currentColor"/></g><path d="M3.8,10c0-1.9,1-3.6,2.6-4.5C6.1,5.1,6,4.6,6,4c-2.2,1.1-3.6,3.4-3.6,6c0,0.2,0,0.3,0,0.5C2.8,10.2,3.3,10.1,3.8,10z" fill="currentColor"/><path d="M12,4c0,0.5-0.1,1-0.4,1.4c1.6,0.9,2.7,2.6,2.7,4.6c0.5,0.1,1.1,0.3,1.5,0.6c0-0.2,0-0.4,0-0.6C15.8,7.3,14.2,5,12,4z" fill="currentColor"/><path d="M11.5,14.6c-0.7,0.4-1.5,0.6-2.4,0.6c-0.9,0-1.8-0.3-2.5-0.7c-0.3,0.5-0.7,0.8-1.2,1.1c1.1,0.7,2.3,1.1,3.7,1.1c1.3,0,2.6-0.4,3.6-1.1C12.2,15.5,11.8,15.1,11.5,14.6z" fill="currentColor"/></svg>'
};

class LabosIndication extends HTMLElement {
  static get observedAttributes() { return ['icon', 'color', 'size', 'label']; }

  connectedCallback() {
    if (!this.shadowRoot) this.attachShadow({ mode: 'open' });
    this._render();
    this._bindTooltip();
  }

  attributeChangedCallback() { if (this.shadowRoot) this._render(); }

  _render() {
    const icon  = this.getAttribute('icon')  || 'circle';
    const color = this.getAttribute('color') || '#00A3D9';
    const size  = this.getAttribute('size')  || '18';
    let iconHtml;
    if (INDICATION_CUSTOM_ICONS[icon]) {
      iconHtml = `<span class="ind-icon--svg" style="width:${size}px;height:${size}px;color:${color}">${INDICATION_CUSTOM_ICONS[icon]}</span>`;
    } else {
      iconHtml = `<span class="ind-icon" style="font-size:${size}px;color:${color}">${icon}</span>`;
    }
    this.shadowRoot.innerHTML = `<style>${INDICATION_CSS}</style>${iconHtml}`;
  }

  _bindTooltip() {
    if (this._tipReady) return;
    this._tipReady = true;
    const tip = _getGridTip();
    this.addEventListener('mouseenter', () => {
      const label = this.getAttribute('label');
      if (!label) return;
      const icon = this.shadowRoot?.querySelector('.ind-icon, .ind-icon--svg');
      if (!icon) return;
      tip.textContent = label;
      tip.style.display = 'block';
      const rect = icon.getBoundingClientRect();
      const x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
      const y = rect.top - tip.offsetHeight - 6;
      tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
      tip.style.top  = Math.max(4, y) + 'px';
    });
    this.addEventListener('mouseleave', () => { tip.style.display = 'none'; });
  }
}
customElements.define('labos-indication', LabosIndication);



// ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•ג•
// ═══════════════════════════════════════════════════════════════════════════════
// LABOS-LINE-CHART
// ─────────────────────────────────────────────────────────────────────────────
// Pure-SVG line chart — no external dependencies.
// Uses light DOM and IntersectionObserver lazy-init so the chart is only
// drawn once the element is actually visible (avoids zero-width renders
// from parent sections with display:none).
//
// Attributes:
//   title    — chart title
//   height   — chart height in px (default: 400)
//   y-title  — Y-axis label
//   legend   — "false" to hide the legend
//
// Methods:
//   setData(series, categories, opts?)
//     series     — [{ name, data, color? }, …]
//     categories — string[] for x-axis labels
//   getChart()   — returns null (compatibility stub)
//   reflow()     — force redraw (e.g. after manual show)
//
// Events:
//   labos-point-click — bubbles: { series, point, value, category }

(function () {
  if (document.getElementById('labos-lc-css')) return;
  const s = document.createElement('style');
  s.id = 'labos-lc-css';
  s.textContent = [
    'labos-line-chart{display:block}',
    '.lc-tip{position:fixed;z-index:9999;pointer-events:none;background:#fff;',
    'border:1px solid #C7DDDF;border-radius:3px;padding:8px 12px;',
    "font-family:'Open Sans','Segoe UI',Arial,sans-serif;font-size:12px;",
    'color:#333;box-shadow:0 2px 6px rgba(0,0,0,.15);display:none;min-width:120px}',
    '.lc-tip b{font-weight:600;display:block;margin-bottom:4px;color:#265F68}',
    '.lc-tip i{display:flex;align-items:center;gap:6px;line-height:1.8;font-style:normal}',
    '.lc-tip em{width:8px;height:8px;border-radius:50%;flex-shrink:0;display:inline-block}',
  ].join('');
  document.head.appendChild(s);
})();

class LabosLineChart extends HTMLElement {
  static get observedAttributes() { return ['title', 'height', 'y-title', 'legend']; }

  connectedCallback() {
    if (this._connected) return;
    this._connected = true;
    if (this._pending) { const d = this._pending; this._pending = null; this.setData(...d); }
  }

  attributeChangedCallback() { if (this._data) this._draw(); }

  setData(series, categories, opts) {
    this._data = [series, categories];
    this._opts = opts || {};
    if (!this._connected) { this._pending = [series, categories, opts]; return; }
    if (this.offsetWidth > 0) { this._draw(); } else { this._waitForVisible(); }
  }

  getChart() { return null; }

  reflow() { if (this._data && this.offsetWidth > 0) this._draw(); }

  _waitForVisible() {
    if (this._io) return;
    this._io = new IntersectionObserver(ens => {
      if (!ens[0].isIntersecting) return;
      this._io.disconnect(); this._io = null;
      if (this._data) this._draw();
    }, { threshold: 0.01 });
    this._io.observe(this);
  }

  _draw() {
    const [series, categories] = this._data;
    const W  = this.offsetWidth || 600;
    const H  = +(this.getAttribute('height') || 400);
    const ttl = this.getAttribute('title')   || '';
    const ytt = this.getAttribute('y-title') || '';
    const leg = this.getAttribute('legend')  !== 'false';
    const CLR = ['#265F68','#5ABA47','#1773E0','#FFA500','#C040B0','#FF0000','#D08F1F','#EF1AC5'];
    const F   = "'Open Sans','Segoe UI',Arial,sans-serif";
    const yAx  = (this._opts || {}).yAxis || {};
    const isLog = yAx.type === 'logarithmic';
    const yFmt  = yAx.labels && typeof yAx.labels.formatter === 'function' ? yAx.labels.formatter : null;

    const ML = 8 + (ytt ? 14 : 0) + 44;  // left: y-title + y-labels
    const MR = 16;
    const MT = ttl ? 38 : 14;
    const MB = 38;
    const LH = leg ? 26 : 0;
    const PW = W - ML - MR;
    const PH = H - MT - MB - LH;

    // Y ticks
    let ticks, yMin, yMax, sy;
    if (isLog) {
      ticks = yAx.tickPositions || [0.001, 0.01, 0.1, 1, 10, 100];
      yMin  = yAx.min != null ? yAx.min : ticks[0];
      yMax  = yAx.max != null ? yAx.max : ticks[ticks.length - 1];
      const lMin = Math.log10(yMin), lMax = Math.log10(yMax);
      sy = v => (v == null || v <= 0) ? null : MT + PH * (1 - (Math.log10(v) - lMin) / (lMax - lMin));
    } else {
      const vals = series.flatMap(s => s.data).filter(v => v != null);
      const vMin = Math.min(...vals), vMax = Math.max(...vals);
      const rng  = vMax - vMin || 1;
      const tick = this._nice(rng / 5, true);
      yMin = Math.floor(vMin / tick) * tick;
      yMax = Math.ceil(vMax / tick)  * tick;
      ticks = [];
      for (let v = yMin; v <= yMax + tick * 0.001; v += tick) ticks.push(+(v.toFixed(10)));
      sy = v => (v == null) ? null : MT + PH * (1 - (v - yMin) / (yMax - yMin));
    }
    const sx  = i  => ML + (categories.length > 1 ? PW * i / (categories.length - 1) : PW / 2);
    const xStep = Math.max(1, Math.ceil(categories.length / Math.floor(PW / 60)));

    let d = '';

    // Background
    d += `<rect width="${W}" height="${H}" fill="#fff"/>`;

    // Title
    if (ttl) d += `<text x="${+(ML+PW/2).toFixed(1)}" y="24" text-anchor="middle" `
      + `font-family="${F}" font-size="14" font-weight="600" fill="#333">${this._x(ttl)}</text>`;

    // Y-axis title (rotated)
    if (ytt) {
      const tx = 10, ty = +(MT + PH/2).toFixed(1);
      d += `<text transform="rotate(-90,${tx},${ty})" x="${tx}" y="${ty}" dominant-baseline="middle" `
        + `text-anchor="middle" font-family="${F}" font-size="11" fill="#666">${this._x(ytt)}</text>`;
    }

    // Grid lines + Y labels
    ticks.forEach(v => {
      const y = +sy(v).toFixed(1);
      d += `<line x1="${ML}" y1="${y}" x2="${ML+PW}" y2="${y}" stroke="#E4E4E4" stroke-width="1"/>`;
      const lbl = yFmt ? String(yFmt.call({ value: v })) : this._fmt(v);
      d += `<text x="${ML-6}" y="${y}" dominant-baseline="middle" text-anchor="end" `
        + `font-family="${F}" font-size="11" fill="#555">${this._x(lbl)}</text>`;
    });

    // Axis bottom line
    d += `<line x1="${ML}" y1="${+sy(yMin).toFixed(1)}" x2="${ML+PW}" y2="${+sy(yMin).toFixed(1)}" stroke="#C7DDDF" stroke-width="1"/>`;

    // X labels
    categories.forEach((cat, i) => {
      if (i % xStep !== 0 && i !== categories.length - 1) return;
      d += `<text x="${+sx(i).toFixed(1)}" y="${MT+PH+20}" text-anchor="middle" `
        + `font-family="${F}" font-size="11" fill="#555">${this._x(String(cat))}</text>`;
    });

    // Crosshair (hidden by default)
    d += `<line class="lc-xh" x1="0" y1="${MT}" x2="0" y2="${MT+PH}" `
      + `stroke="#C7DDDF" stroke-width="1" stroke-dasharray="4,3" visibility="hidden"/>`;

    // Series lines + markers
    series.forEach((s, si) => {
      const c = s.color || CLR[si % CLR.length];
      let path = '', seg = false;
      s.data.forEach((v, i) => {
        const y = sy(v);
        if (y == null) { seg = false; return; }
        const x = +sx(i).toFixed(1);
        path += seg ? `L${x},${+y.toFixed(1)}` : `M${x},${+y.toFixed(1)}`;
        seg = true;
      });
      if (path) d += `<path d="${path}" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>`;
      s.data.forEach((v, i) => {
        const y = sy(v);
        if (y == null) return;
        d += `<circle cx="${+sx(i).toFixed(1)}" cy="${+y.toFixed(1)}" r="4" `
          + `fill="${c}" stroke="#fff" stroke-width="1.5" `
          + `data-si="${si}" data-i="${i}" style="cursor:pointer"/>`;
      });
    });

    // Legend
    if (leg) {
      let lx = ML;
      series.forEach((s, si) => {
        const c = s.color || CLR[si % CLR.length];
        const ly = H - LH + 4;
        d += `<circle cx="${lx+5}" cy="${ly+8}" r="5" fill="${c}"/>`;
        d += `<text x="${lx+14}" y="${ly+12}" font-family="${F}" font-size="12" fill="#333">${this._x(s.name||'')}</text>`;
        lx += 14 + ((s.name||'').length * 7) + 18;
      });
    }

    // Transparent hit area
    d += `<rect class="lc-hit" x="${ML}" y="${MT}" width="${PW}" height="${PH}" `
      + `fill="transparent" style="cursor:crosshair"/>`;

    this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" style="display:block">${d}</svg>`;
    this._state = { series, categories, sx, sy, ML, PW, MT, PH, CLR };
    this._bindHover();
    this._bindClick();
    this._setupResize();
  }

  _bindHover() {
    const svg = this.querySelector('svg');
    if (!svg) return;
    const { series, categories, sx, sy, ML, PW, MT, PH, CLR } = this._state;
    const xh = svg.querySelector('.lc-xh');
    if (!this._tip) {
      this._tip = document.createElement('div');
      this._tip.className = 'lc-tip';
      document.body.appendChild(this._tip);
    }
    const tip = this._tip;

    const nearIdx = cx => {
      const rel = cx - svg.getBoundingClientRect().left - ML;
      return Math.max(0, Math.min(categories.length - 1, Math.round(rel / PW * (categories.length - 1))));
    };

    svg.addEventListener('mousemove', e => {
      const i = nearIdx(e.clientX);
      const x = +sx(i).toFixed(1);
      xh.setAttribute('x1', x); xh.setAttribute('x2', x); xh.setAttribute('visibility', 'visible');
      let html = `<b>${this._x(String(categories[i]))}</b>`;
      series.forEach((s, si) => {
        const c = s.color || CLR[si % CLR.length];
        html += `<i><em style="background:${c}"></em>${this._x(s.name||'')}: <strong>${this._fmt(s.data[i])}</strong></i>`;
      });
      tip.innerHTML = html; tip.style.display = 'block';
      const tw = tip.offsetWidth, th = tip.offsetHeight;
      let tx = e.clientX + 14, ty = e.clientY - th / 2;
      if (tx + tw > innerWidth - 8) tx = e.clientX - tw - 14;
      ty = Math.max(8, Math.min(innerHeight - th - 8, ty));
      tip.style.left = tx + 'px'; tip.style.top = ty + 'px';
    });

    svg.addEventListener('mouseleave', () => {
      xh.setAttribute('visibility', 'hidden');
      tip.style.display = 'none';
    });
  }

  _bindClick() {
    const svg = this.querySelector('svg');
    if (!svg) return;
    const { series, categories } = this._state;
    svg.querySelectorAll('circle[data-si]').forEach(pt => {
      pt.addEventListener('click', () => {
        const si = +pt.dataset.si, i = +pt.dataset.i;
        this.dispatchEvent(new CustomEvent('labos-point-click', {
          detail: { series: series[si].name, point: i, value: series[si].data[i], category: categories[i] },
          bubbles: true, composed: true,
        }));
      });
    });
  }

  _setupResize() {
    if (this._ro) return;
    this._ro = new ResizeObserver(() => { if (this._data && this.offsetWidth > 0) this._draw(); });
    this._ro.observe(this);
  }

  _nice(r, round) {
    const e = Math.floor(Math.log10(r)), f = r / Math.pow(10, e);
    const nf = round ? (f<1.5?1:f<3?2:f<7?5:10) : (f<=1?1:f<=2?2:f<=5?5:10);
    return nf * Math.pow(10, e);
  }

  _fmt(n) {
    if (Math.abs(n) >= 1e6) return (n/1e6).toFixed(1)+'M';
    if (Math.abs(n) >= 1e3) return (n/1e3).toFixed(1)+'k';
    return Number.isInteger(n) ? String(n) : n.toFixed(1);
  }

  _x(s) { return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

  disconnectedCallback() {
    if (this._io) { this._io.disconnect(); this._io = null; }
    if (this._ro) { this._ro.disconnect(); this._ro = null; }
    if (this._tip) { this._tip.remove(); this._tip = null; }
    this._connected = false;
  }
}
customElements.define('labos-line-chart', LabosLineChart);

// ══════════════════════════════════════════════════════════════════════════════
// LABOS-FILTER  <labos-filter>
// ─────────────────────────────────────────────────────────────────────────────
// JS API:
//   setFilters([{ name, count, value }])
//   setActiveFilter({ name, chips:[{ label, value }] })
//   clearActiveFilter()
//   open() / close() / toggle()
// Events:
//   labos-filter-select      -> { value, name }
//   labos-filter-action      -> { action }  — reload|save-as|edit|clear|share
//   labos-filter-chip-remove -> { value }
//   labos-filter-settings
//   labos-filter-search      -> { query }
//   labos-open / labos-close
// ══════════════════════════════════════════════════════════════════════════════

const FILTER_CSS =
  HOST_BOX +
  '.material-icons{font-family:Material Icons;font-weight:400;font-style:normal;line-height:1;display:inline-block;text-transform:none;letter-spacing:normal;word-wrap:normal;white-space:nowrap;direction:ltr}' +
  ':host{display:contents}' +
  '.lf-overlay{display:none;position:fixed;top:var(--lf-top,0px);left:0;right:0;bottom:0;z-index:600;flex-direction:column;overflow:hidden}' +
  ':host([open]) .lf-overlay{display:flex}' +
  '.lf-panel{background:#fff;box-shadow:0 0 5px rgba(0,0,0,.25);padding:16px;display:flex;flex-direction:column;gap:16px;flex-shrink:0;transform:translateY(-100%);transition:transform .2s ease}' +
  ':host([open]) .lf-panel{transform:translateY(0)}' +
  '.lf-backdrop{flex:1;background:rgba(0,0,0,.4);cursor:pointer;opacity:0;transition:opacity .2s ease}' +
  ':host([open]) .lf-backdrop{opacity:1}' +
  ':host([pinned]){display:block;flex-shrink:0}' +
  ':host([pinned]) .lf-overlay{display:flex!important;position:static;overflow:visible}' +
  ':host([pinned]) .lf-backdrop{display:none!important}' +
  ':host([pinned]) .lf-panel{transform:translateY(0)!important;transition:none;box-shadow:none;border-bottom:1px solid #e0e0e0}' +
  ':host([pinned]) .lf-pin-btn{--white:#d8e7e8;--primary-20:#6d9ca1}' +
  '.lf-row1{display:flex;align-items:center;position:relative}' +
  '.lf-gallery-wrap{flex:1;min-width:0;position:relative;display:flex;align-items:center;overflow:hidden;height:36px;margin-left:-8px}.lf-nav-prev{position:relative;z-index:1}' +
  '.lf-gallery-scroll{display:flex;align-items:center;gap:8px;overflow-x:scroll;scrollbar-width:none;flex:1;scroll-behavior:smooth;padding-right:44px;padding-left:8px}' +
  '.lf-gallery-scroll::-webkit-scrollbar{display:none}' +
  '.lf-fade{position:absolute;right:0;top:0;bottom:0;width:44px;background:linear-gradient(to left,#fff 0%,rgba(255,255,255,0) 100%);pointer-events:none}.lf-fade-left{position:absolute;left:0;top:0;bottom:0;width:44px;background:linear-gradient(to right,#fff 0%,rgba(255,255,255,0) 100%);pointer-events:none}' +
  
  '.lf-search-field{display:none;width:220px;--lrs-opt-height:48px;--lrs-opt-padding:0 16px;--lrs-opt-fw:400}.lf-right-actions.lf-searching .lf-search-btn{display:none}.lf-right-actions.lf-searching .lf-search-field{display:block}.lf-nav-prev[disabled],.lf-nav-next[disabled]{opacity:.4;pointer-events:none}' +
  '.lf-search-input{flex:1;height:36px;border:1px solid #c8dddf;border-radius:18px;padding:0 16px;font:400 14px/1 Open Sans,sans-serif;color:#333;outline:none}' +
  '.lf-search-input:focus{border-color:#266268}' +
  '.lf-right-actions{display:flex;align-items:center;flex-shrink:0}' +
  '.lf-pin-btn{margin-left:8px}' +
  '.lf-nav-prev,.lf-nav-next{--lb-icon-size:28px}' +
  '' +
  '.chip{display:inline-flex;align-items:center;justify-content:center;gap:6px;height:36px;flex-shrink:0;padding:0 14px;background:#fff;border:1px solid #c8dddf;border-radius:18px;cursor:pointer;font-family:Open Sans,sans-serif;font-size:14px;color:#265f68;white-space:nowrap;user-select:none;transition:background 120ms,border-color 120ms;outline:none}' +
  '.chip:hover{background:#edf4f5}' +
  '.chip[selected]{background:#d8e7e8;border-color:#6d9ca1}' +
  '.chip--counter{gap:10px;padding-right:10px}' +
  '.chip__label{position:relative;top:-1px}' +
  '.lf-row2{display:flex;align-items:center;flex-wrap:wrap}' +
  '.lf-row2.lf-hidden{display:none}' +
  '.chv-label{font:600 14px/1 Open Sans,sans-serif;color:#333;white-space:nowrap;padding-right:12px;flex-shrink:0}' +
  '.chv-chips{display:flex;align-items:center;gap:8px;flex-wrap:wrap}' +
  '.chs-chip{display:inline-flex;align-items:center;height:36px;padding:0 8px 2px 14px;border-radius:18px;border:none;background:#e4e4e4;font-family:Open Sans,sans-serif;font-size:14px;color:#333333;gap:8px;cursor:pointer;user-select:none;outline:none;transition:background 120ms,box-shadow 120ms}' +
  '.chs-chip:hover{background:#d8d8d8}' +
  '.chs-chip:active{background:#bcbcbc;box-shadow:0 3px 1px -2px rgba(0,0,0,.2),0 2px 2px 0 rgba(0,0,0,.14),0 1px 5px 0 rgba(0,0,0,.12)}' +
  '.chs-chip--small{height:28px;font-size:13px;color:#555555;background:#e4e4e4;padding:0 6px 2px 11px;gap:5px}' +
  '.chs-chip--small:hover{background:#d8d8d8}' +
  '.chs-chip__close{display:inline-flex;align-items:center;justify-content:center;font-family:Material Icons;font-size:18px;font-weight:400;font-style:normal;line-height:1;flex-shrink:0;color:currentColor;opacity:.4;transform:translateY(1px)}' +
  '.lf-actions{display:flex;align-items:center;flex-shrink:0;padding-left:12px}' +
  '.lf-actions labos-button{flex-shrink:0}';

const FILTER_TPL =
  '<div class="lf-overlay">' +
    '<div class="lf-panel">' +
      '<div class="lf-row1">' +
        '<labos-button class="lf-nav-prev" icon="chevron_left" icon-only title="Previous"></labos-button>' +
        '<div class="lf-gallery-wrap">' +
          '<div class="lf-gallery-scroll"></div>' +
          '<div class="lf-fade-left"></div>' +
          '<div class="lf-fade"></div>' +
        '</div>' +
        '<labos-button class="lf-nav-next" icon="chevron_right" icon-only title="Next"></labos-button>' +
        '<div class="lf-right-actions">' +
          '<labos-button class="lf-search-btn" icon="search" icon-only title="Search filter"></labos-button>' +
          '<labos-rounded-search class="lf-search-field" mode="search" always-clear placeholder="Search filter"></labos-rounded-search>' +
          '<labos-button class="lf-settings-btn" icon="settings" icon-only title="Filters management"></labos-button>' +
          '<labos-button class="lf-pin-btn" icon="push_pin" shape="rounded" title="Pin filter"></labos-button>' +
        '</div>' +
      '</div>' +
      '<div class="lf-row2 lf-hidden">' +
        '<span class="chv-label"></span>' +
        '<div class="chv-chips"></div>' +
        '<div class="lf-actions">' +
          '<labos-button icon="refresh"      icon-only size="small" data-action="refresh" title="Refresh"></labos-button>' +
          '<labos-button icon="content_copy" icon-only size="small" data-action="save-as" title="Save as"></labos-button>' +
          '<labos-button icon="mode_edit"    icon-only size="small" data-action="edit"    title="Edit"></labos-button>' +
          '<labos-button icon="clear_all"    icon-only size="small" data-action="clear"   title="Clear"></labos-button>' +
          '<labos-button icon="share"        icon-only size="small" data-action="share"   title="Share"></labos-button>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="lf-backdrop"></div>' +
  '</div>';

class LabosFilter extends HTMLElement {
  static get observedAttributes() { return ['top-offset']; }

  attributeChangedCallback(name, _, val) {
    if (name === 'top-offset') this.style.setProperty('--lf-top', (parseInt(val) || 0) + 'px');
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._filters = [];
    this._chips = [];
    this._filterName = '';
    this._searchQuery = '';
    this._selectedValue = null;
    this._pinned = false;
    this._ready = false;
    this.shadowRoot.innerHTML = '<style>' + FILTER_CSS + '</style>' + FILTER_TPL;
  }

  connectedCallback() {
    if (this._ready) return;
    this._ready = true;
    var sr = this.shadowRoot;
    sr.querySelector('.lf-backdrop').addEventListener('click', () => this.close());
    sr.querySelector('.lf-search-btn').addEventListener('click', () => this._openSearch());
    sr.querySelector('.lf-search-field').addEventListener('labos-select', e => {
      var f = this._filters.find(function(x) { return x.value === e.detail.value; });
      if (f) {
        this._selectedValue = f.value;
        this._filterName = f.name;
        sr.querySelector('.chv-label').textContent = f.name;
        sr.querySelector('.lf-row2').classList.remove('lf-hidden');
        this._renderGallery();
        this.close();
        this._emit('labos-filter-select', { value: f.value, name: f.name });
      }
    });
    sr.querySelector('.lf-settings-btn').addEventListener('click', () => this._emit('labos-filter-settings', {}));
    sr.querySelector('.lf-search-field').addEventListener('labos-clear', () => this._closeSearch());
    [sr.querySelector('.lf-search-btn'), sr.querySelector('.lf-settings-btn'), sr.querySelector('.lf-pin-btn')].forEach(function(btn) {
      if (!btn) return;
      btn.addEventListener('mouseenter', function() {
        var tip = _getGridTip();
        tip.textContent = btn.title;
        tip.style.display = 'block';
        var rect = btn.getBoundingClientRect();
        var x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
        var y = rect.top - tip.offsetHeight - 6;
        tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
        tip.style.top = Math.max(4, y) + 'px';
      });
      btn.addEventListener('mouseleave', function() { _getGridTip().style.display = 'none'; });
    });
    sr.querySelector('.lf-pin-btn').addEventListener('click', () => this._togglePin());
    sr.querySelector('.lf-nav-prev').addEventListener('click', () => this._scrollGallery(-1));
    sr.querySelector('.lf-nav-next').addEventListener('click', () => this._scrollGallery(1));
    sr.querySelector('.lf-gallery-scroll').addEventListener('scroll', () => this._updateNavButtons());
    new ResizeObserver(() => this._updateNavButtons()).observe(sr.querySelector('.lf-gallery-scroll'));
    window.addEventListener('resize', () => this._updateNavButtons());
    setTimeout(() => this._updateNavButtons(), 0);
    sr.querySelectorAll('labos-button[data-action]').forEach(btn => {
      btn.addEventListener('click', () => {
        var action = btn.dataset.action;
        this.close();
        this._emit('labos-filter-action', { action: action });
      });
      btn.addEventListener('mouseenter', function() {
        var tip = _getGridTip();
        tip.textContent = btn.title;
        tip.style.display = 'block';
        var rect = btn.getBoundingClientRect();
        var x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
        var y = rect.top - tip.offsetHeight - 6;
        tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
        tip.style.top = Math.max(4, y) + 'px';
      });
      btn.addEventListener('mouseleave', function() { _getGridTip().style.display = 'none'; });
    });
  }

  _updateNavButtons() {
    var scroll = this.shadowRoot.querySelector('.lf-gallery-scroll');
    var prev = this.shadowRoot.querySelector('.lf-nav-prev');
    var next = this.shadowRoot.querySelector('.lf-nav-next');
    var fl = this.shadowRoot.querySelector('.lf-fade-left');
    if (!scroll || !prev || !next) return;
    var pr = parseInt(getComputedStyle(scroll).paddingRight) || 0;
    var hasScroll = scroll.scrollWidth - pr > scroll.clientWidth;
    var atStart = scroll.scrollLeft <= 0;
    var atEnd = scroll.scrollLeft + scroll.clientWidth >= scroll.scrollWidth - pr;
    prev.style.display = hasScroll ? '' : 'none';
    next.style.display = hasScroll ? '' : 'none';
    if (hasScroll) {
      prev.toggleAttribute('disabled', atStart);
      next.toggleAttribute('disabled', atEnd);
    }
    if (fl) fl.style.display = (hasScroll && !atStart) ? '' : 'none';
  }

    _togglePin() {
    this._pinned = !this._pinned;
    if (this._pinned) {
      this.setAttribute('pinned', '');
      this.setAttribute('open', '');
    } else {
      this.removeAttribute('pinned');
      this.removeAttribute('open');
    }
    this._emit('labos-filter-pin', { pinned: this._pinned });
  }

  _emit(name, detail) {
    this.dispatchEvent(new CustomEvent(name, { bubbles: true, composed: true, detail: detail }));
  }

  _openSearch() {
    this.shadowRoot.querySelector('.lf-right-actions').classList.add('lf-searching');
    var sf = this.shadowRoot.querySelector('.lf-search-field');
    sf.value = '';
    sf.setOptions(this._filters.map(function(f) { return { label: f.name, value: f.value }; }));
    var pi = sf.shadowRoot && sf.shadowRoot.querySelector('.pill-input');
    if (pi) pi.focus();
  }

  _closeSearch() {
    this.shadowRoot.querySelector('.lf-right-actions').classList.remove('lf-searching');
    this._searchQuery = '';
    this._renderGallery();
  }

  _scrollGallery(dir) {
    this.shadowRoot.querySelector('.lf-gallery-scroll').scrollLeft += dir * 300;
  }

  _renderGallery() {
    var scroll = this.shadowRoot.querySelector('.lf-gallery-scroll');
    var q = this._searchQuery.toLowerCase();
    var visible = q ? this._filters.filter(f => f.name.toLowerCase().includes(q)) : this._filters;
    scroll.innerHTML = visible.map(f =>
      '<button class="chip' + (f.count != null ? ' chip--counter' : '') + '"' + (f.value === this._selectedValue ? ' selected' : '') + ' data-value="' + f.value + '">' +
        '<span class="chip__label">' + f.name + '</span>' +
        (f.count != null ? '<labos-badge rounded label="' + f.count + '" bg="#ecbc02"></labos-badge>' : '') +
      '</button>'
    ).join('');
    scroll.querySelectorAll('.chip').forEach(chip => {
      var f = visible.find(x => x.value === chip.dataset.value);
      chip.addEventListener('click', () => {
        this._selectedValue = f.value;
        this._filterName = f.name;
        this.shadowRoot.querySelector('.chv-label').textContent = f.name;
        this.shadowRoot.querySelector('.lf-row2').classList.remove('lf-hidden');
        this.close();
        this._emit('labos-filter-select', { value: f.value, name: f.name });
      });
    });
    setTimeout(() => this._updateNavButtons(), 0);
  }

  _renderActiveChips() {
    var container = this.shadowRoot.querySelector('.chv-chips');
    container.innerHTML = this._chips.map(c =>
      '<span class="chs-chip chs-chip--small" data-value="' + (c.key != null ? c.key : c.value) + '" data-tip="' + c.label + '">' +
        c.value +
        '<span class="chs-chip__close">close</span>' +
      '</span>'
    ).join('');
    container.querySelectorAll('.chs-chip').forEach(el => {
      el.querySelector('.chs-chip__close').addEventListener('click', e => {
        e.stopPropagation();
        var val = el.dataset.value;
        this._chips = this._chips.filter(c => (c.key != null ? c.key : c.value) !== val);
        this._renderActiveChips();
        this.close();
        this._emit('labos-filter-chip-remove', { value: val });
      });
      el.addEventListener('mouseenter', () => {
        var tip = _getGridTip();
        tip.textContent = el.dataset.tip;
        tip.style.display = 'block';
        var rect = el.getBoundingClientRect();
        var x = rect.left + rect.width / 2 - tip.offsetWidth / 2;
        var y = rect.top - tip.offsetHeight - 6;
        tip.style.left = Math.max(4, Math.min(window.innerWidth - tip.offsetWidth - 4, x)) + 'px';
        tip.style.top  = Math.max(4, y) + 'px';
      });
      el.addEventListener('mouseleave', () => { _getGridTip().style.display = 'none'; });
    });
  }

  setFilters(filters) {
    this._filters = filters || [];
    if (this._filterName && !this._selectedValue) {
      var m = this._filters.find(f => f.name === this._filterName);
      if (m) this._selectedValue = m.value;
    }
    this._renderGallery();
    return this;
  }

  setActiveFilter(data) {
    this._filterName = data.name || '';
    this._chips = data.chips || [];
    var match = this._filters.find(f => f.name === this._filterName);
    if (match) this._selectedValue = match.value;
    var sr = this.shadowRoot;
    sr.querySelector('.chv-label').textContent = this._filterName;
    this._renderActiveChips();
    this._renderGallery();
    sr.querySelector('.lf-row2').classList.remove('lf-hidden');
    return this;
  }

  clearActiveFilter() {
    this._filterName = '';
    this._chips = [];
    this.shadowRoot.querySelector('.lf-row2').classList.add('lf-hidden');
    return this;
  }

  open() {
    this.setAttribute('open', '');
    this._emit('labos-open', {});
    setTimeout(() => this._updateNavButtons(), 0);
    return this;
  }

  close() {
    if (this._pinned) return this;
    this.removeAttribute('open');
    this._closeSearch();
    this._emit('labos-close', {});
    return this;
  }

  toggle() {
    return this.hasAttribute('open') ? this.close() : this.open();
  }
}
customElements.define('labos-filter', LabosFilter);