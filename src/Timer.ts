export class Timer {

	private timeout: number | undefined

	constructor(
		readonly intervalMs: number,
		readonly action: () => void
	) { }

	reset() {
		if (this.timeout != undefined) {
			window.clearTimeout(this.timeout)
		}
		this.timeout = window.setTimeout(this.action, this.intervalMs)
	}
}
