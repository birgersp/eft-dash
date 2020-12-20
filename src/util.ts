export function setAttributes(element: HTMLElement, properties: any) {

	for (let key in properties) {
		element.setAttribute(key, properties[key])
	}
}

export function setStyle(element: HTMLElement, properties: any) {

	for (let key in properties) {
		element.style.setProperty(key, properties[key])
	}
}

export function clearDocument() {

	let body = document.body
	let child = body.lastChild
	while (child != null) {
		body.removeChild(child)
		child = body.lastChild
	}
}

export function toCharacter(num: number): string {
	return (10 + num).toString(36)
}

export function ipIsLocalhost(ip: string): boolean {

	return ["localhost", "127.0.0.1"].includes(ip)
}
