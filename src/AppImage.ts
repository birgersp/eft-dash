import { ImageOption_temp } from "./imageOptions"

export class AppImage {

	image = new Image()
	loaded = false

	constructor(
		public options: ImageOption_temp,
		public onLoaded: () => void
	) {
		this.image.addEventListener("load", () => {
			this.loaded = true
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
