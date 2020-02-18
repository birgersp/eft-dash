import { UIElement, ElementType } from "./UIElement"
import { HideableUIElement } from "./HideableUIElement"

export class ImageOption {

	readonly label: string
	readonly url: string
	readonly image = new HideableUIElement(ElementType.IMAGE)

	constructor(label: string, url: string) {

		this.label = label
		this.url = url
	}
}
