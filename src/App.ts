import { AppImage } from "./AppImage"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { Timer } from "./Timer"
import { images, ImageDataObj } from "./images"
import { clearDocument, setStyle } from "./util"

export class App {

	static readonly RESIZE_TIMER_MS = 100
	appImages: AppImage[] = []
	imageViewer = new ImageViewer()
	menu = new Menu()
	resizeTimer: Timer

	constructor() {
		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => { this.imageViewer.updateSize() }
		)
	}

	addImageOption(io: ImageDataObj) {

		let image = new AppImage(io, () => {
			if (this.imageViewer.currentImage == image) {
				this.imageViewer.renderImage()
			}
		})
		this.appImages.push(image)
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
		this.parseSearchParams()
	}

	parseSearchParams() {

		let search = window.location.search.replace(/^\?/, "")
		if (search == "") {
			return
		}
		for (let image of this.appImages) {
			if (image.options.name == search) {
				this.imageViewer.currentImage = image
				this.imageViewer.renderImage()
				image.load()
				return
			}
		}
	}

	populateMenu() {

		this.menu.initialize()
		for (let io of images) {
			this.addImageOption(io)
		}
	}
}
