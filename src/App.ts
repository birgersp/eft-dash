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
	resizeTimer: Timer
	searchBarFocused = false
	searchHistory = new SearchHistory()
	searchInput = new Elem("input")

	constructor() {

		this.resizeTimer = new Timer(
			App.RESIZE_TIMER_MS,
			() => {
				this.updateSize()
			}
		)

		this.headerHidingTimer = new Timer(
			App.HEADER_HIDING_TIMER_MS,
			() => {
				if ((!this.menu.visible) || this.menu.hasMouseOver || this.searchBarFocused || this.searchHistory.visible) {
					return
				}
				this.menu.hide()
			}
		)

		clearDocument()
		appendTo(document.body,
			this.imageViewer.div.element,
			this.searchHistory.div.element,
			this.menu.div.element,
		)
		this.fixStyle()
		window.addEventListener("resize", () => {
			this.resizeTimer.reset()
		})
		this.populateMenu()
		window.addEventListener("keyup", (evt) => { this.onKey(evt.key) })
		window.addEventListener("mousemove", () => {
			if (!this.menu.visible) {
				this.menu.show()
			}
			if (!this.searchHistory.visible) {
				this.headerHidingTimer.reset()
			}
		})
		this.headerHidingTimer.reset()
		window.addEventListener("beforeunload", () => {
			this.saveState()
		})
		this.updateSize()
		this.loadState()
		this.parseSearchParams()
		this.imageViewer.draw()
		this.searchHistory.update()
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
		this.menu.div.append(this.searchInput)
		this.hotkeys.set("s", () => {
			this.searchInput.element.value = ""
			this.searchInput.element.focus()
		})
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
					this.selectImage(image)
				}
			}
		}
		for (let search of state.searches) {
			this.searchHistory.searches.push(search)
		}
		this.searchHistory.update()
	}

	onKey(key: string) {

		this.headerHidingTimer.reset()

		if (!this.menu.visible) {
			this.menu.show()
		}

		if (this.searchBarFocused) {
			if (key == "Escape") {
				this.searchInput.element.blur()
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

		this.searchHistory.hide()
		this.imageViewer.show()
		this.imageViewer.currentImage = image
		this.imageViewer.draw()
		image.load()
	}

	updateSize() {

		this.imageViewer.updateSize()
		this.searchHistory.div.style({
			"left": `${this.menu.div.element.getBoundingClientRect().width}px`
		})
	}
}
