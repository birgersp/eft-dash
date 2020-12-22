import { Container } from "./Container"
import { Elem } from "./Elem"
import { setAttributes, setStyle } from "./util"

export class Menu extends Container {

	hasMouseOver = false

	constructor() {

		super()

		this.div
			.on("mouseover", () => { this.hasMouseOver = true })
			.on("mouseout", () => { this.hasMouseOver = false })
		this.div.style({
			"position": "absolute",
			"top": "0"
		})
	}

	addButton(label: string, action: () => void) {

		new Elem("input")
			.set({
				"type": "button",
				"value": label
			})
			.on("click", action)
			.appendTo(this.div)
	}
}
