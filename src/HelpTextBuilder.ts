import { ElementType, UIElement } from "./UIElement"

export class HelpTextBuilder {

	private readonly container: UIElement

	constructor(container: UIElement) {
		this.container = container
	}

	addH4(text: string): HelpTextBuilder {

		let h4 = this.container.createChild(ElementType.H4)
		h4.setAttributes({ innerHTML: text })
		return this
	}

	addParagraph(text: string) {

		let paragraph = this.container.createChild(ElementType.PARAGRAPH)
		paragraph.setAttributes({ innerHTML: text })
		return this
	}
}
