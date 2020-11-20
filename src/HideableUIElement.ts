import { ElementType, UIElement } from "./UIElement"

export class HideableUIElement extends UIElement {

	private opacity = 1

	constructor(specifier: ElementType | HTMLElement) {
		super(specifier)
		this.setTransition(0.5)
		this.element.addEventListener("transitionend", () => {
			let opacityString = this.element.style.getPropertyValue("opacity")
			if (opacityString != "") {
				let opacity = parseFloat(opacityString)
				if (opacity <= 0) {
					this.setStyle({ visibility: "hidden" })
				}
			}
		})
	}

	hide() {
		this.opacity = 0
		this.setStyle({ opacity: this.opacity })
	}

	setTransition(seconds: number) {
		this.setStyle({ transition: `opacity ${seconds}s linear` })
	}

	show() {
		this.opacity = 1
		this.setStyle({ opacity: this.opacity, visibility: "visible" })
	}
}
