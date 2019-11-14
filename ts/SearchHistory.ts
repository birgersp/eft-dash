import { UIElement, ElementType } from "./UIElement"

export class SearchHistory extends UIElement {

	constructor(parent?: UIElement) {
		super(ElementType.DIV, parent)
	}

	add(label: string, url: string) {
		let link = new UIElement(ElementType.LINK, this)
		link.setAttributes({
			"href": url,
			"innerHTML": label
		})
		link.setStyle({
			"color": "white"
		})
		new UIElement(ElementType.LINE_BREAK, this)
	}
}
