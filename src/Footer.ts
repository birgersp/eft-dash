import { removeChildrenOf, setAttributes, setStyle } from "./util"

export class Footer {

	container: HTMLDivElement

	constructor() {

		this.container = document.createElement("div")
	}

	initialize() {

		setStyle(this.container, {
			"background": "black",
			"bottom": "0",
			"position": "absolute"
		})
		document.body.appendChild(this.container)
	}

	setText(text: string, link: string) {

		removeChildrenOf(this.container)
		let aElement = document.createElement("a")
		setAttributes(aElement, {
			"href": link,
			"innerHTML": text
		})
		setStyle(aElement, {
			"color": "white"
		})
		let pElement = document.createElement("p")
		setStyle(pElement, {
			"margin": "0.5em"
		})
		pElement.appendChild(aElement)
		this.container.appendChild(pElement)
	}
}
