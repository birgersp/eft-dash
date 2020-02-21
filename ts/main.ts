import { ImageOption } from "./ImageOption"
import { UIElement, ElementType } from "./UIElement"
import { SearchHistory } from "./SearchHistory"
import { HelpTextBuilder } from "./HelpTextBuilder"
import { LocalStorageData } from "./LocalStorageData"
import { HideableUIElement } from "./HideableUIElement"

function hideContentElements() {
	for (let index in contentElements) {
		contentElements[index].hide()
	}
	imageLoadingLabel.setStyle({ visibility: "hidden" })
}

function addContentElement(element: HideableUIElement): HideableUIElement {
	contentDiv.element.appendChild(element.element)
	element.setStyle({ position: "absolute", visibility: "hidden" })
	contentElements.push(element)
	return element
}

function setImage(index: number) {
	let option = imageOptions[index]
	let url = option.url
	hideContentElements()
	imageLoadingLabel.setAttributes({ innerHTML: `Loading<br>${url}` })
	imageLoadingLabel.show()
	let image = option.image
	image.setAttributes({ src: url })
	localStorageData.imageIndex = index
	saveLocal()
}

function addHeaderButton(text: String, callback: Function) {
	let button = headerDiv.createChild(ElementType.BUTTON)
	button.setAttributes({
		"innerHTML": text
	})
	button.element.addEventListener("click", () => { callback() })
}

function toggleFullscreen() {
	settings.fullscreen = (document.fullscreenElement == null)
	if (settings.fullscreen) {
		document.documentElement.requestFullscreen()
	}
	else {
		document.exitFullscreen()
	}
}

function showHelpText() {
	hideContentElements()
	helpTextContainer.show()
}

function updateSize() {
	let contentSize = window.innerHeight
	let headerSize = headerDiv.element.clientHeight
	let imageHeight = contentSize - headerSize
	imageOptions.forEach(option => {
		option.image.setStyle({
			"height": `calc(${imageHeight}px - ${settings.margin * 2}em)`
		})
	})
}

function saveLocal() {
	let data = JSON.stringify(localStorageData)
	localStorage.setItem(localStorageItemName, data)
}

function showSearchHistory() {
	hideContentElements()
	searchHistory.show()
}

function addImageOption(label: string, url: string, hotkey?: string) {
	let index = imageOptions.length
	let buttonText = ""
	if (hotkey != null) {
		buttonText += `(${hotkey})`
		setHotkey(hotkey, () => {
			setImage(index)
		})
	}
	buttonText += label
	addHeaderButton(buttonText, () => { setImage(index) })
	let option = new ImageOption(label, url)
	imageOptions.push(option)
	let image = option.image
	image.setStyle({
		"width": "100%",
		"object-fit": "contain"
	})
	image.element.addEventListener("load", () => {
		image.show()
	})
	addContentElement(image)
}

function setHotkey(key: string, func: () => void) {
	if (keyActions[key] != null) {
		throw new Error(`Key ${key} is already mapped as a hotkey`)
	}
	keyActions[key] = func
}



// Main UI elements

let headerDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let contentDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let contentElements: HideableUIElement[] = []



// Setup

let localStorageItemName = "eft-dash"

let settings = {
	margin: .3,
	fullscreen: false
}

let loadingHeaderElement = document.getElementById("loading_header")
let loadingHeader = new HideableUIElement(loadingHeaderElement)
setTimeout(() => { loadingHeader.hide() }, 10)

let imageOptions = []
let keyActions: Record<string, () => void> = {}



// Header

addHeaderButton("(h)Help", () => {
	showHelpText()
})

addHeaderButton("(f)Fullscreen", () => {
	toggleFullscreen()
})

