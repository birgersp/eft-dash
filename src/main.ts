import { App } from "./App"

function main() {

	let app = new App()
	app.initialize()
}

window.addEventListener("load", () => {
	main()
})
