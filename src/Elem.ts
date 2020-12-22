import { removeChildrenOf } from "./util"

export class Elem<K extends keyof HTMLElementTagNameMap> {

	element: HTMLElementTagNameMap[K]

	constructor(tagName: K) {

		this.element = document.createElement(tagName)
	}

	append(child: Elem<any>): Elem<K> {

		this.element.appendChild(child.element)
		return this
	}

	appendTo(parent: Elem<any>): Elem<K> {

		parent.element.appendChild(this.element)
		return this
	}

	on<T extends keyof HTMLElementEventMap>(type: T, listener: (this: HTMLElement, ev: HTMLElementEventMap[T]) => any, options?: boolean | AddEventListenerOptions) {

		this.element.addEventListener(type, listener as EventListenerOrEventListenerObject)
		return this
	}

	removeChildren() {

		removeChildrenOf(this.element)
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
