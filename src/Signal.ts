export class Signal {

	listeners: (() => void)[] = []
	trigger() {
		for (let listener of this.listeners) {
			listener()
		}
	}
}
