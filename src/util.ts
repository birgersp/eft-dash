export function setAttributes(element: HTMLElement, properties: any) {

	for (let key in properties) {
		if (key == "innerHTML") {
			element.innerHTML = properties[key]
		} else {
			element.setAttribute(key, properties[key])
		}
	}
}

export function setStyle(element: HTMLElement, properties: any) {

	for (let key in properties) {
		element.style.setProperty(key, properties[key])
	}
}

export function removeChildrenOf(element: HTMLElement) {

	let child = element.lastChild
	while (child != null) {
		element.removeChild(child)
		child = element.lastChild
	}
}

export function clearDocument() {

	removeChildrenOf(document.body)
}

export function toCharacter(num: number): string {
	return (10 + num).toString(36).toUpperCase()
}

export function ipIsLocalhost(ip: string): boolean {

	return ["localhost", "127.0.0.1"].includes(ip)
}

export function drawText(context: CanvasRenderingContext2D, text: string, x: number, y: number) {

	context.fillText(text, x, y)
	context.strokeText(text, x, y)
}
