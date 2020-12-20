import { AppImage } from "./AppImage"
import { Footer } from "./Footer"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { MenuAction } from "./MenuAction"
import { Timer } from "./Timer"
import { images, ImageDataObj } from "./images"
import { clearDocument, ipIsLocalhost, removeChildrenOf, setAttributes, setStyle } from "./util"

export class App {

	static readonly HEADER_HIDING_TIMER_MS = 1000
	static readonly RESIZE_TIMER_MS = 100

	appImages: AppImage[] = []
	footer = new Footer()
	headerHidden = false
	headerHidingTimer: Timer
	hotkeys: Map<string, () => void> = new Map()
	imageViewer = new ImageViewer()
	menu = new Menu()
	resizeTimer: Timer
	searchBarFocused = false
	searchInput: HTMLInputElement

	constructor() {

		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => { this.imageViewer.updateSize() }
		)

		this.headerHidingTimer = new Timer(
			App.HEADER_HIDING_TIMER_MS,
			() => {
				if (this.headerHidden || this.menu.hasMouseOver || this.searchBarFocused) {
					return
				}
				this.menu.hide()
				this.footer.hide()
				this.headerHidden = true
			}
		)

		this.searchInput = document.createElement("input")
	}

	addImageOption(io: ImageDataObj) {

		let image = new AppImage(io, () => {
			if (this.imageViewer.currentImage == image) {
				this.imageViewer.draw()
			}
		})
		this.appImages.push(image)
		this.addMenuAction({
			action: () => {
				this.selectImage(image)
			},
			hotkey: io.hotkey,
			label: io.name
		})
	}

	addMenuAction(menuAction: MenuAction) {

		let text = ""
		if (menuAction.hotkey != null) {
			text += `(${menuAction.hotkey})`
			this.hotkeys.set(menuAction.hotkey, menuAction.action)
		}
		text += menuAction.label
		this.menu.addButton(text, menuAction.action)
	}

	addSearchBar() {

		setAttributes(this.searchInput, {
			"placeholder": "(s)Search"
		})
		this.searchInput.addEventListener("focus", () => { this.searchBarFocused = true })
		this.searchInput.addEventListener("blur", () => {
			this.searchBarFocused = false
			this.headerHidingTimer.reset()
		})
		this.menu.container.appendChild(this.searchInput)
		this.hotkeys.set("s", () => {
			this.searchInput.focus()
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
		window.addEventListener("keyup", (evt) => { this.onKey(evt.key) })
		window.addEventListener("mousemove", () => {
			if (this.headerHidden) {
				this.menu.show()
				this.footer.show()
				this.headerHidden = false
			}
			this.headerHidingTimer.reset()
		})
		this.headerHidingTimer.reset()
		this.footer.initialize()
		this.parseSearchParams()
	}

	onKey(key: string) {

		if (this.headerHidden) {
			this.menu.show()
			this.headerHidden = false
			this.headerHidingTimer.reset()
		}

		if (this.searchBarFocused) {
			if (key == "Escape") {
				this.searchInput.blur()
			}
			return
		}

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
				this.selectImage(image)
				return
			}
		}
	}

	populateMenu() {

		this.menu.initialize()
		for (let io of images) {
			this.addImageOption(io)
		}

		this.addMenuAction({
			action: () => {
				this.imageViewer.showGrid = !this.imageViewer.showGrid
				this.imageViewer.draw()
			},
			hotkey: "g",
			label: "Grid"
		})

		this.addSearchBar()

		if (ipIsLocalhost(window.location.hostname)) {
			this.addImageOption({
				authorName: "birgersp",
				hotkey: "t",
				image: "bluerect.png",
				name: "Test",
				sourceUrl: "http://birgersp.no"
			})
		}
	}

	selectImage(image: AppImage) {

		this.imageViewer.currentImage = image
		this.imageViewer.draw()
		this.footer.setText(image.options.authorName, image.options.sourceUrl)
		image.load()
	}
}
