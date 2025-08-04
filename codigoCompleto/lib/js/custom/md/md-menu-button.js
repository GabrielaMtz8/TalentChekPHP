export class MdMenuButton extends HTMLButtonElement {

 connectedCallback() {
  this.type = "button"
  this.classList.add("md-standard-icon-button")
  this.innerHTML = /* html */
   `<span class="material-symbols-outlined">menu</span>`
 }

}

customElements.define("md-menu-button", MdMenuButton, { extends: "button" })