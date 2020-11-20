export enum ElementType {
	DIV = "div",
	BUTTON = "button",
	IMAGE = "img",
	INPUT = "input",
	H4 = "h4",
	LINK = "a",
	LINE_BREAK = "br",
	PARAGRAPH = "p",
	SPAN = "span"
}

export class UIElement {

	static createHTMLBodyChild(type: ElementType): UIElement {
		let child = new UIElement(type)
		document.body.appendChild(child.element)
		return child
	}

	static setStyle(element: HTMLElement, properties: any) {
		for (let key in properties) {
			let value = properties[key]
			element.style.setProperty(key, value)
		}
	}

	readonly element: HTMLElement

	constructor(specifier: ElementType | HTMLElement) {
		if (typeof specifier == "string")
			this.element = document.createElement(specifier)
		else
			this.element = specifier
	}

	addChild(element: UIElement) {
		this.element.appendChild(element.element)
	}

	createChild(type: ElementType): UIElement {
		let child = new UIElement(type)
		this.addChild(child)
		return child
	}

	removeChildren() {
		while (this.element.firstChild != null)
			this.element.removeChild(this.element.firstChild)
	}

	setAttributes(attributes: any) {
		for (let key in attributes) {
			let value = attributes[key]
			if (key == "innerHTML") {
				this.element.innerHTML = value
			} else {
				this.element.setAttribute(key, value)
			}
		}
	}

	setInnerHTML(string: string) {
		this.setAttributes({ innerHTML: string })
	}

	setStyle(styleProperties: Object) {
		UIElement.setStyle(this.element, styleProperties)
	}
}