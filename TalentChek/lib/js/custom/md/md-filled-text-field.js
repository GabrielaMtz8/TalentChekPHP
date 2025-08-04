import { getAttribute } from "../getAttribute.js"
import { html } from "../html.js"
import { querySelector } from "../querySelector.js"

export class MdFilledTextField extends HTMLElement {

 static get observedAttributes() {
  return ["value"]
 }

 getContent() {
  return html`

   <link rel="stylesheet" href="/lib/css/shape.css">

   <style>

    :host {
     display: block;
     position: relative;
     margin: 16px;
    }

    :host([hidden]) {
     display: none;
    }

    #container {
     position: relative;
     background-color: var(--md-sys-color-surface-container-highest);
     overflow: hidden;
    }

    #stateLayer { /* state layer */
     content: "";
     position: absolute;
     top: 0;
     right: 0;
     left: 0;
     bottom: 0;
    }

    #cabecera {
     position: relative;
     padding: 8px 16px 0 16px;
     height: var(--md-sys-typescale-body-small-line-height);
    }

    :host(.select) #cabecera {
     padding-right: 48px;
    }

    #label::slotted(*) {
     display: block;
     transform: translateY(16px);
     transition-property: transform;
     transition-duration: var(--md-sys-motion-duration-300);
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
     color: var(--md-sys-color-on-surface-variant);
     font-family: var(--md-sys-typescale-body-large-font);
     font-weight: var(--md-sys-typescale-body-large-weight);
     font-size: var(--md-sys-typescale-body-large-size);
     font-style: var(--md-sys-typescale-body-large-font-style);
     letter-spacing: var(--md-sys-typescale-body-large-tracking);
     line-height: var(--md-sys-typescale-body-large-line-height);
     text-transform: var(--md-sys-typescale-body-large-text-transform);
     text-decoration: var(--md-sys-typescale-body-large-text-decoration);
    }

    :host(:focus-within) #label::slotted(*),
    :host(.populated) #label::slotted(*),
    :host(.float) #label::slotted(*) {
     transform: translateY(0);
    }

    :host(:focus-within) #label::slotted(*),
    :host(.populated) #label::slotted(*),
    :host(.float) #label::slotted(*) {
     font-family: var(--md-sys-typescale-body-small-font);
     font-weight: var(--md-sys-typescale-body-small-weight);
     font-size: var(--md-sys-typescale-body-small-size);
     font-style: var(--md-sys-typescale-body-small-font-style);
     letter-spacing: var(--md-sys-typescale-body-small-tracking);
     line-height: var(--md-sys-typescale-body-small-line-height);
     text-transform: var(--md-sys-typescale-body-small-text-transform);
     text-decoration: var(--md-sys-typescale-body-small-text-decoration);
    }

    #relleno {
     position: relative;
     display: flex;
     flex-direction: column;
     align-items: stretch;
     padding: 0 16px;
    }

    :host(.select) #relleno {
     padding-right: 48px;
    }

    [name="input-text"]::slotted(*) {
     caret-color: var(--md-sys-color-primary);
     min-height: 24px;
     border: none;
     padding: 0;
     resize: none;
     color: var(--md-sys-color-on-surface);
     font-family: var(--md-sys-typescale-body-large-font);
     font-weight: var(--md-sys-typescale-body-large-weight);
     font-size: var(--md-sys-typescale-body-large-size);
     font-style: var(--md-sys-typescale-body-large-font-style);
     letter-spacing: var(--md-sys-typescale-body-large-tracking);
     line-height: var(--md-sys-typescale-body-large-line-height);
     text-transform: var(--md-sys-typescale-body-large-text-transform);
     text-decoration: var(--md-sys-typescale-body-large-text-decoration);
     background-color: transparent;
     outline: none;
    }

    #activeIndicator {
     box-sizing: border-box;
     height: 8px;
     border-bottom-width: 1px;
     border-bottom-style: solid;
     border-bottom-color: var(--md-sys-color-on-surface-variant);
    }

    [name="supporting"]::slotted(*) {
     display: block;
     color: var(--md-sys-color-on-surface-variant);
     font-family: var(--md-sys-typescale-body-small-font);
     font-weight: var(--md-sys-typescale-body-small-weight);
     font-size: var(--md-sys-typescale-body-small-size);
     font-style: var(--md-sys-typescale-body-small-font-style);
     letter-spacing: var(--md-sys-typescale-body-small-tracking);
     line-height: var(--md-sys-typescale-body-small-line-height);
     text-transform: var(--md-sys-typescale-body-small-text-transform);
     text-decoration: var(--md-sys-typescale-body-small-text-decoration);
     padding: 4px 16px 0 16px;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
    }

    :host(:hover) #label::slotted(*) {
     color: var(--md-sys-color-on-surface-variant);
    }

    :host(:hover) #stateLayer,
    :host(.invalid:hover) #stateLayer {
     background-color: var(--md-sys-color-on-surface);
     opacity: var(--md-sys-state-hover-state-layer-opacity);
    }

    :host(:hover) [name="input-text"]::slotted(*) {
     color: var(--md-sys-color-on-surface);
    }

    :host(:hover) #activeIndicator {
     border-bottom-width: 1px;
     border-bottom-color: var(--md-sys-color-on-surface);
    }

    :host(:hover) [name="supporting"]::slotted(*) {
     color: var(--md-sys-color-on-surface-variant);
    }

    :host(:focus-within) #label::slotted(*)  {
     color: var(--md-sys-color-primary);
    }

    [name="input-text"]::slotted(:focus) {
     color: var(--md-sys-color-on-surface);
     outline: none;
    }

    :host(:focus-within)  #activeIndicator {
     border-bottom-width: 2px;
     border-bottom-color: var(--md-sys-color-primary);
    }

    :host(:focus-within) [name="supporting"]::slotted(*) {
     color: var(--md-sys-color-on-surface-variant);
    }

    :host(.invalid) [name="input-text"]::slotted(*),
    :host(.invalid:focus-within) [name="input-text"]::slotted(*),
    [name="input-text"]::slotted(:invalid) {
     color: var(--md-sys-color-on-surface);
    }

    :host(.invalid) #activeIndicator,
    :host(.invalid:focus-within) #activeIndicator {
     border-bottom-color: var(--md-sys-color-error);
    }

    :host(.invalid) #label::slotted(*) {
     color: var(--md-sys-color-error);
    }

    :host(.invalid) [name="supporting"]::slotted(*),
    :host(.invalid:hover) [name="supporting"]::slotted(*),
    :host(.invalid:focus-within) [name="supporting"]::slotted(*) {
     color: var(--md-sys-color-error);
    }

    [name="input-text"]::slotted(:focus:invalid) {
     caret-color: var(--md-sys-color-error);
    }

    :host(.invalid:hover) [name="input-text"]::slotted(*) {
     color: var(--md-sys-color-on-surface);
    }

    :host(.invalid:hover) #activeIndicator {
     border-bottom-color: var(--md-sys-color-on-error-container) !important;
    }

    :host(.invalid:hover) #label::slotted(*) {
     color: var(--md-sys-color-on-error-container);
    }

   </style>

   <div id="container" class="extra-small-top" oninput="${this.entradaDeDatos}">
    <div id="stateLayer"></div>
     <div id="cabecera">
      <slot id="label"></slot>
     </div>
     <div id="relleno">
       <slot name="input-text" onslotchange="${this.configuraTarget}"></slot>
     </div>
    <div id="activeIndicator"></div>
   </div>
   <slot name="supporting"></slot>`.htmlTxt
 }

