import { Container } from "./Container"
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
		setStyle(this.div, {
			"color": "white",
			"margin": "2em",
			"position": "absolute",
			"top": "0px"
		})

		this.hide()
	}

	addParagraph(text: string, link?: string) {

		let p = document.createElement("p")
		setStyle(p, {
			"margin": "0px"
		})
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
		this.div.appendChild(p)
	}

	hide() {

		setStyle(this.div, {
			"visibility": "hidden"
		})
		this.visible = false
	}

	show() {

		setStyle(this.div, {
			"visibility": "visible"
		})
		this.visible = true
	}

	update() {

		removeChildrenOf(this.div)

		let header = document.createElement("h2")
		setStyle(header, {
			"color": "white"
		})
		setAttributes(header, {
			"innerHTML": "Search history"
		})
		this.div.appendChild(header)

		if (this.searches.length == 0) {

			this.addParagraph("(No history)")
			return
		}

		for (let search of this.searches) {

			this.addParagraph(search.label, search.url)
		}
	}
}
