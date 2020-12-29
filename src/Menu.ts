import { Container } from "./Container"
import { Elem } from "./Elem"
import { common } from "./common"

export class Menu extends Container {

	hasMouseOver = false
	innerDiv = new Elem("div")

	constructor() {

		super()

		this.div
			.on("mouseover", () => { this.hasMouseOver = true })
			.on("mouseout", () => { this.hasMouseOver = false })
		this.innerDiv.style({
			"background": common.BG_COLOR,
			"padding": "1em",
			"width": common.MENU_WIDTH
		})
		this.div.append(this.innerDiv)
		this.div.style({
			"height": "100%",
			"overflow-y": "auto",
			"position": "absolute",
			"top": "0px"
		})
	}

	add(elem: Elem<any>) {
		this.innerDiv.append(elem)
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
			.appendTo(this.innerDiv)

		new Elem("br")
			.appendTo(this.innerDiv)

	}

	getWidth(): number {
		return this.div.element.getBoundingClientRect().width
	}
}
