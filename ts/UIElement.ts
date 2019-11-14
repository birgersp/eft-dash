enum ElementType {
	DIV = "div",
	BUTTON = "button",
	IMAGE = "img",
	INPUT = "input",
	H4 = "h4"
}

class UIElement {

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
		let current_display_type = this.element.style.getPropertyValue("display")
		if (current_display_type != "none") {
			this.display_type = current_display_type
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
}
