import "./UIElement"

export class VisibleElementSelector {

	elements: UIElement[] = []

	constructor() {
	}

	addElement(newElement: UIElement) {
		for (let index in this.elements) {
			let element = this.elements[index]
			if (element.isVisible()) {
				newElement.hide()
				break
			}
		}
		this.elements.push(newElement)
	}

	showElement(element: UIElement) {
		for (let index in this.elements) {
			this.elements[index].hide()
		}
		element.show()
	}
}
