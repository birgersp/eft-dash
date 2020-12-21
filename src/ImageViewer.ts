import { AppImage } from "./AppImage"
import { Container } from "./Container"
import { drawText, removeChildrenOf, setAttributes, setStyle, toCharacter } from "./util"

export class ImageViewer extends Container {

	static readonly GRID_RESOLUTION = 9

	canvas = document.createElement("canvas")
	ctx: CanvasRenderingContext2D
	currentImage?: AppImage
	footerDiv = document.createElement("div")
	imageDimensions = {
		h: 0,
		w: 0,
		x: 0,
		y: 0
	}
	showGrid = false

	constructor() {

		super()
		this.ctx = this.canvas.getContext("2d")!
		this.div.appendChild(this.canvas)
		this.div.appendChild(this.footerDiv)
		this.updateSize()
		setStyle(this.footerDiv, {
			"background": "black",
			"bottom": "0",
			"position": "absolute"
		})
	}

	draw() {

		if (this.currentImage == undefined) {
			return
		}

		this.ctx.font = "bold 2em arial"
		this.ctx.fillStyle = "white"
		this.ctx.strokeStyle = "black"
		this.ctx.lineWidth = 2

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

		this.setText(this.currentImage!.options.authorName, this.currentImage!.options.sourceUrl)
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

		removeChildrenOf(this.footerDiv)
		let aElement = document.createElement("a")
		setAttributes(aElement, {
			"href": link,
			"innerHTML": text
		})
		setStyle(aElement, {
			"color": "white"
		})
		let pElement = document.createElement("p")
		setStyle(pElement, {
			"margin": "0.5em"
		})
		pElement.appendChild(aElement)
		this.footerDiv.appendChild(pElement)
	}

	updateSize() {

		this.canvas.width = window.innerWidth
		this.canvas.height = window.innerHeight
		this.draw()
	}
}
