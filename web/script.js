"use strict";

const mapURLs = {
	customs: "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/customs_marvelin1_5.jpg.139c43aa06da1ad715636913d1a5e9e3.jpg",
	woods: "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/woods_marvelin.jpg.d4692fbf57cdfd608671b16f8caf89ae.jpg",
	shoreline: "https://forum.escapefromtarkov.com/uploads/monthly_2019_01/shoreline_marvelin_2_2.jpg.496b8c902f7b88b12d474fd3107ce578.jpg",
	factory: "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Factory_marvelin1_2.jpg.0c4c03b58ecfff4b1fe15afef5291e97.jpg",
	dorms_customs: "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/Doorms_marvelin1_2.thumb.jpg.46d00383a0269b37daeb1a3457cca03c.jpg",
	health_resort_shoreline: "https://forum.escapefromtarkov.com/uploads/monthly_2018_02/spa_marvelin1_1.jpg.e192f88f3ba73bccdcb437185a44d1d5.jpg",
	interchange: "https://i.redd.it/bqftzweimvx31.png"
}

let app = {
	title: "EFT Stuff",
	image: null,
	indexedMapUrls: {},
	headerHeight: "20px",
}

function setStyle(element, style) {

	for (let key in style) {

		element.style.setProperty(key, style[key]);
	}
}

function setAttributes(element, attributes) {

	for (let key in attributes) {

		if (key == "innerHTML")
			element.innerHTML = attributes[key];
		else
			element.setAttribute(key, attributes[key]);
	}
}

function appendElement(parent, tagName, style) {

	let element = document.createElement(tagName);

	if (style != null)
		setStyle(element, style);

	parent.appendChild(element);
	return element;
}

function setImage(url) {
	setAttributes(app.image, {
		src: url
	});
}

function main() {

	let titleElement = appendElement(document.head, "title");
	setAttributes(titleElement, { innerHTML: app.title });

	setStyle(document.body, {
		margin: "0",
		background: "#17202A",
		"overflow-y": "hidden",
		"margin-bottom": "20px"
	});

	let headerDiv = appendElement(document.body, "div", {
		height: app.headerHeight + "px"
	})

	let index = 1;
	for (let key in mapURLs) {

		let url = mapURLs[key];
		let buttonText = "";
		if (index <= 9) {
			app.indexedMapUrls[index] = url;
			buttonText += "(" + index + ")";
		}
		buttonText += key;
		let button = appendElement(headerDiv, "button")
		setAttributes(button, {
			type: "button",
			innerHTML: buttonText
		});
		button.addEventListener("click", () => { setImage(url); });

		index++;
	}

	let text = appendElement(headerDiv, "h4", {
		color: "white",
		display: "inline-block",
		margin: 0,
		"margin-left": "2px"
	});
	setAttributes(text, { innerHTML: "Tip: Use hotkeys. Press F11 to fullscreen" });

	let imageDiv = appendElement(document.body, "div");
	app.image = appendElement(imageDiv, "img", {
		width: "100%",
		height: "100%",
		"object-fit": "contain"
	});
	setAttributes(app.image, {
		src: mapURLs.customs
	});

	window.addEventListener("keypress", (event) => {
		if (app.indexedMapUrls[event.key] != null) {
			setImage(app.indexedMapUrls[event.key]);
		}
	});
}

