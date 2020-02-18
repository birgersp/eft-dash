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

	constructor() {
		super(ElementType.DIV)
		this.loadSearches()
		this.rePopulate()
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
		let header = this.createChild(ElementType.H4)
		header.setAttributes({ innerHTML: "Search history" })
		for (let i in this.searches) {
			let search = this.searches[i]
			let link = this.createChild(ElementType.LINK)
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
			this.createChild(ElementType.LINE_BREAK)
		}
		if (this.searches.length == 0) {
			let paragraph = this.createChild(ElementType.PARAGRAPH)
			paragraph.setInnerHTML("(Search history is empty)")
		} else {
			let link = this.createChild(ElementType.LINK)
			link.setAttributes({
				"href": "javascript:void(0);",
				"innerHTML": "(Clear search history)"
			})
			link.setStyle({
				"color": "white"
			})
			link.element.addEventListener("click", () => {
				this.clearSearches()
			})
			this.createChild(ElementType.LINE_BREAK)
		}
	}

	private clearSearches() {
		this.searches = []
		this.saveSearches()
		this.rePopulate()
	}
}
