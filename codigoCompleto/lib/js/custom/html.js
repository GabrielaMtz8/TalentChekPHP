import "./ejecutaMetodo.js"
import { htmlentities } from "./htmlentities.js"

/**
 * Función tag que analiza una plantilla de texto y devuelve in objeto con un
 * texto sanitizado en la propiedad <q>htmlTxt</q>.
 * @param { TemplateStringsArray } strings
 * @param { any[] } values
 * @returns { { htmlTxt: string } }
 */
export function html(strings, ...values) {
 let htmlTxt = ""
 let i = 0, sLen = strings.length, vLen = values.length
 for (; i < sLen && i < vLen; i++) {
  htmlTxt += strings[i]
  const value = values[i]
  htmlTxt += sanitizaValor(value)
 }
 for (; i < sLen; i++) {
  htmlTxt += strings[i]
 }
 for (; i < vLen; i++) {
  const value = values[i]
  htmlTxt += sanitizaValor(value)
 }
 return { htmlTxt }
}

/**
 * @param { any } value
 * @returns { string }
 */
function sanitizaValor(value) {
 switch (typeof value) {
  case "string":
   return htmlentities(value)
  case "function": {
   const names = value.name.split(/\s+/g)
   const name = htmlentities(names[names.length - 1])
   return `ejecutaMetodo(this,&quot;${name}&quot;,event)`
  }
  case "boolean":
  case "number":
   return value.toString()
  case "undefined":
   return ""
  default:
   if ("htmlTxt" in value) {
    return value["htmlTxt"]
   } else if (Array.isArray(value)) {
    return value.map(sanitizaValor).join("")
   } else if (typeof value.toString === "function") {
    return value.toString()
   } else {
    return ""
   }
 }
}
