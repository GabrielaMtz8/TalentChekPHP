/**
 * @template { HTMLElement } T
 * @param { Document | Element | ShadowRoot } raiz
 * @param { string } query
 * @returns { T[] }
 */
export function querySelectorAll(raiz, query) {
 return Array.from(raiz.querySelectorAll(query))
}