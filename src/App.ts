import { AppImage } from "./AppImage"
import { AppState } from "./AppState"
import { Elem } from "./Elem"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { MenuAction } from "./MenuAction"
import { SearchHistory } from "./SearchHistory"
import { Timer } from "./Timer"
import { images, ImageDataObj } from "./images"
import { appendTo, clearDocument, ipIsLocalhost, setAttributes, setStyle } from "./util"

export class App {

	static readonly HEADER_HIDING_TIMER_MS = 1000
	static readonly LOCALSTORAGE_ITEM_NAME = "eft-dash"
	static readonly RESIZE_TIMER_MS = 100

	appImages: AppImage[] = []
	headerHidingTimer: Timer
	hotkeys: Map<string, () => void> = new Map()
	imageViewer = new ImageViewer()
	menu = new Menu()
	menuShouldAutoHide = false
	resizeTimer: Timer
	searchBarFocused = false
	searchHistory = new SearchHistory()
	searchInput = new Elem("input")

	constructor() {

		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => { this.onResized() }
		)

		this.headerHidingTimer = new Timer(
			App.HEADER_HIDING_TIMER_MS,
			() => { this.checkMenuShouldAutoHide() }
		)

		clearDocument()
		appendTo(document.body,
			this.imageViewer.div.element,
			this.searchHistory.div.element,
			this.menu.div.element,
		)
		this.fixStyle()
		window.addEventListener("resize", () => { this.resizeTimer.reset() })
		window.addEventListener("keyup", (evt) => { this.onKey(evt.key) })
		window.addEventListener("mousemove", () => { this.checkResetHidingTimer() })
		window.addEventListener("beforeunload", () => { this.saveState() })
		this.populateMenu()
		this.loadState()
		if (this.imageViewer.currentImage == undefined &&
			this.appImages.length > 0) {
			this.imageViewer.currentImage = this.appImages[0]
			this.appImages[0].load()
		}
		this.updateCanvasSize()
		this.parseSearchParams()
		this.imageViewer.draw()
		this.searchHistory.update()
		this.headerHidingTimer.reset()
		this.searchHistory.div.style({
			"left": `${this.menu.getWidth()}px`
		})
	}

	addImageOption(io: ImageDataObj) {

		let image = new AppImage(io, () => {
			if (this.imageViewer.currentImage == image) {
				this.updateCanvasSize()
				this.imageViewer.draw()
				this.checkResetHidingTimer()
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
			let hkCapitalized = menuAction.hotkey!.toUpperCase()
			if (hkCapitalized != menuAction.hotkey!) {
				this.hotkeys.set(hkCapitalized, menuAction.action)
			}
		}
		text += menuAction.label
		this.menu.addButton(text, menuAction.action)
	}

	addSearchBar() {

		this.searchInput
			.set({
				"placeholder": "(s)Search"
			})
			.style({
				"width": "100%"
			})
			.on("focus", () => { this.searchBarFocused = true })
			.on("blur", () => {
				this.searchBarFocused = false
				this.headerHidingTimer.reset()
			})
			.on("keypress", (evt) => {
				if (evt.key != "Enter") { return }
				let searchInputValue = this.searchInput.element.value
				let url = `escape from tarkov ${searchInputValue}`
				url = url.replace(/ /g, "+")
				url = `http://www.google.com/search?q=${url}`
				this.searchHistory.searches.push({
					label: searchInputValue,
					url: url
				})
				this.searchHistory.update()
				window.open(url)
			})
		this.menu.add(this.searchInput)
		this.hotkeys.set("s", () => {
			this.searchInput.element.value = ""
			this.searchInput.element.focus()
		})
	}

	checkMenuShouldAutoHide() {

		if (this.menu.visible &&
			this.imageViewer.visible &&
			this.menuShouldAutoHide &&
			!this.menu.hasMouseOver &&
			!this.searchBarFocused &&
			!this.searchHistory.visible) {
			this.menu.hide()
		}
	}

	checkResetHidingTimer() {

		if (!this.menu.visible) {
			this.menu.show()
		}

		if (this.menuShouldAutoHide) {
			this.headerHidingTimer.reset()
		}
	}

	fixStyle() {

		setStyle(document.body, {
			"margin": "0px",
			"overflow": "hidden"
		})
	}

	loadState() {

		let json = localStorage.getItem(App.LOCALSTORAGE_ITEM_NAME)
		if (json == null) {
			return
		}
		let state = JSON.parse(json!) as AppState
		this.imageViewer.showGrid = state.gridEnabled
		if (this.imageViewer.currentImage == undefined) {
			for (let image of this.appImages) {
				if (image.options.name == state.currentImageName) {
					this.imageViewer.currentImage = image
					image.load()
					break
				}
			}
		}
		for (let search of state.searches) {
			this.searchHistory.searches.push(search)
		}
		this.searchHistory.update()
	}

	onKey(key: string) {

		if (this.searchBarFocused) {
			if (key == "Escape") {
				this.searchInput.element.blur()
			}
			return
		}

		let action = this.hotkeys.get(key)
		action?.()

		this.checkResetHidingTimer()
	}

	onResized() {
		this.updateCanvasSize()
		if (this.imageViewer.visible) {
			this.imageViewer.draw()
		}
		this.checkResetHidingTimer()
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

		this.addMenuAction({
			action: () => {
				if (this.imageViewer.visible) {
					this.imageViewer.hide()
					this.searchHistory.show()
				} else {
					this.imageViewer.show()
					this.searchHistory.hide()
				}
			},
			label: "S. history"
		})

		if (ipIsLocalhost(window.location.hostname)) {
			this.addImageOption({
				authorName: "birgersp",
				hotkey: "t",
				image: "bluerect.png",
				name: "Test",
				sourceUrl: "http://birgersp.no"
			})
		}

		this.addSearchBar()
	}

	saveState() {

		let state: AppState = {
			currentImageName: this.imageViewer.currentImage!.options.name,
			gridEnabled: this.imageViewer.showGrid,
			searches: this.searchHistory.searches
		}
		let json = JSON.stringify(state)
		localStorage.setItem(App.LOCALSTORAGE_ITEM_NAME, json)
	}

	selectImage(image: AppImage) {

		if (this.searchHistory.visible) {
			this.searchHistory.hide()
		}
		if (!this.imageViewer.visible) {
			this.imageViewer.show()
		}
		this.imageViewer.currentImage = image
		this.updateCanvasSize()
		image.load()
		this.imageViewer.draw()
		this.checkResetHidingTimer()
	}

	updateCanvasSize() {

		let menuWidth = this.menu.getWidth()
		let canvasX: number
		let canvasW = window.innerWidth - menuWidth
		let canvasH = window.innerHeight
		let image = this.imageViewer.currentImage
		if (image != undefined &&
			image.loaded &&
			(canvasW / canvasH) < image!.ar) {
			canvasX = 0
			canvasW = window.innerWidth
			this.menuShouldAutoHide = true
		} else {
			canvasX = menuWidth
			this.menuShouldAutoHide = false
		}

		this.imageViewer.div.style({ "left": canvasX })
		let canvas = this.imageViewer.canvas.element
		canvas.width = canvasW
		canvas.height = canvasH
	}
}
