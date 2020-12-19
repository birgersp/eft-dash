import { setAttributes, setStyle } from "./util"

export class Menu {

	container: HTMLDivElement

	constructor() {

		this.container = document.createElement("div")
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

	initialize() {

		setStyle(this.container, {
			"position": "absolute",
			"top": "0"
		})
		document.body.appendChild(this.container)
	}
}
