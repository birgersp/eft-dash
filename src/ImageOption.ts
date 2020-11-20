import { HideableUIElement } from "./HideableUIElement"
import { ElementType } from "./UIElement"

export class ImageOption {

	readonly credit: string
	readonly image = new HideableUIElement(ElementType.IMAGE)
	readonly label: string
	readonly url: string

	constructor(label: string, url: string, credit: string) {

		this.label = label
		this.url = url
		this.credit = credit
	}
}
