import { Elem } from "./Elem"
import { setStyle } from "./util"

export class Container {

	div = new Elem("div")
	visible = true

	hide() {

		this.div.style({ "visibility": "hidden" })
		this.visible = false
	}

	show() {

		this.div.style({ "visibility": "visible" })
		this.visible = true
	}
}
