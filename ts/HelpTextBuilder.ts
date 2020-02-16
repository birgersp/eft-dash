import { UIElement, ElementType } from "./UIElement"

export class HelpTextBuilder {

	private readonly container: UIElement

	constructor(container: UIElement) {
		this.container = container
	}

	addH4(text: string): HelpTextBuilder {

		let h4 = new UIElement(ElementType.H4, this.container)
		h4.setAttributes({ innerHTML: text })
		return this
	}

	addParagraph(text: string) {

		let paragraph = new UIElement(ElementType.PARAGRAPH, this.container)
		paragraph.setAttributes({ innerHTML: text })
		return this
	}
}
