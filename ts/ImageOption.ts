import { UIElement, ElementType } from "./UIElement"
import { HideableUIElement } from "./HideableUIElement"

export class ImageOption {

	readonly label: string
	readonly url: string
	readonly image = new HideableUIElement(ElementType.IMAGE)
	readonly credit: string

	constructor(label: string, url: string, credit: string) {

		this.label = label
		this.url = url
		this.credit = credit
	}
}
