import { AppImage } from "./AppImage"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { Timer } from "./Timer"
import { imageOptions, ImageOption_temp } from "./imageOptions"
import { clearDocument, setStyle } from "./util"

export class App {

	static readonly RESIZE_TIMER_MS = 100
	imageViewer = new ImageViewer()
	menu = new Menu()

	resizeTimer: Timer

	constructor() {
		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => { this.imageViewer.updateSize() }
		)
	}

	addImageOption(io: ImageOption_temp) {

		let image = new AppImage(io, () => {
			console.log("loaded")
			if (this.imageViewer.currentImage == image) {
				this.imageViewer.renderImage()
			}
		})
		this.menu.addButton(io.name, () => {
			image.load()
			this.imageViewer.currentImage = image
			this.imageViewer.renderImage()
		})
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
		window.addEventListener("resize", () => {
			this.resizeTimer.reset()
		})
		this.imageViewer.initialize()
		this.populateMenu()
	}

	populateMenu() {

		this.menu.initialize()
		for (let io of imageOptions) {
			this.addImageOption(io)
		}
	}
}
