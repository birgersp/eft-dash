export enum ElementType {
	DIV = "div",
	BUTTON = "button",
	IMAGE = "img",
	INPUT = "input",
	H4 = "h4",
	LINK = "a",
	LINE_BREAK = "br",
	PARAGRAPH = "p"
}

export class UIElement {

	static createHTMLBodyChild(type: ElementType): UIElement {
		let child = new UIElement(type)
		document.body.appendChild(child.element)
		return child
	}

	static setStyle(element: HTMLElement, properties: Object) {
		for (let key in properties) {
			let value = properties[key]
			element.style.setProperty(key, value)
		}
	}

	readonly element: HTMLElement
	private opacity = 1

	constructor(specifier: ElementType | HTMLElement) {
		if (typeof specifier == "string")
			this.element = document.createElement(specifier)
		else
			this.element = specifier
		this.setTransition(0.2)
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

	setStyle(styleProperties: Object) {
		UIElement.setStyle(this.element, styleProperties)
	}

	setAttributes(attributes: Object) {
		for (let key in attributes) {
			let value = attributes[key]
			if (key == "innerHTML") {
				this.element.innerHTML = value
			} else {
				this.element.setAttribute(key, value)
			}
		}
	}

	hide() {
		this.opacity = 0
		this.setStyle({ opacity: this.opacity })
	}

	show() {
		this.opacity = 1
		this.setStyle({ display: "block", opacity: this.opacity })
	}

	removeChildren() {
		while (this.element.firstChild)
			this.element.removeChild(this.element.firstChild)
	}

	setTransition(seconds: number) {
		this.setStyle({ transition: `opacity ${seconds}s linear` })
	}

	addChild(element: UIElement) {
		this.element.appendChild(element.element)
	}

	createChild(type: ElementType): UIElement {
		let child = new UIElement(type)
		this.addChild(child)
		return child
	}
}
