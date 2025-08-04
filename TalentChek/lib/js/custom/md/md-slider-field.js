import { html } from "../html.js"

export class MdSliderField extends HTMLElement {

 getContent() {
  return html`
   <style>
    :host {
     display: block;
     margin: 16px;
    }

    :host([hidden]) {
     display: none;
    }

    #label::slotted(*) {
     display: block;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
     color: var(--md-sys-color-on-surface-variant);
     font-family: var(--md-sys-typescale-body-small-font);
     font-weight: var(--md-sys-typescale-body-small-weight);
     font-size: var(--md-sys-typescale-body-small-size);
     font-style: var(--md-sys-typescale-body-small-font-style);
     letter-spacing: var(--md-sys-typescale-body-small-tracking);
     line-height: var(--md-sys-typescale-body-small-line-height);
     text-transform: var(--md-sys-typescale-body-small-text-transform);
     text-decoration: var(--md-sys-typescale-body-small-text-decoration);
    }

    [name="slider"]::slotted(input) {
     -webkit-appearance: none;
     appearance: none;
     height: 4px;
     border-radius: 2px;
     background-image:
      linear-gradient(to right, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary) 50%, var(--md-sys-color-surface-container-highest) 50%, var(--md-sys-color-surface-container-highest) 100%);
    }

    [name="slider"]::slotted(input:focus) {
     outline: none;
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
     padding-top: 8px;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
    }
   </style>
   <slot id="label"></slot>
   <slot name="slider" onslotchange="${this.configuraSlider}"></slot>
   <slot name="supporting"></slot>`.htmlTxt
 }

 constructor() {
  super()
  const shadow = this.attachShadow({ mode: "open", delegatesFocus: true })
  shadow.innerHTML = this.getContent()
  this.analiza = this.analiza.bind(this)

  /**
  * @private
  * @type {HTMLSlotElement|null}
  */
  this._slotSlider = shadow.querySelector('[name="slider"]')
  /**
   * @private
   * @type {HTMLInputElement|null}
   */
  this._input = null
 }

 /** @private */
 configuraSlider() {
  if (this._input !== null) {
   this._input.removeEventListener("input", this.analiza)
   this._input = null
  }
  if (this._slotSlider !== null) {
   for (const input of this._slotSlider.assignedElements()) {
    if (input instanceof HTMLInputElement) {
     this._input = input
     input.addEventListener("input", this.analiza)
     this.analiza()
    }
   }
  }
 }

 analiza() {
  const i = this._input
  if (i !== null) {
   const v = i.valueAsNumber
   const min = parseFloat(i.min)
   const max = parseFloat(i.max)
   const value = (v - min) / (max - min) * 100
   i.title = v.toString()
   i.style.background =
    `linear-gradient(to right, var(--md-sys-color-primary) 0%, var(--md-sys-color-primary) ${value
    }%, var(--md-sys-color-surface-container-highest) ${value
    }%, var(--md-sys-color-surface-container-highest) 100%)`
  }
 }

}

customElements.define("md-slider-field", MdSliderField)