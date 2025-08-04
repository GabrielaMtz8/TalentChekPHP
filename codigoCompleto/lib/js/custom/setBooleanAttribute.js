/**
 * @param {HTMLElement} elementoHtml
 * @param {string} nombre
 * @param {boolean} valor
 */
export function setBooleanAttribute(elementoHtml, nombre, valor) {
 if (valor) {
  elementoHtml.setAttribute(nombre, nombre)
 } else {
  elementoHtml.removeAttribute(nombre)
 }
}