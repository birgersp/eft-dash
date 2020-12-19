import { AppImage } from "./AppImage"

export class ImageViewer {

	canvas: HTMLCanvasElement
	currentImage?: AppImage

	constructor() {

		this.canvas = document.createElement("canvas")
	}

	initialize() {

		document.body.appendChild(this.canvas)
		this.updateSize()
	}

	renderImage() {

		if (this.currentImage == undefined) {
			return
		}

		let ctx = this.canvas.getContext("2d")!
		ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		if (!this.currentImage!.loaded) {
			this.drawLoadingText()
			return
		}

		let w: number, h: number
		let img = this.currentImage!.image
		let ar = img.width / img.height
		let car = this.canvas.width / this.canvas.height
		if (car > ar) {
			h = this.canvas.height
			w = h * ar
		} else {
			w = this.canvas.width
			h = w / ar
		}
		ctx.drawImage(this.currentImage!.image, 0, 0, w, h)
	}

	drawLoadingText() {

		let ctx = this.canvas.getContext("2d")!
		ctx.font = "2em arials"
		ctx.fillStyle = "red"
		ctx.fillText("Loading image ...", 100, 100)
	}

	updateSize() {

		let bcr = document.body.getBoundingClientRect()
		this.canvas.width = bcr.width
		this.canvas.height = bcr.height
		this.renderImage()
	}
}
