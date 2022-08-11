import { createApi } from "unsplash-js";
const DEFAULT_LAT_LONG = "43.653908,-79.384293";
const DEFAULT_LIMIT = 6;
const unsplash = createApi({
	accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

export async function getListOfCoffeeStorePhotos() {
	const unsplashResult = await unsplash.search.getPhotos({
		query: "coffee store",
		page: 1,
		perPage: 30,
	});

	const photos = unsplashResult.response.results.map(result => result.urls["small"]);
	return photos;
}

const getUrlForCoffeStores = (query, limit, latLong) => {
	return `https://api.foursquare.com/v3/places/search?query=${query}&limit=${limit}${latLong ? "&ll=" + latLong : ""}`;
};

export async function fetchCoffeeStores(latLong = DEFAULT_LAT_LONG, limit = DEFAULT_LIMIT,) {
	const photos = await getListOfCoffeeStorePhotos();
	const API_KEY = process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY;
	const options = {
		method: "GET",
		headers: {
			Accept: "application/json",
			Authorization: API_KEY,
		},
	};
	const url = getUrlForCoffeStores("coffee", limit, latLong);
	try {
		const response = await fetch(url, options);
		const data = await response.json();
		const result = data.results.map((item, index) => ({
			id: item.fsq_id,
			name: item.name,
			address: item.location.address || "",
			neighborhood: item.location.neighborhood?.[0] || "",
			imgUrl: photos[index],
			vote: item.vote || 0
		}));
		return result;
	} catch (error) {
		return error;
	}
}
