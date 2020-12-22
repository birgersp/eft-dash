import { Container } from "./Container"
import { Elem } from "./Elem"
import { removeChildrenOf, setAttributes, setStyle } from "./util"

export type Search = {
	label: string,
	url: string
}

export class SearchHistory extends Container {

	searches: Search[] = []
	visible = false

	constructor() {

		super()
		this.div.style({
			"color": "white",
			"margin": "2em",
			"position": "absolute",
			"top": "0px"
		})

		this.hide()
	}

	addParagraph(text: string, link?: string) {

		let p = new Elem("p")
		p.style({
			"margin": "0px"
		})
		if (link != undefined) {
			let a = new Elem("a")
			a.set({
				"href": link,
				"innerHTML": text
			})
			p.append(a)
		} else {
			p.set({
				"innerHTML": text
			})
		}
		this.div.append(p)
	}

	hide() {

		this.div.style({
			"visibility": "hidden"
		})
		this.visible = false
	}

	show() {

		this.div.style({
			"visibility": "visible"
		})
		this.visible = true
	}

	update() {

		this.div.removeChildren()

		let header = new Elem("h2")
		header.style({
			"color": "white"
		})
		header.set({
			"innerHTML": "Search history"
		})
		this.div.append(header)

		if (this.searches.length == 0) {

			this.addParagraph("(No history)")
			return
		}

		for (let search of this.searches) {

			this.addParagraph(search.label, search.url)
		}

		let button = new Elem("input")
			.set({
				"type": "button",
				"value": "Clear",
			})
			.style({
				"margin-top": "2em"
			})
			.appendTo(this.div)
		button.element.addEventListener("click", () => {
			this.searches = []
			this.update()
		})
	}
}
