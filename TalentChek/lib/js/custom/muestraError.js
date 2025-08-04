/**
 * Muestra un error en la consola y en un cuadro de
 * alerta el mensaje de una excepción.
 * @param { Error | null } error descripción del error.
 */
export function muestraError(error) {
 if (error === null) {
  console.log("Error")
  alert("Error")
 } else {
  console.error(error)
  alert(error.message)
 }
}

// Permite que los eventos de html usen la función.
window["muestraError"] = muestraError