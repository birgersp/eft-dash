import { HelpTextBuilder } from "./HelpTextBuilder"
import { HideableUIElement } from "./HideableUIElement"
import { ImageOption } from "./ImageOption"
import { LocalStorageData } from "./LocalStorageData"
import { SearchHistory } from "./SearchHistory"
import { Timer } from "./Timer"
import { ElementType, UIElement } from "./UIElement"

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
	imageLoadingLabel.setInnerHTML(`Loading<br>${url}`)
	imageLoadingLabel.show()
	imageCreditLabel.setInnerHTML(option.credit)
	imageCreditLabel.show()
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

function saveLocal() {
	let data = JSON.stringify(localStorageData)
	localStorage.setItem(localStorageItemName, data)
}

function showSearchHistory() {
	hideContentElements()
	searchHistory.show()
}

function addImageOption(label: string, url: string, authorName: string, sourceLink: string, hotkey?: string) {
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
	let creditString = `image by ${authorName} (<a href="${sourceLink}">link</a>)`
	let option = new ImageOption(label, url, creditString)
	imageOptions.push(option)
	let image = option.image
	image.setStyle({
		"height": "100%",
		"object-fit": "contain",
		"width": "100%"
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

let headerVisible = true
let contentDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let headerDiv = UIElement.createHTMLBodyChild(ElementType.DIV)
let contentElements: HideableUIElement[] = []



// Setup

let localStorageItemName = "eft-dash"

let settings = {
	fullscreen: false,
	margin: .3
}

let loadingHeaderElement = document.getElementById("loading_header") as HTMLElement
let loadingHeader = new HideableUIElement(loadingHeaderElement)
setTimeout(() => { loadingHeader.hide() }, 10)

let imageOptions: ImageOption[] = []
let keyActions: Record<string, () => void> = {}



// Header

headerDiv.setStyle({
	"position": "absolute"
})

addHeaderButton("Help", () => {
	showHelpText()
})

addHeaderButton("(f)Fullscreen", () => {
	toggleFullscreen()
})

addImageOption(
	"Customs",
	"https://i.redd.it/8udfaht87zd51.png",
	"u/monkimonkimonk",
	"https://www.reddit.com/r/EscapefromTarkov/comments/i0k2qz/updated_customs_map_for_127_with_loot_caches/",
	"1"
)
addImageOption(
	"Woods",
	"https://forum.escapefromtarkov.com/uploads/monthly_2018_02/woods_marvelin.jpg.d4692fbf57cdfd608671b16f8caf89ae.jpg",
	"Marvelin",
	"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov",
	"2"
)
addImageOption(
	"Shoreline",
	"https://forum.escapefromtarkov.com/uploads/monthly_2019_01/shoreline_marvelin_2_2.jpg.496b8c902f7b88b12d474fd3107ce578.jpg",
	"Marvelin",
	"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov",
	"3"
)
addImageOption(
	"Factory",
	"https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Factory_marvelin1_2.jpg.0c4c03b58ecfff4b1fe15afef5291e97.jpg",
	"Marvelin",
	"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov",
	"4"
)
addImageOption(
	"Dorms, Customs",
	"https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Doorms_marvelin1_2.thumb.jpg.46d00383a0269b37daeb1a3457cca03c.jpg",
	"Marvelin",
	"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov",
	"5"
)
addImageOption(
	"Resort, Shoreline",
	"https://forum.escapefromtarkov.com/uploads/monthly_2018_02/spa_marvelin1_1.jpg.e192f88f3ba73bccdcb437185a44d1d5.jpg",
	"Marvelin",
	"https://forum.escapefromtarkov.com/topic/56652-maps-of-tarkov",
	"6"
)
addImageOption(
	"Interchange",
	"https://i.redd.it/bqftzweimvx31.png",
	"u/Lorathor6",
	"https://www.reddit.com/r/EscapefromTarkov/comments/8gixyg/interchange_map_incl_loot_and_keys",
	"7"
)
addImageOption(
	"Keys",
	"https://i.imgur.com/WI3Qg2G.jpg",
	"Pestily",
	"https://www.reddit.com/r/EscapefromTarkov/comments/f3tfry/pestilys_recommended_keys_for_every_map",
	"k"
)
addImageOption(
	"Ammo",
	"https://i.redd.it/eawzvoj4blc41.png",
	"sunmachine",
	"https://www.reddit.com/r/EscapefromTarkov/comments/eqk10n/for_new_players_my_braindead_simple_ammo_chart/",
	"a"
)
addImageOption(
	"Items",
	"https://i.redd.it/bu31y4cnikh41.png",
	"u/Fenneca",
	"https://www.reddit.com/r/EscapefromTarkov/comments/f5htgo/i_made_a_quick_glance_per_slot_value_guide_for/fi3z8rz/",
	"i"
)
addImageOption(
	"Hideout Items",
	"https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/3/39/Hideout-Requirements-Items-to-Keep.jpg",
	"u/Chab_TV",
	"https://www.reddit.com/r/EscapefromTarkov/comments/du957n/hideout_requirements_items_to_keep/",
	"h"
)

addHeaderButton("Stashes, Customs", () => { window.open("https://i.redd.it/cb4bv3tbggy31.jpg") })
addHeaderButton("Quest Items", () => { window.open("https://gamepedia.cursecdn.com/escapefromtarkov_gamepedia/1/19/QuestItemRequirements.png") })
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
	"margin-bottom": `${settings.margin}em`,
	"margin-top": `${settings.margin}em`
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
	.addParagraph("Stashes hideout by m1ksu")

let imageLoadingLabel = addContentElement(new HideableUIElement(ElementType.H4))
imageLoadingLabel.setStyle({
	color: "white",
	position: "absolute",
	"text-align": "center",
	top: "50%",
	width: "100%",
	"z-index": -1
})

let searchHistory = new SearchHistory()
addContentElement(searchHistory)
searchHistory.setStyle({
	"padding-left": `${settings.margin}em`
})

let imageCreditLabel = new HideableUIElement(ElementType.PARAGRAPH)
imageCreditLabel.setStyle({
	background: "#17202A",
	color: "white",
	margin: "0px",
	padding: "2px",
	top: "0px"
})
addContentElement(imageCreditLabel)
imageCreditLabel.setStyle({
	bottom: "0px",
	position: "absolute",
	top: ""
})



// Key press

setHotkey("f", toggleFullscreen)
setHotkey("s", () => {
	(googleInput.element as HTMLInputElement).select()
	googleInput.element.focus()
})

window.addEventListener("keydown", event => {
	let key = event.key
	if (key == "Tab") {
		googleInput.element.blur()
	}
})

window.addEventListener("keyup", event => {
	let key = event.key
	if (key == "Tab") {
		(document.activeElement as HTMLElement).blur()
		return
	}
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




let activationTimer = new Timer(1000, () => {
	headerDiv.setStyle({ "visibility": "hidden" })
	headerVisible = false
})
activationTimer.reset()
function activateHeader() {
	if (!headerVisible) {
		headerDiv.setStyle({ "visibility": "visible" })
		headerVisible = true
	}
	activationTimer.reset()
}
window.addEventListener("mousemove", activateHeader)



// Local storage

let localStorageData = new LocalStorageData(0)

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
