export class Timer {

	timeoutId?: number

	constructor(
		public timeMs: number,
		public action: () => void
	) {
	}

	clear() {
		if (this.timeoutId != undefined) {
			window.clearTimeout(this.timeoutId)
		}
	}

	reset() {
		this.clear()
		this.timeoutId = window.setTimeout(() => {
			this.timeoutId = undefined
			this.action()
		}, this.timeMs)
	}
}
