import { UIElement, ElementType } from "./UIElement"

class Search {

	readonly label: string
	readonly url: string

	constructor(label: string, url: string) {
		this.label = label
		this.url = url
	}
}

export class SearchHistory extends UIElement {

	private searches: Search[] = []
	private static readonly LOCAL_STORAGE_KEY = "eft-dash-searches"

	constructor(parent?: UIElement) {
		super(ElementType.DIV, parent)
		this.loadSearches()
	}

	addSearchAndSave(label: string, url: string) {
		this.addSearch(new Search(label, url))
		this.saveSearches()
	}

	private addSearch(search: Search) {
		this.searches.unshift(search)
		this.rePopulate()
	}

	private saveSearches() {
		let data = JSON.stringify({
			searches: this.searches
		})
		localStorage.setItem(SearchHistory.LOCAL_STORAGE_KEY, data)
	}

	private loadSearches() {
		let localData = localStorage.getItem(SearchHistory.LOCAL_STORAGE_KEY)
		if (localData == null) {
			return
		}
		let localDataObject = JSON.parse(localData)
		let searches = localDataObject["searches"]
		for (let i in searches) {
			let searchData = searches[i]
			let label = searchData["label"]
			let url = searchData["url"]
			this.addSearch(new Search(label, url))
		}
	}

	private rePopulate() {
		this.removeChildren()
		for (let i in this.searches) {
			let search = this.searches[i]
			let link = new UIElement(ElementType.LINK, this)
			link.setAttributes({
				"href": "javascript:void(0);",
				"innerHTML": search.label
			})
			link.setStyle({
				"color": "white"
			})
			link.element.addEventListener("click", () => {
				window.open(search.url)
			})
			new UIElement(ElementType.LINE_BREAK, this)
		}
	}
}
