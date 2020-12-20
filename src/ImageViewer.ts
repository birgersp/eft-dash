import { AppImage } from "./AppImage"

export class ImageViewer {

	canvas: HTMLCanvasElement
	currentImage?: AppImage

	constructor() {

		this.canvas = document.createElement("canvas")
	}

	drawLoadingText() {

		let ctx = this.canvas.getContext("2d")!
		ctx.font = "2em arial"
		ctx.fillStyle = "red"
		ctx.fillText("Loading image ...", 100, 100)
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

		let w: number, h: number, x: number, y: number
		let img = this.currentImage!.image
		let ar = img.width / img.height
		let canvasAr = this.canvas.width / this.canvas.height
		if (canvasAr > ar) {
			h = this.canvas.height
			w = h * ar
			x = (this.canvas.width - w) / 2
			y = 0
		} else {
			w = this.canvas.width
			h = w / ar
			x = 0
			y = (this.canvas.height - h) / 2
		}
		ctx.drawImage(this.currentImage!.image, x, y, w, h)
	}

	updateSize() {

		let bcr = document.body.getBoundingClientRect()
		this.canvas.width = bcr.width
		this.canvas.height = bcr.height
		this.renderImage()
	}
}
