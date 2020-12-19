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
		if (!this.currentImage!.loaded) {
			ctx.fillText("Loading ...", 10, 10)
			return
		}

		ctx.drawImage(this.currentImage!.image, 0, 0)
	}

	updateSize() {

		let bcr = document.body.getBoundingClientRect()
		this.canvas.width = bcr.width
		this.canvas.height = bcr.height
		this.renderImage()
	}
}
