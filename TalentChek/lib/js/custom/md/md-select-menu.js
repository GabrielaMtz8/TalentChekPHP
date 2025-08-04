import { getAttribute } from "../getAttribute.js"
import { querySelector } from "../querySelector.js"
import { setBooleanAttribute } from "../setBooleanAttribute.js"
import { MdFilledTextField } from "./md-filled-text-field.js"
import { MdOptionsMenu } from "./md-options-menu.js"

export class MdSelectMenu extends HTMLElement {

 static get observedAttributes() {
  return ["options", "value"]
 }

 getContent() {
  return /* HTML */ `
   <link rel="stylesheet" href="/lib/css/material-symbols-outlined.css">

   <style>
    :host {
     display: block;
     cursor: default;
    }

    output {
     display: block;
     white-space: nowrap;
     text-overflow: ellipsis;
     overflow: hidden;
    }

    #up {
     position: absolute;
     bottom: 8px;
     right: 12px;
     display: none;
     color: var(--md-sys-color-on-surface-variant);
    }

    #down {
     position: absolute;
     bottom: 8px;
     right: 12px;
     color: var(--md-sys-color-on-surface-variant);
    }

    :host(.open) #up {
     display: inline-block;
    }

    :host(.open) #down {
     display: none;
    }

    :host(.invalid) #up,
    :host(.invalid) #down {
     color: var(--md-sys-color-error);
    }

   </style>
   <output></output>
   <span id="down" class="material-symbols-outlined">
    arrow_drop_down
   </span>
   <span id="up" class="material-symbols-outlined">
    arrow_drop_up
   </span>`
 }

 constructor() {
  super()
  const shadow = this.attachShadow({ mode: "open" })
  shadow.innerHTML =
   this.getContent()

  this._alterna = this._alterna.bind(this)
  this._onKeyDown = this._onKeyDown.bind(this)
  this._cierra = this._cierra.bind(this)
  this.opcionSeleccionada = this.opcionSeleccionada.bind(this)
  this.clicExterno = this.clicExterno.bind(this)

  /**
   * @readonly
   * @type { { valid:boolean } }
   */
  this.validity = { valid: true }
  /**
   * @private
   * @type {string}
   */
  this._customValidity = ""

  /**
   * @private
   * @type { HTMLOutputElement }
   */
  this.output = querySelector(shadow, "output")
  /**
   * @private
   */
  this._options = ""
  /**
   * @private
   * @type { MdOptionsMenu | null }
   */
  this._optionsMenu = null
  /**
   * @private
   * @type { MdFilledTextField | null }
   */
  this._textField = null
 }

 connectedCallback() {
  this.tabIndex = 0
  this.role = "combobox"
  this.ariaHasPopup = "listbox"
  this.ariaExpanded = "false"
  this["aria-controls"] = this.options
  this.addEventListener("keydown", this._onKeyDown)
  /**
   * @type { MdFilledTextField | null }
   */
  const textField = this.closest("md-filled-text-field")
  if (textField !== null) {
   this._textField = textField
   textField.classList.add("select")
   textField.addEventListener("click", this._alterna)
  }
 }

 /**
  * @param {string} nombreDeAtributo
  * @param {string} _valorAnterior
  * @param {string} nuevoValor
  */
 attributeChangedCallback(nombreDeAtributo, _valorAnterior, nuevoValor) {
  if (nombreDeAtributo === "options") {
   this.muestraOptions(nuevoValor)
  } else if (nombreDeAtributo === "value") {
   this.muestraValue()
  }
 }

 get options() {
  return getAttribute(this, "options")
 }

 set options(options) {
  this.setAttribute("options", options)
 }

 /**
  * @param {string} options
  */
 muestraOptions(options) {
  if (this._options !== options && this._optionsMenu !== null) {
   this._optionsMenu = null
  }
  this._options = options
  this["aria-controls"] = this.options
 }

 get required() {
  return this.hasAttribute("required")
 }

 set required(required) {
  setBooleanAttribute(this, "required", required)
 }

 get value() {
  return getAttribute(this, "value")
 }

 set value(value) {
  this.setAttribute("value", value)
 }

