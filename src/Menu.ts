import { Container } from "./Container"
import { Elem } from "./Elem"
import { common } from "./common"

export class Menu extends Container {

	hasMouseOver = false

	constructor() {

		super()

		this.div
			.on("mouseover", () => { this.hasMouseOver = true })
			.on("mouseout", () => { this.hasMouseOver = false })
		this.div.style({
			"background": common.BG_COLOR,
			"overflow-y": "auto",
			"padding": "1em",
			"position": "absolute",
			"top": "0",
			"width": common.MENU_WIDTH
		})
	}

	add(elem: Elem<any>) {
		this.div.append(elem)
	}

	addButton(label: string, action: () => void) {

		new Elem("input")
			.set({
				"type": "button",
				"value": label,
			})
			.style({
				"width": "100%"
			})
			.on("click", action)
			.appendTo(this.div)

		new Elem("br")
			.appendTo(this.div)

	}

	getWidth(): number {
		return this.div.element.getBoundingClientRect().width
	}
}
