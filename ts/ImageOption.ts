import { UIElement, ElementType } from "./UIElement"

export class ImageOption {

	readonly label: string
	readonly url: string
	readonly image = new UIElement(ElementType.IMAGE)

	constructor(label: string, url: string) {

		this.label = label
		this.url = url
	}
}
