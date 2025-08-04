import { ES_APPLE } from "../../const/ES_APPLE.js"

export class MdSwitch extends HTMLInputElement {
 connectedCallback() {
  if (ES_APPLE) {
   this.classList.add("apple")
  } else {
   this.classList.add("material")
  }
  this.type = "range"
  this.min = "0"
  this.max = "1"
  this.addEventListener("input", () => this.analiza())
  this.analiza()
 }

 analiza() {
  if (this.valueAsNumber === 0) {
   this.classList.add("unselected")
  } else {
   this.classList.remove("unselected")
  }
 }
}

customElements.define("md-switch", MdSwitch, {extends: "input"})
