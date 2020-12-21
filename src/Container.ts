import { setStyle } from "./util"

export class Container {

	div = document.createElement("div")
	visible = true

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
}
