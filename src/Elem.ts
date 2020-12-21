export class Elem<K extends keyof HTMLElementTagNameMap> {

	element: HTMLElementTagNameMap[K]

	constructor(tagName: K) {

		this.element = document.createElement(tagName)
	}

	appendTo(element: HTMLElement): Elem<K> {

		element.appendChild(this.element)
		return this
	}

	set(attributes: any): Elem<K> {

		for (let key in attributes) {
			let value = attributes[key]
			if (key == "innerHTML") {
				this.element.innerHTML = value
				continue
			}
			this.element.setAttribute(key, value)
		}

		return this
	}

	style(properties: any): Elem<K> {

		for (let key in properties) {
			let value = properties[key]
			this.element.style.setProperty(key, value)
		}

		return this
	}
}
