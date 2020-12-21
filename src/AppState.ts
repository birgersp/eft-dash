import { Search } from "./SearchHistory"

export type AppState = {
	currentImageName: string,
	gridEnabled: boolean,
	searches: Search[],
}
