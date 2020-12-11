export function setAttributes(element: HTMLElement, properties: any) {
	for (let key in properties) {
		element.setAttribute(key, properties[key])
	}
}
