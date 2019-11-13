import "./ImageOption"
import "./UIElement"

let settings = {
	headerHeight: 20
}

let imageOptions = [
	new ImageOption("customs", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/customs_marvelin1_5.jpg.139c43aa06da1ad715636913d1a5e9e3.jpg"),
	new ImageOption("woods", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/woods_marvelin.jpg.d4692fbf57cdfd608671b16f8caf89ae.jpg"),
	new ImageOption("shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/shoreline_marvelin_2_2.jpg.496b8c902f7b88b12d474fd3107ce578.jpg"),
	new ImageOption("factory", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Factory_marvelin1_2.jpg.0c4c03b58ecfff4b1fe15afef5291e97.jpg"),
	new ImageOption("dorms_customs", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Doorms_marvelin1_2.thumb.jpg.46d00383a0269b37daeb1a3457cca03c.jpg"),
	new ImageOption("health_resort_shoreline", "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/spa_marvelin1_1.jpg.e192f88f3ba73bccdcb437185a44d1d5.jpg"),
	new ImageOption("interchange", "https://i.redd.it/bqftzweimvx31.png")
]

UIElement.setStyle(document.body, {
	"margin": "0",
	"background": "#17202A",
	"overflow-y": "hidden",
	"margin-bottom": "20px"
})

let loadingHeader = document.getElementById("loading_header")
loadingHeader.parentElement.removeChild(loadingHeader)

let headerDiv = new UIElement(ElementType.DIV)
headerDiv.setStyle({
	"height": `${settings.headerHeight}px`
})

let imageDiv = new UIElement(ElementType.DIV)
let image = new UIElement(ElementType.IMAGE, imageDiv)
image.setStyle({
	"width": "100%",
	"height": "100%",
	"object-fit": "contain"
})

function setImage(url: string) {
	image.setAttributes({
		src: url
	})
}

setImage(imageOptions[0].url)

for (let index in imageOptions) {
	let option = imageOptions[index]
	let buttonText = ""
	buttonText += option.label
	let button = new UIElement(ElementType.BUTTON, headerDiv)
	button.setAttributes({
		"innerHTML": buttonText
	})
	button.element.addEventListener("click", () => {
		setImage(option.url)
	})
}

window.addEventListener("keypress", (event) => {
	let index = parseInt(event.key)
	if (imageOptions[index])
		setImage(imageOptions[index].url)
})