 muestraValue() {
  const value = this.value
  this.output.value = this.optionsMenu.muestraValue(value)
 }

 /** @private */
 _alterna() {
  if (this.classList.contains("open")) {
   this._cierra()
  } else {
   this._abre()
  }
 }

 /** @private */
 _abre() {
  this.classList.add("open")
  const textField = this._textField
  if (textField !== null) {
   const optionsMenu = this.optionsMenu
   optionsMenu.style.top = `${textField.offsetTop + 56}px`
   optionsMenu.style.left = `${textField.offsetLeft}px`
   optionsMenu.style.width = `${textField.offsetWidth}px`
   optionsMenu.abre()
   optionsMenu.addEventListener("input", this.opcionSeleccionada)
   this.ariaExpanded = "true"
   document.addEventListener("click", this.clicExterno)
  }
 }

 /** @private */
 _cierra() {
  this.classList.remove("open")
  const optionsMenu = this.optionsMenu
  optionsMenu.cierra()
  this.checkValidity()
  optionsMenu.removeEventListener("input", this.opcionSeleccionada)
  this.ariaExpanded = "false"
  document.removeEventListener("click", this.clicExterno)
  this.dispatchEvent(new Event("input", { bubbles: true }))
 }

 get optionsMenu() {
  if (this._optionsMenu === null) {
   if (this._options === "")
    throw new Error("Atributo options no asignado.")
   const menu = document.getElementById(this._options)
   if (menu instanceof MdOptionsMenu) {
    this._optionsMenu = menu
    this.muestraValue()
   } else {
    throw new Error(`Valor incorrecto para options: "${this._options}".`)
   }
  }
  return this._optionsMenu
 }

 /** @private */
 _avanzaOpcion() {
  const i = this._valueIndex
  const opciones = this.optionsMenu.opciones
  if (i < opciones.length - 1) {
   this.value = opciones[i + 1].input.value
  }
 }

 /** @private */
 _retrocedeOpcion() {
  const i = this._valueIndex
  const opciones = this.optionsMenu.opciones
  if (i > 0) {
   this.value = opciones[i - 1].input.value
  }
 }

 /**
  * @private
  * @returns {number}
  */
 get _valueIndex() {
  const value = this.value
  return this.optionsMenu.opciones.findIndex(
   opcion => opcion.input.value === value)
 }

 opcionSeleccionada() {
  this.value = this.optionsMenu.seleccion
  this._cierra()
  this.focus()
 }

 /**
  * @param {Event} evt
  */
 clicExterno(evt) {
  const target = evt.target
  if (this.classList.contains("open")
   && target instanceof HTMLElement
   && this._textField !== null
   && !this._textField.contains(target)
   && this._optionsMenu !== null
   && !this._optionsMenu.contains(target)) {
   this._cierra()
  }
 }

 /**
  * @param { KeyboardEvent } event
  */
 _onKeyDown(event) {
  const key = event.key
  if (this.optionsMenu.classList.contains("open")) {
   if (key === "ArrowDown") {
    event.preventDefault()
    this._avanzaOpcion()
   } else if (key === "ArrowUp") {
    event.preventDefault()
    this._retrocedeOpcion()
   } else if (key === "Escape") {
    event.preventDefault()
    this._cierra()
   } else if (key === " ") {
    event.preventDefault()
    this._cierra()
   } else if (key === "Tab") {
    this._cierra()
   } else {
    event.preventDefault()
   }
  } else if (key === " ") {
   event.preventDefault()
   this._abre()
  } else if (key === "Tab") {
   this._cierra()
  } else {
   event.preventDefault()
  }
 }

 /** @param {string} error */
 setCustomValidity(error) {
  this._customValidity = error
  this.checkValidity()
 }

 /** @returns {boolean} */
 checkValidity() {
  if (this._customValidity !== "" || (this.required && this.value === "")) {
   this.validity.valid = false
   this.validationMessage = "Seleccione una opción."
   this.classList.add("invalid")
   return false
  } else {
   this.classList.remove("invalid")
   this.validity.valid = true
   return true
  }
 }

}

customElements.define("md-select-menu", MdSelectMenu)