 constructor() {
  super()
  const shadow = this.attachShadow({ mode: "open", delegatesFocus: true })
  shadow.innerHTML = this.getContent()
  this.muestraValue = this.muestraValue.bind(this)
  /**
   * @private
   * @type { HTMLSlotElement }
   */
  this._inputText = querySelector(shadow, '[name="input-text"]')
  /**
   * @private
   * @type { Element | null }
   */
  this._inputTextElement = null
  addEventListener("load", this.muestraValue)
 }

 configuraTarget() {
  const assignedElements = this._inputText.assignedElements()
  if (assignedElements.length > 0) {
   this._inputTextElement = assignedElements[0]
  }
 }

 /**
  * @param {string} nombreDelAtributo
  * @param {string} _valrAnterior
  * @param {string} _nuevoValor
  */
 attributeChangedCallback(nombreDelAtributo,
  _valrAnterior, _nuevoValor) {
  if (nombreDelAtributo === "value") {
   this.muestraValue()
  }
 }

 entradaDeDatos() {
  this.value = this.getValue()
  this.analiza()
 }

 /**
  * @returns {string}
  */
 get value() {
  return getAttribute(this, "value")
 }

 set value(value) {
  this.setAttribute("value", value)
 }

 muestraValue() {
  const value = this.value
  const inputTextValue = this.getValue()
  if (inputTextValue !== value) {
   this.setValue(value)
  }
  this.analiza()
 }

 getValue() {
  const inputTextElement = this._inputTextElement
  if (inputTextElement !== null) {
   const getValue = inputTextElement["getValue"]
   if (typeof getValue === "function") {
    const value = getValue.call(inputTextElement)
    if (typeof value === "string") {
     return value
    }
   }
   if ("value" in inputTextElement) {
    const value = inputTextElement.value
    if (typeof value === "string") {
     return value
    }
   }
  }
  return ""
 }

 /**
  * @param {string} value
  */
 setValue(value) {
  const inputTextElement = this._inputTextElement
  if (inputTextElement !== null) {
   const setValue = inputTextElement["setValue"]
   if (typeof setValue === "function") {
    setValue.call(inputTextElement, value)
   } else if ("value" in inputTextElement) {
    inputTextElement.value = value
   }
  }
 }

 analiza() {
  const value = this.value
  if (value === "") {
   this.classList.remove("populated")
  } else {
   this.classList.add("populated")
  }
  if (this.checkValidity()) {
   this.classList.remove("invalid")
  } else {
   this.classList.add("invalid")
  }
 }

 checkValidity() {
  const inputTextElement = this._inputTextElement
  if (inputTextElement !== null) {
   const checkValidity = inputTextElement["checkValidity"]
   if (typeof checkValidity === "function") {
    return checkValidity.call(inputTextElement) === true
   }
  }
  return true
 }

}

customElements.define("md-filled-text-field", MdFilledTextField)