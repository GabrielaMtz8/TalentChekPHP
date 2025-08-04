/**
 * @param { HTMLElement } elementoHtml
 */
export function cierraElementoHtmo(elementoHtml) {
 const list = elementoHtml.classList
 if (list.contains("open")) {
  list.remove("open")
  setTimeout(() => elementoHtml.hidden = true, 500)
 }
}
