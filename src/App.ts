import { Menu } from "./Menu"
import { Timer } from "./Timer"
import { clearDocument, setStyle } from "./util"

export class App {

	static readonly RESIZE_TIMER_MS = 100
	canvas: HTMLCanvasElement
	menu = new Menu()

	resizeTimer: Timer

	constructor() {
		this.canvas = document.createElement("canvas")
		this.resizeTimer = new Timer(App.RESIZE_TIMER_MS, () => { this.updateSize() })
	}

	fixStyle() {

		setStyle(document.body, {
			"margin": "0px",
			"overflow": "hidden"
		})
	}

	initialize() {

		clearDocument()
		this.fixStyle()
		document.body.appendChild(this.canvas)
		window.addEventListener("resize", () => {
			this.resizeTimer.reset()
		})
		this.updateSize()
		this.populateMenu()
	}

	populateMenu() {

		this.menu.initialize()
		for (let i = 0; i < 50; i++) {
			this.menu.addButton("Hello", () => { })
		}
	}

	updateSize() {

		let bcr = document.body.getBoundingClientRect()
		this.canvas.width = bcr.width
		this.canvas.height = bcr.height
	}
}
