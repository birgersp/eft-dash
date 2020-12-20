import { AppImage } from "./AppImage"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { Timer } from "./Timer"
import { images, ImageDataObj } from "./images"
import { clearDocument, ipIsLocalhost, setStyle } from "./util"

export class App {

	static readonly HEADER_HIDING_TIMER_MS = 1000
	static readonly RESIZE_TIMER_MS = 100
	appImages: AppImage[] = []
	headerHidden = false
	headerHidingTimer: Timer
	hotkeys: Map<string, () => void> = new Map()
	imageViewer = new ImageViewer()
	menu = new Menu()
	resizeTimer: Timer

	constructor() {

		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => { this.imageViewer.updateSize() }
		)

		this.headerHidingTimer = new Timer(
			App.HEADER_HIDING_TIMER_MS,
			() => {
				if (this.headerHidden || this.menu.hasMouseOver) {
					return
				}
				this.menu.hide()
				this.headerHidden = true
			}
		)
	}

	addImageOption(io: ImageDataObj) {

		let image = new AppImage(io, () => {
			if (this.imageViewer.currentImage == image) {
				this.imageViewer.drawImage()
			}
		})
		this.appImages.push(image)
		let label = `(${io.hotkey})${io.name}`
		let action = () => {
			image.load()
			this.imageViewer.currentImage = image
			this.imageViewer.drawImage()
		}
		this.menu.addButton(label, action)
		this.hotkeys.set(io.hotkey, action)
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
		window.addEventListener("keyup", (evt) => { this.onKey(evt.key) })
		window.addEventListener("mousemove", () => {
			if (this.headerHidden) {
				this.menu.show()
				this.headerHidden = false
			}
			this.headerHidingTimer.reset()
		})
		this.headerHidingTimer.reset()
	}

	onKey(key: string) {

		let action = this.hotkeys.get(key)
		action?.()
	}

	parseSearchParams() {

		let search = window.location.search.replace(/^\?/, "")
		if (search == "") {
			return
		}
		for (let image of this.appImages) {
			if (image.options.name == search) {
				this.imageViewer.currentImage = image
				this.imageViewer.drawImage()
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

		if (ipIsLocalhost(window.location.hostname)) {
			this.addImageOption({
				authorName: "birgersp",
				hotkey: "T",
				image: "bluerect.png",
				name: "Test",
				sourceUrl: "http://birgersp.no"
			})
		}
	}
}