addImageOption("Customs", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/customs_marvelin1_5.jpg.139c43aa06da1ad715636913d1a5e9e3.jpg", "1")
addImageOption("Woods", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/woods_marvelin.jpg.d4692fbf57cdfd608671b16f8caf89ae.jpg", "2")
addImageOption("Shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/shoreline_marvelin_2_2.jpg.496b8c902f7b88b12d474fd3107ce578.jpg", "3")
addImageOption("Factory", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Factory_marvelin1_2.jpg.0c4c03b58ecfff4b1fe15afef5291e97.jpg", "4")
addImageOption("Dorms, Customs", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Doorms_marvelin1_2.thumb.jpg.46d00383a0269b37daeb1a3457cca03c.jpg", "5")
addImageOption("Resort, Shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/spa_marvelin1_1.jpg.e192f88f3ba73bccdcb437185a44d1d5.jpg", "6")
addImageOption("Interchange", "https://i.redd.it/bqftzweimvx31.png", "7")
addImageOption("Keys", "https://i.imgur.com/WI3Qg2G.jpg", "k")
addImageOption("Items", "https://i.redd.it/bu31y4cnikh41.png", "i")

addHeaderButton("Stashes, Customs", () => { window.open("https://i.redd.it/cb4bv3tbggy31.jpg") })
addHeaderButton("Quest Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/19/QuestItemRequirements.png") })
addHeaderButton("Hideout Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/39/Hideout-Requirements-Items-to-Keep.jpg") })
addHeaderButton("S.History", showSearchHistory)

let googleInput = headerDiv.createChild(ElementType.INPUT)
googleInput.setAttributes({
	"placeholder": "(s)Search..."
})
googleInput.element.addEventListener("keypress", (event) => {
	if (event.key == "Enter") {
		let searchInputValue = (googleInput.element as HTMLInputElement).value
		let url = `escape from tarkov ${searchInputValue}`
		url = url.replace(/ /g, "+")
		url = `http://www.google.com/search?q=${url}`
		searchHistory.addSearchAndSave(searchInputValue, url)
		window.open(url)
	}
})



// Content

contentDiv.setStyle({
	"margin-top": `${settings.margin}em`,
	"margin-bottom": `${settings.margin}em`
})

let helpTextContainer = addContentElement(new HideableUIElement(ElementType.DIV))
helpTextContainer.setStyle({
	"padding-left": `${settings.margin}em`
})
let helpTextBuilder = new HelpTextBuilder(helpTextContainer)
helpTextBuilder
	.addH4("EFT Dash")
	.addParagraph("by <a href=\"https://github.com/birgersp\">birgersp</a>")
	.addParagraph("Huge thanks to <a href=\"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov/\">Marvelin for creating these awesome maps</a>")

let imageLoadingLabel = addContentElement(new HideableUIElement(ElementType.H4))
imageLoadingLabel.setStyle({
	position: "absolute",
	top: "50%",
	"text-align": "center",
	width: "100%",
	color: "white",
	"z-index": -1
})

let searchHistory = new SearchHistory()
addContentElement(searchHistory)
searchHistory.setStyle({
	"padding-left": `${settings.margin}em`
})



// Key press

setHotkey("f", toggleFullscreen)
setHotkey("s", () => {
	(googleInput.element as HTMLInputElement).select()
	googleInput.element.focus()
})
setHotkey("h", showHelpText)

window.addEventListener("keyup", event => {
	let key = event.key
	if (key == "Escape") {
		googleInput.element.blur()
		return
	}
	// Ignore key presses while search bar is in focus
	if (document.activeElement == googleInput.element) {
		return
	}
	let keyAction = keyActions[key]
	if (keyAction != null) {
		keyAction()
	}
})

let resizeTimeout: number
window.addEventListener("resize", () => {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(() => {
		updateSize()
	}, 100)
})
updateSize()



// Local storage

let localStorageData = new LocalStorageData()
localStorageData.imageIndex = 0

let locationHashHasIndex = false
if (location.hash != "") {
	try {
		let string = location.hash.replace("#", "")
		let integer = parseInt(string) - 1
		if ((integer > 0) && (integer < imageOptions.length)) {
			locationHashHasIndex = true
			setImage(integer)
		}
	} catch (exception) {
	}
}

if (locationHashHasIndex == false) {
	let data = localStorage.getItem(localStorageItemName)
	if (data != null) {
		localStorageData = JSON.parse(data)
	}
	setImage(localStorageData.imageIndex)
}
