import { setAttributes } from "./util"

let TIMESTAMP = ""
// @echo TIMESTAMP
console.log(`Built: ${TIMESTAMP}`)

let createElement = document.createElement

export function main() {
	let input = createElement("input")
	setAttributes(input, {
		"type": "button"
	})
	document.body.appendChild(input)
}
window.addEventListener("load", () => { main() })
