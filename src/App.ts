import { AppImage } from "./AppImage"
import { AppState } from "./AppState"
import { ImageViewer } from "./ImageViewer"
import { Menu } from "./Menu"
import { MenuAction } from "./MenuAction"
import { SearchHistory } from "./SearchHistory"
import { Timer } from "./Timer"
import { images, ImageDataObj } from "./images"
import { clearDocument, ipIsLocalhost, setAttributes, setStyle } from "./util"

export class App {

	static readonly HEADER_HIDING_TIMER_MS = 1000
	static readonly LOCALSTORAGE_ITEM_NAME = "eft-dash"
	static readonly RESIZE_TIMER_MS = 100

	appImages: AppImage[] = []
	headerHidden = false
	headerHidingTimer: Timer
	hotkeys: Map<string, () => void> = new Map()
	imageViewer = new ImageViewer()
	menu = new Menu()
	resizeTimer: Timer
	searchBarFocused = false
	searchHistory = new SearchHistory()
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
				this.headerHidden = true
			}
		)

		this.searchInput = document.createElement("input")

		clearDocument()
		this.fixStyle()
		window.addEventListener("resize", () => {
			this.resizeTimer.reset()
		})
		this.populateMenu()
		window.addEventListener("keyup", (evt) => { this.onKey(evt.key) })
		window.addEventListener("mousemove", () => {
			if (this.headerHidden) {
				this.menu.show()
				this.headerHidden = false
			}
			this.headerHidingTimer.reset()
		})
		this.headerHidingTimer.reset()
		window.addEventListener("beforeunload", () => {
			this.saveState()
		})
		this.loadState()
		this.parseSearchParams()
		document.body.appendChild(this.imageViewer.div)
		this.imageViewer.draw()
		document.body.appendChild(this.searchHistory.div)
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

		setAttributes(this.searchInput, {
			"placeholder": "(s)Search"
		})
		this.searchInput.addEventListener("focus", () => { this.searchBarFocused = true })
		this.searchInput.addEventListener("blur", () => {
			this.searchBarFocused = false
			this.headerHidingTimer.reset()
		})
		this.searchInput.addEventListener("keypress", (evt) => {
			if (evt.key != "Enter") { return }
			let searchInputValue = this.searchInput.value
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

		if (this.headerHidden) {
			this.menu.show()
			this.headerHidden = false
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
			hotkey: "h",
			label: "S. history"
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

		this.imageViewer.currentImage = image
		this.imageViewer.draw()
		image.load()
	}
}
