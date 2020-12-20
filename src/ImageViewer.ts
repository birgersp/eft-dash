import { AppImage } from "./AppImage"
import { AppState } from "./AppState"
import { toCharacter } from "./util"

export class ImageViewer {

	canvas: HTMLCanvasElement
	ctx: CanvasRenderingContext2D
	currentImage?: AppImage
	imageDimensions = {
		h: 0,
		w: 0,
		x: 0,
		y: 0
	}
	showGrid = false

	constructor() {

		this.canvas = document.createElement("canvas")
		this.ctx = this.canvas.getContext("2d")!
	}

	draw() {

		if (this.currentImage == undefined) {
			return
		}

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		if (!this.currentImage!.loaded) {
			this.drawLoadingText()
			return
		}

		let img = this.currentImage!.image
		let ar = img.width / img.height
		let canvasAr = this.canvas.width / this.canvas.height
		if (canvasAr > ar) {
			this.imageDimensions.h = this.canvas.height
			this.imageDimensions.w = this.imageDimensions.h * ar
			this.imageDimensions.x = (this.canvas.width - this.imageDimensions.w) / 2
			this.imageDimensions.y = 0
		} else {
			this.imageDimensions.w = this.canvas.width
			this.imageDimensions.h = this.imageDimensions.w / ar
			this.imageDimensions.x = 0
			this.imageDimensions.y = (this.canvas.height - this.imageDimensions.h) / 2
		}
		this.ctx.drawImage(
			this.currentImage!.image,
			this.imageDimensions.x, this.imageDimensions.y,
			this.imageDimensions.w, this.imageDimensions.h
		)

		if (this.showGrid) {
			this.drawGrid()
		}
	}

	drawGrid() {

		this.ctx.font = "1em arial"
		this.ctx.fillStyle = "black"
		this.ctx.textBaseline = "top"
		let textHeight = 14
		let imgX = this.imageDimensions.x
		let imgY = this.imageDimensions.y

		let ar = this.imageDimensions.w / this.imageDimensions.h

		let xResolution: number, yResolution: number
		if (ar > 1) {
			xResolution = 8
			yResolution = xResolution / ar
		} else {
			yResolution = 8
			xResolution = yResolution * ar
		}

		this.ctx.strokeStyle = "white"

		let cellWidth = this.imageDimensions.w / xResolution
		this.ctx.fillText("A1", imgX, imgY)
		this.ctx.textAlign = "center"
		for (let i = 1; i < xResolution; i++) {
			let x = imgX + i * cellWidth
			let y = imgY
			this.drawLine(x, y, 0, this.imageDimensions.h)
			this.ctx.fillText(toCharacter(i), x + cellWidth / 2, y)
		}

		this.ctx.textAlign = "left"
		let cellHeight = this.imageDimensions.h / yResolution
		for (let i = 1; i < yResolution; i++) {
			let x = this.imageDimensions.x
			let y = this.imageDimensions.y + i * cellHeight
			this.drawLine(x, y, this.imageDimensions.w, 0)
			this.ctx.fillText(`${i + 1}`, imgX, imgY + cellHeight * (i + 0.5) - textHeight / 2)
		}
	}

	drawLine(x: number, y: number, w: number, h: number) {

		this.ctx.beginPath()
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x + w, y + h)
		this.ctx.stroke()
	}

	drawLoadingText() {

		this.ctx.font = "2em arial"
		this.ctx.fillStyle = "white"
		this.ctx.fillText(`Loading "${this.currentImage!.options.name}" ...`, 100, 100)
	}

	initialize() {

		document.body.appendChild(this.canvas)
		this.updateSize()
	}

	updateSize() {

		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.draw()
	}
}
