import { ImageOption } from "./ImageOption"
import { UIElement, ElementType } from "./UIElement"
import { VisibleElementSelector } from "./VisibleElementSelector"
import { SearchHistory } from "./SearchHistory"

function setImage(url: string) {
	image.setAttributes({
		src: url
	})
	elementSelector.showElement(image)
}

function addHeaderButton(text: String, callback: Function) {
	let button = new UIElement(ElementType.BUTTON, headerDiv)
	button.setAttributes({
		"innerHTML": text
	})
	button.element.addEventListener("click", () => { callback() })
}

function toggleFullscreen() {
	settings.fullscreen = !settings.fullscreen
	if (settings.fullscreen) {
		document.documentElement.requestFullscreen()
	}
	else {
		document.exitFullscreen()
	}
}

function showHelpText() {
	elementSelector.showElement(helpText)
}

function updateSize() {
	let contentSize = window.innerHeight
	let headerSize = headerDiv.element.clientHeight
	let imageHeight = contentSize - headerSize
	image.setStyle({
		"height": `calc(${imageHeight}px - ${settings.margin * 2}em)`
	})
}


// Setup

let elementSelector = new VisibleElementSelector()

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

UIElement.setStyle(document.body, {
	"margin": "0",
	"background": "#17202A",
	"overflow-y": "hidden"
})

let loadingHeader = document.getElementById("loading_header")
loadingHeader.parentElement.removeChild(loadingHeader)


// Header

let headerDiv = new UIElement(ElementType.DIV)

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
		setImage(option.url)
	})
}

addHeaderButton("Stashes, Customs", () => { window.open("https://i.redd.it/cb4bv3tbggy31.jpg") })

addHeaderButton("Quest Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/19/QuestItemRequirements.png") })

addHeaderButton("Hideout Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/39/Hideout-Requirements-Items-to-Keep.jpg") })

addHeaderButton("S.History", () => { elementSelector.showElement(searchHistory) })

let googleInput = new UIElement(ElementType.INPUT, headerDiv)
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

let contentDiv = new UIElement(ElementType.DIV)
contentDiv.setStyle({
	"margin-top": `${settings.margin}em`,
	"margin-bottom": `${settings.margin}em`
})

let helpText = new UIElement(ElementType.H4, contentDiv)
helpText.setStyle({
	"color": "white",
	"display": "inline-block",
	"margin": `${settings.margin}em`
})
helpText.setAttributes({
	"innerHTML": "<a href=\"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov/\">Maps</a>"
})
elementSelector.addElement(helpText)

let image = new UIElement(ElementType.IMAGE, contentDiv)
image.setStyle({
	"width": "100%",
	"object-fit": "contain"
})
elementSelector.addElement(image)


let searchHistory = new SearchHistory(contentDiv)
searchHistory.setStyle({
	"margin": `${settings.margin}em`
})
elementSelector.addElement(searchHistory)


// Key press

window.addEventListener("keyup", (event) => {
	let key = event.key
	if (key == "Escape") {
		googleInput.element.blur()
		return
	}
	if (document.activeElement == googleInput.element) {
		return
	}
	if (key == "f") {
		toggleFullscreen()
		return
	} else if (key == "s") {
		(googleInput.element as HTMLInputElement).select()
		googleInput.element.focus()
		return
	} else if (key == "h") {
		showHelpText()
	} else {
		let index = parseInt(key) - 1
		if (imageOptions[index]) {
			setImage(imageOptions[index].url)
		}
	}
})

setImage(imageOptions[0].url)

let resizeTimeout: number
window.addEventListener("resize", () => {
	clearTimeout(resizeTimeout)
	resizeTimeout = setTimeout(() => {
		updateSize()
	}, 100)
})
updateSize()
