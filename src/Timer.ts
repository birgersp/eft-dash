export class Timer {

	timeoutId?: number

	constructor(
		public timeMs: number,
		public action: () => void
	) {
	}

	reset() {
		if (this.timeoutId != undefined) {
			window.clearTimeout(this.timeoutId)
		}
		this.timeoutId = window.setTimeout(() => { this.action() }, this.timeMs)
	}
}
