/**
 * @param { HTMLElement } elementoHtml
 */
export function abreElementoHtml(elementoHtml) {
 const list = elementoHtml.classList
 if (!list.contains("open")) {
  elementoHtml.hidden = false
  setTimeout(() => list.add("open"), 100)
 }
}