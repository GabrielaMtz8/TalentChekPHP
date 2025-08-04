/**
 * Espera a que la promesa de un fetch termine. Si
 * hay error, lanza una excepción. Si no hay error,
 * interpreta la respuesta del servidor como JSON y
 * la convierte en una literal de objeto. 
 * @param { string | Promise<Response> } servicio
 */
export async function ejecuta(servicio) {
 let f = servicio
 if (typeof servicio === "string") {
  f = fetch(servicio)
 } else if (!(f instanceof Promise)) {
  throw new Error("Servicio de tipo incorrecto.")
 }
 const respuesta = await f
 if (respuesta.ok) {
  const texto = await respuesta.text()
  try {
   return JSON.parse(texto)
  } catch (error) {
   throw new Error(texto)
    
  }
 } else if (respuesta.status === 500) {
  throw new Error(await respuesta.text())
 } else {
  throw new Error(respuesta.statusText)
 }
}

// Permite que los eventos de html usen la función.
window["ejecuta"] = ejecuta