import { App } from "./App"
import { clearDocument } from "./util"



function main() {

	let app = new App()
	app.initialize()
}

window.addEventListener("load", () => {
	main()
})
