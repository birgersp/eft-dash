import { Container } from "./Container"
import { setAttributes, setStyle } from "./util"

export class Menu extends Container {

	hasMouseOver = false

	constructor() {

		super()
		this.div.addEventListener("mouseover", () => { this.hasMouseOver = true })
		this.div.addEventListener("mouseout", () => { this.hasMouseOver = false })

		setStyle(this.div, {
			"position": "absolute",
			"top": "0"
		})
	}

	addButton(label: string, action: () => void) {

		let button = document.createElement("input")
		setAttributes(button, {
			"type": "button",
			"value": label
		})
		button.addEventListener("click", () => {
			action()
		})
		this.div.appendChild(button)
	}
}
