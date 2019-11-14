export enum ElementType {
	DIV = "div",
	BUTTON = "button",
	IMAGE = "img",
	INPUT = "input",
	H4 = "h4",
	LINK = "a",
	LINE_BREAK = "br"
}

export class UIElement {

	static setStyle(element: HTMLElement, properties: Object) {
		for (let key in properties) {
			let value = properties[key]
			element.style.setProperty(key, value)
		}
	}

	readonly element: HTMLElement
	private display_type = "block"

	constructor(tag: ElementType, parent?: UIElement) {
		this.element = document.createElement(tag)
		if (parent)
			parent.element.appendChild(this.element)
		else
			document.body.appendChild(this.element)
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
		if (this.isVisible()) {
			this.display_type = this.element.style.getPropertyValue("display")
		}
		this.setStyle({
			"display": "none"
		})
	}

	show() {
		this.setStyle({
			"display": this.display_type
		})
	}

	isVisible() {
		let display = this.element.style.getPropertyValue("display")
		if (display == "none") {
			return false
		} else {
			return true
		}
	}
}
