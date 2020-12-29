import { Elem } from "./Elem"
import { setStyle } from "./util"

export class Container {

	div = new Elem("div")
	visible = true

	constructor() {
		// this.div.style({})
	}

	hide() {

		this.div.style({
			"opacity": "0",
			"transition": "visibility 0s linear 500ms, opacity 500ms",
			"visibility": "hidden"
		})
		this.visible = false
	}

	show() {

		this.div.style({
			"opacity": "1",
			"transition": "",
			"visibility": "visible"
		})
		this.visible = true
	}
}
