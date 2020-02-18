import { ImageOption } from "./ImageOption"
import { UIElement, ElementType } from "./UIElement"
import { SearchHistory } from "./SearchHistory"
import { HelpTextBuilder } from "./HelpTextBuilder"
import { LocalStorageData } from "./LocalStorageData"

function hideContentElements() {
	for (let index in contentElements) {
		contentElements[index].hide()
	}
}

function addContentElement(element: UIElement): UIElement {
	contentDiv.element.appendChild(element.element)
	element.setStyle({ position: "absolute", opacity: 0 })
	contentElements.push(element)
	return element
}

function setImage(index: number) {
	let url = imageOptions[index].url
	hideContentElements()
	loadingLabel.setAttributes({ innerHTML: `Loading<br>${url}` })
	loadingLabel.show()
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
	image.setStyle({
		"height": `calc(${imageHeight}px - ${settings.margin * 2}em)`
	})
}

function saveLocal() {
	let data = JSON.stringify(localStorageData)
	localStorage.setItem(localStorageItemName, data)
}



// Setup

let localStorageItemName = "eft-dash"

let settings = {
	margin: .3,
	fullscreen: false
}

let imageOptions = [
	new ImageOption("Customs", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/customs_marvelin1_5.jpg.139c43aa06da1ad715636913d1a5e9e3.jpg"),
	new ImageOption("Woods", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/woods_marvelin.jpg.d4692fbf57cdfd608671b16f8caf89ae.jpg"),
	new ImageOption("Shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/shoreline_marvelin_2_2.jpg.496b8c902f7b88b12d474fd3107ce578.jpg"),
	new ImageOption("Factory", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Factory_marvelin1_2.jpg.0c4c03b58ecfff4b1fe15afef5291e97.jpg"),
	new ImageOption("Dorms, Customs", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Doorms_marvelin1_2.thumb.jpg.46d00383a0269b37daeb1a3457cca03c.jpg"),
	new ImageOption("Resort, Shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/spa_marvelin1_1.jpg.e192f88f3ba73bccdcb437185a44d1d5.jpg"),
	new ImageOption("Interchange", "https://i.redd.it/bqftzweimvx31.png")
]


// Main UI elements

let headerDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let contentDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let contentElements: UIElement[] = []

UIElement.setStyle(document.body, {
	"margin": "0",
	"background": "#17202A",
	"overflow-y": "hidden"
})

let loadingHeaderElement = document.getElementById("loading_header")
let loadingHeader = new UIElement(loadingHeaderElement)
setTimeout(() => { loadingHeader.hide() }, 10)



// Header

addHeaderButton("(h)Help", () => {
	showHelpText()
})

addHeaderButton("(f)Fullscreen", () => {
	toggleFullscreen()
})

for (let index in imageOptions) {
	let indexInt = parseInt(index)
	let option = imageOptions[indexInt]
	let buttonText = ""
	if ((indexInt + 1) <= 9) {
		buttonText += `(${indexInt + 1})`
	}
	buttonText += option.label
	addHeaderButton(buttonText, () => {
		setImage(indexInt)
	})
}

addHeaderButton("Stashes, Customs", () => { window.open("https://i.redd.it/cb4bv3tbggy31.jpg") })

addHeaderButton("Quest Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/19/QuestItemRequirements.png") })

addHeaderButton("Hideout Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/39/Hideout-Requirements-Items-to-Keep.jpg") })

addHeaderButton("S.History", () => {
	hideContentElements()
	searchHistory.show()
})

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

let helpTextContainer = addContentElement(new UIElement(ElementType.DIV))
helpTextContainer.setStyle({
	"padding-left": `${settings.margin}em`
})
let helpTextBuilder = new HelpTextBuilder(helpTextContainer)
helpTextBuilder
	.addH4("EFT Dash")
	.addParagraph("by <a href=\"https://github.com/birgersp\">birgersp</a>")
	.addParagraph("Huge thanks to <a href=\"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov/\">Marvelin for creating these awesome maps</a>")

let loadingLabel = addContentElement(new UIElement(ElementType.H4))
loadingLabel.setStyle({
	position: "absolute",
	top: "50%",
	"text-align": "center",
	width: "100%",
	color: "white"
})

let image = addContentElement(new UIElement(ElementType.IMAGE))
image.setAttributes({
	id: "image"
})
image.setStyle({
	"width": "100%",
	"object-fit": "contain"
})
image.element.addEventListener("load", () => {
	image.show()
	loadingLabel.hide()
})

let searchHistory = new SearchHistory()
addContentElement(searchHistory)
searchHistory.setStyle({
	"margin": `${settings.margin}em`
})



// Key press

let keyActions: Record<string, () => void> = {
	"f": toggleFullscreen,
	"s": () => {
		(googleInput.element as HTMLInputElement).select()
		googleInput.element.focus()
	},
	"h": showHelpText
}

window.addEventListener("keyup", (event) => {
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
	} else {
		let index = parseInt(key) - 1
		if (imageOptions[index]) {
			setImage(index)
		}
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

let data = localStorage.getItem(localStorageItemName)
if (data != null) {
	localStorageData = JSON.parse(data)
}

setImage(localStorageData.imageIndex)
