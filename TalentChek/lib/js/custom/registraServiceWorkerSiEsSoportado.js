import { muestraError } from "./muestraError.js"

/**
 * @param { string | URL } urlDeServiceWorker
 */
export async function registraServiceWorkerSiEsSoportado(urlDeServiceWorker) {
 try {
  if ("serviceWorker" in navigator) {
   const registro = await navigator.serviceWorker.register(urlDeServiceWorker)
   console.log(urlDeServiceWorker, "registrado.")
   console.log(registro)
  }
 } catch (error) {
  muestraError(error)
 }
}