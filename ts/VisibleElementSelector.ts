import { UIElement } from "./UIElement"

export class VisibleElementSelector {

	elements: UIElement[] = []

	addElement(newElement: UIElement) {
		for (let index in this.elements) {
			let element = this.elements[index]
			element.hide()
		}
		this.elements.push(newElement)
	}

	showElement(element: UIElement) {
		for (let index in this.elements) {
			let otherElement = this.elements[index]
			otherElement.hide()
		}
		element.show()
	}
}
