import { removeChildrenOf, setAttributes, setStyle } from "./util"

export type Search = {

}

export class SearchHistory {

	container: HTMLDivElement
	searches: Search[] = []
	visible = false

	constructor() {

		this.container = document.createElement("div")
		setStyle(this.container, {
			"color": "white",
			"margin": "2em",
			"position": "absolute",
			"top": "0px"
		})
	}

	addParagraph(text: string, link?: string) {

		let p = document.createElement("p")
		if (link != undefined) {
			let a = document.createElement("a")
			setAttributes(a, {
				"href": link,
				"innerHTML": text
			})
			p.appendChild(a)
		} else {
			setAttributes(p, {
				"innerHTML": text
			})
		}
		this.container.appendChild(p)
	}

	hide() {

		setStyle(this.container, {
			"visibility": "hidden"
		})
		this.visible = false
	}

	initialize() {

		this.hide()
		document.body.appendChild(this.container)
	}

	show() {

		setStyle(this.container, {
			"visibility": "visible"
		})
		this.visible = true
	}

	update() {

		removeChildrenOf(this.container)

		if (this.searches.length == 0) {

			this.addParagraph("(No history)")
			return
		}

		for (let search of this.searches) {


		}
	}
}
