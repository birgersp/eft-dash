import { ImageDataObj } from "./images"

export class AppImage {

	ar = 1
	image = new Image()
	loaded = false

	constructor(
		public options: ImageDataObj,
		public onLoaded: () => void
	) {
		this.image.addEventListener("load", () => {
			this.loaded = true
			this.ar = this.image.width / this.image.height
			onLoaded()
		})
	}

	load() {
		if (this.image.src != "") {
			return
		}
		this.image.src = this.options.image
	}
}
