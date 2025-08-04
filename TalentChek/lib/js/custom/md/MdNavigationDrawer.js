import { abreElementoHtml } from "../abreElementoHtml.js"
import { cierraElementoHtmo } from "../cierraElementoHtml.js"
import { html } from "../html.js"
import { querySelector } from "../querySelector.js"

export class MdNavigationDrawer extends HTMLElement {

 /**
  * @returns {{htmlTxt: string;}}
  */
 getHipervinculos() { throw new Error("abstract") }

 getContent() {
  return html`

   <link rel="stylesheet" href="/lib/css/material-symbols-outlined.css">
   <link rel="stylesheet" href="/lib/css/shape.css">
   <link rel="stylesheet" href="/lib/css/md-ripple.css">

   <style>

    nav {
     display: flex;
     flex-direction: column;
     position: fixed;
     z-index: 4;
     box-sizing: border-box;
     top: 0;
     left: 0;
     bottom: 0;
     width: var(--anchoNav);
     max-width: 80vw;
     overflow: hidden;
     transform: translateX(-100%);
     background-color: var(--md-sys-color-surface-container-low);
     transition-property: transform;
     transition-duration: var(--md-sys-motion-duration-700);
    }

    :host(.open) nav {
     transform: translateX(0);
    }

    nav>div {
     flex-grow: 1;
     overflow: auto;
     padding: 12px 16px;
    }

    h1 {
     margin: 0;
     height: 56px;
     line-height: 56px;
     padding: 0 0 0 12px;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
     color: var(--md-sys-color-on-surface-variant);
     font-family: var(--md-sys-typescale-title-small-font);
     font-weight: var(--md-sys-typescale-title-small-weight);
     font-size: var(--md-sys-typescale-title-small-size);
     font-style: var(--md-sys-typescale-title-small-font-style);
     letter-spacing: var(--md-sys-typescale-title-small-tracking);
     text-transform: var(--md-sys-typescale-title-small-text-transform);
     text-decoration: var(--md-sys-typescale-title-small-text-decoration);
    }

    a::after { /* container inactive */
     content: "";
     position: absolute;
     z-index: -2;
     top: 0;
     right: 0;
     left: 0;
     bottom: 0;
    }

    a.active::after { /* container */
     background-color: var(--md-sys-color-secondary-container);
    }

    a { /* label, shape inactive */
     position: relative;
     display: block;
     box-sizing: border-box;
     height: 56px;
     line-height: 56px;
     padding: 0 12px;
     border-radius: 28px;
     color: var(--md-sys-color-on-surface-variant);
     font-family: var(--md-sys-typescale-label-large-font);
     font-weight: var(--md-sys-typescale-label-large-weight);
     font-size: var(--md-sys-typescale-label-large-size);
     font-style: var(--md-sys-typescale-label-large-font-style);
     letter-spacing: var(--md-sys-typescale-label-large-tracking);
     text-transform: var(--md-sys-typescale-label-large-text-transform);
     text-decoration: var(--md-sys-typescale-label-large-text-decoration);
     overflow: hidden;
     white-space: nowrap;
     text-overflow: ellipsis;
    }

    a.active { /* label, shape */
     font-weight: var(--md-sys-typescale-label-large-weight-prominent);
     color: var(--md-sys-color-on-secondary-container);
    }

    a::before { /* state layer */
     content: "";
     position: absolute;
     z-index: -1;
     top: 0;
     right: 0;
     left: 0;
     bottom: 0;
    }

    a span { /* inactive icon */
     position: relative;
     margin-right: 12px;
     vertical-align: middle;
     color: var(--md-sys-color-on-surface-variant);
     font-size: 24px;
     width: 24px;
     height: 24px;
    }

    a.active span { /* icon */
     color: var(--md-sys-color-on-secondary-container);
    }

    #scrim {
     position: fixed;
     z-index: 3;
     top: 0;
     left: 0;
     bottom: 0;
     right: 0;
     background-color: var(--md-ref-palette-neutral-variant20);
     opacity: 0.4;
     transform: translateX(-100%);
     transition-property: transform;
     animation-duration: var(--md-sys-motion-duration-700);
    }

    :host(.open) #scrim {
     transform: translateX(0);
    }

    a:hover { /* inactive label, shape */
     color: var(--md-sys-color-on-surface);
    }

    a.active:hover { /* active label, shape */
     color: var(--md-sys-color-on-secondary-container);
    }

    a:hover::before { /* inactive state layer */
     background-color: var(--md-sys-color-on-surface);
     opacity: var(--md-sys-state-hover-state-layer-opacity);
    }

    a.active:hover::before { /* state layer */
      background-color: var(--md-sys-color-on-secondary-container);
    }

    a:hover span { /* inactive icon */
     color: var(--md-sys-color-on-surface);
    }

    a.active:hover span { /* icon */
     color: var(--md-sys-color-on-secondary-container);
    }

    a:focus { /* inactive label, shape */
     outline: none;
     color: var(--md-sys-color-on-surface);
    }

    a.active:focus { /* label, shape */
     color: var(--md-sys-color-on-secondary-container);
    }

    a:focus::before { /* inactive state layer */
     background-color: var(--md-sys-color-on-surface);
     opacity: var(--md-sys-state-focus-state-layer-opacity);
    }

    a.active:focus::before { /* state layer */
     background-color: var(--md-sys-color-on-secondary-container);
    }

    a:focus span { /* inactive icon */
     color: var(--md-sys-color-on-surface);
    }

    a.active:focus span { /* icon */
     color: var(--md-sys-color-on-secondary-container);
    }


    a:active { /* inactive pressed label, shape */
     background-position: center;
     background-image:
      radial-gradient(circle, var(--md-riple-color) 1%, transparent 1%);
     background-size: 100%;
     animation-name: md-ripple;
     animation-duration: var(--md-sys-motion-duration-500);
     color: var(--md-sys-color-on-surface);
    }

    a.active:active { /* active pressed label, shape */
     color: var(--md-sys-color-on-secondary-container);
    }

    a:active::before { /* inactive pressed state layer */
     background-color: var(--md-sys-color-on-surface);
     opacity: var(--md-sys-state-pressed-state-layer-opacity);
    }

    a.active:active::before { /* active pressed state layer */
     background-color: var(--md-sys-color-on-secondary-container);
    }

    a:active span { /* inactive pressed icon */
     color: var(--md-sys-color-on-surface);
    }
     
    a.active:focus span { /* active pressed icon */
     color: var(--md-sys-color-on-secondary-container);
    }

   </style>

   <div id="scrim" onclick="${this.cierra}"></div>
   <nav class="large-end"><div></div></nav>`.htmlTxt
 }

 constructor() {
  super()
  const shadow = this.attachShadow({ mode: "open", delegatesFocus: true })
  shadow.innerHTML = this.getContent()

  /** @type {HTMLUListElement} */
  this._div = querySelector(shadow, "nav>div")
 }

 connectedCallback() {
  this.hidden = true
  this._div.innerHTML = this.getHipervinculos().htmlTxt
 }

 abre() {
  abreElementoHtml(this)
 }

 cierra() {
  cierraElementoHtmo(this)
 }

}