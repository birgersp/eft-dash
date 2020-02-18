import { UIElement, ElementType } from "./UIElement"

export class HideableUIElement extends UIElement {

	private opacity = 1
	private displayType = ""

	constructor(specifier: ElementType | HTMLElement) {
		super(specifier)
		this.setTransition(0.5)
		this.element.addEventListener("transitionend", () => {
			let opacityString = this.element.style.getPropertyValue("opacity")
			if (opacityString != "") {
				let opacity = parseFloat(opacityString)
				if (opacity <= 0) {
					this.setStyle({ display: "none" })
				}
			}
		})
	}

	hide() {
		this.opacity = 0
		this.setStyle({ opacity: this.opacity })
		if (this.displayType == "") {
			this.displayType = getComputedStyle(this.element, null).display
		}
	}

	show() {
		this.opacity = 1
		if (this.displayType != "") {
			this.setStyle({ display: this.displayType, opacity: this.opacity })
		}
	}

	setTransition(seconds: number) {
		this.setStyle({ transition: `opacity ${seconds}s linear` })
	}
}
