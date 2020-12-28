import { AppImage } from "./AppImage"
import { Container } from "./Container"
import { Elem } from "./Elem"
import { Signal } from "./Signal"
import { common } from "./common"
import { drawText, toCharacter } from "./util"

export class ImageViewer extends Container {

	static readonly GRID_RESOLUTION = 9

	canvas = new Elem("canvas")
	ctx: CanvasRenderingContext2D
	currentImage?: AppImage
	footerDiv = new Elem("div")
	imageDimensions = {
		h: 0,
		w: 0,
		x: 0,
		y: 0
	}
	onImageChanged = new Signal()
	onLoading = new Signal()
	showGrid = true

	constructor() {

		super()
		this.ctx = this.canvas.element.getContext("2d")!
		this.div
			.style({ "position": "absolute" })
			.append(this.canvas)
			.append(this.footerDiv)
		this.footerDiv.style({
			"background": common.BG_COLOR,
			"bottom": "0",
			"position": "absolute",
			"right": "0"
		})
	}

	draw() {

		if (this.currentImage == undefined) {
			return
		}

		this.updateSize()

		this.ctx.font = "bold 2em arial"
		this.ctx.fillStyle = "white"
		this.ctx.strokeStyle = "black"
		this.ctx.lineWidth = 2

		let cw = this.canvas.element.width
		let ch = this.canvas.element.height
		this.ctx.clearRect(0, 0, cw, ch)
		if (!this.currentImage!.loaded) {
			this.onLoading.trigger()
			this.drawLoadingText()
			return
		}

		this.ctx.drawImage(
			this.currentImage!.image,
			this.imageDimensions.x, this.imageDimensions.y,
			this.imageDimensions.w, this.imageDimensions.h
		)

		if (this.showGrid) {
			this.drawGrid()
		}

		let imgOptions = this.currentImage!.options
		this.setText(`"${imgOptions.name}" by ${imgOptions.authorName}`, imgOptions.sourceUrl)
		this.onImageChanged.trigger()
	}

	drawGrid() {

		this.ctx.textBaseline = "top"

		let textHeight = 14
		let imgX = this.imageDimensions.x
		let imgY = this.imageDimensions.y

		let ar = this.imageDimensions.w / this.imageDimensions.h

		let xResolution: number, yResolution: number
		if (ar > 1) {
			xResolution = ImageViewer.GRID_RESOLUTION
			yResolution = xResolution / ar
		} else {
			yResolution = ImageViewer.GRID_RESOLUTION
			xResolution = yResolution * ar
		}

		let cellWidth = this.imageDimensions.w / xResolution
		drawText(this.ctx, "A1", imgX, imgY)
		this.ctx.textAlign = "center"
		for (let i = 1; i < xResolution; i++) {
			let x = imgX + i * cellWidth
			let y = imgY
			this.drawLine(x, y, 0, this.imageDimensions.h)
			drawText(this.ctx, toCharacter(i), x + cellWidth / 2, y)
		}

		this.ctx.textAlign = "left"
		let cellHeight = this.imageDimensions.h / yResolution
		for (let i = 1; i < yResolution; i++) {
			let x = this.imageDimensions.x
			let y = this.imageDimensions.y + i * cellHeight
			this.drawLine(x, y, this.imageDimensions.w, 0)
			drawText(this.ctx, `${i + 1}`, imgX, imgY + cellHeight * (i + 0.5) - textHeight / 2)
		}
	}

	drawLine(x: number, y: number, w: number, h: number) {

		this.ctx.beginPath()
		this.ctx.moveTo(x, y)
		this.ctx.lineTo(x + w, y + h)
		this.ctx.stroke()
	}

	drawLoadingText() {

		drawText(this.ctx, `Loading "${this.currentImage!.options.name}" ...`, 100, 100)
	}

	setText(text: string, link: string) {

		this.footerDiv.removeChildren()
		let aElement = new Elem("a")
		aElement.set({
			"href": link,
			"innerHTML": text
		})
		aElement.style({
			"color": "white"
		})
		let pElement = new Elem("p")
		pElement.style({
			"margin": "0.5em"
		})
		pElement.append(aElement)
		this.footerDiv.append(pElement)
	}

	updateSize() {

		if (this.currentImage == undefined ||
			!this.currentImage!.loaded) {
			return
		}

		let ar = this.currentImage!.ar
		let cw = this.canvas.element.width
		let ch = this.canvas.element.height
		let canvasAr = cw / ch
		if (canvasAr > ar) {
			this.imageDimensions.h = ch
			this.imageDimensions.w = this.imageDimensions.h * ar
			this.imageDimensions.x = (cw - this.imageDimensions.w) / 2
			this.imageDimensions.y = 0
		} else {
			this.imageDimensions.w = cw
			this.imageDimensions.h = this.imageDimensions.w / ar
			this.imageDimensions.x = 0
			this.imageDimensions.y = (ch - this.imageDimensions.h) / 2
		}
	}
}
