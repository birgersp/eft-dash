enum ElementType {
	DIV = "div"
}

class UIElement {

	static setStyle(element: HTMLElement, properties: Object) {
		for (let key in properties) {
			let value = properties[key]
			element.style.setProperty(key, value)
		}
	}

	readonly element: HTMLElement

	constructor(tag: ElementType, parent?: UIElement, parentElement?: HTMLElement) {
		this.element = document.createElement(tag)
		if (parent)
			parent.element.appendChild(this.element)
		else if (parentElement)
			parent.element.appendChild(parentElement)
		else
		throw new Error("")
	}

	setStyle(styleProperties: Object) {
		UIElement.setStyle(this.element, styleProperties);
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
}
