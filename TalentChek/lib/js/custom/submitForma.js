import { ejecuta } from "./ejecuta.js"


/**
 * Envía los datos de la forma a la url usando la codificación
 * multipart/form-data.
 * @param {string} url
 * @param {Event} event
 * @param {HTMLFormElement} forma
 * @param { "GET" | "POST"| "PUT" | "PATCH" | "DELETE" | "TRACE" | "OPTIONS"
 *  | "CONNECT" | "HEAD" } metodoHttp
 */
export function submitForma(url, event, forma, metodoHttp = "POST") {
 event.preventDefault()
 return ejecuta(fetch(url, {
  method: metodoHttp,
  body: new FormData(forma)
 }))
}

// Permite que los eventos de html usen la función.
window["submitForma"] = submitForma
