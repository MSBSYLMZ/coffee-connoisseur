const { ACTION_TYPES } = require("./store.context");

export const setCoffeeStores = coffeeStores => ({
	type: ACTION_TYPES.SET_COFFEE_STORES,
	payload: coffeeStores,
});

export const setLatLong = latLong => ({
	type: ACTION_TYPES.SET_LAT_LONG,
	payload: latLong,
});
