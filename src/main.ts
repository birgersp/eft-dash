import { clearDocument, setAttributes, setStyle } from "./util"

let TIMESTAMP = ""
// @echo TIMESTAMP
console.log(`Built: ${TIMESTAMP}`)

let globals = {
	RESIZE_TIMER_MS: 100
}

export function main() {

	clearDocument()

	setStyle(document.body, {
		"margin": "0px",
		"overflow": "hidden"
	})

	let canvas = document.createElement("canvas")
	setAttributes(canvas, {

	})
	setStyle(canvas, {

	})
	document.body.appendChild(canvas)

	function onResize() {
		canvas.width = document.body.clientWidth
		canvas.height = document.body.clientHeight
	}

	onResize()

	let timeout = 0
	window.addEventListener("resize", () => {
		window.clearTimeout(timeout)
		timeout = window.setTimeout(onResize, globals.RESIZE_TIMER_MS)
	})
}
window.addEventListener("load", () => { main() })
