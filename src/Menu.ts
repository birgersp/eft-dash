import { setAttributes, setStyle } from "./util"

export class Menu {

	container: HTMLDivElement
	hasMouseOver = false

	constructor() {

		this.container = document.createElement("div")
		this.container.addEventListener("mouseover", () => { this.hasMouseOver = true })
		this.container.addEventListener("mouseout", () => { this.hasMouseOver = false })
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
		this.container.appendChild(button)
	}

	hide() {

		setStyle(this.container, {
			"visibility": "hidden"
		})
	}

	initialize() {

		setStyle(this.container, {
			"position": "absolute",
			"top": "0"
		})
		document.body.appendChild(this.container)
	}

	show() {

		setStyle(this.container, {
			"visibility": "visible"
		})
	}
}
