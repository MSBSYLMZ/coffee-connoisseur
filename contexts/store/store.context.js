import { createContext, useReducer } from "react";

export const StoreContext = createContext();

export const ACTION_TYPES = {
	SET_LAT_LONG: "SET_LAT_LONG",
	SET_COFFEE_STORES: "SET_COFFEE_STORES",
};

const storeReducer = (state, action) => {
	switch (action.type) {
		case ACTION_TYPES.SET_LAT_LONG:
			return { ...state, latLong: action.payload };
		case ACTION_TYPES.SET_COFFEE_STORES:
			return { ...state, coffeeStores: action.payload };
		default:
			return state;
	}
};

export const StoreProvider = ({ children }) => {
	const INITIAL_STATE = {
		latLong: "",
		coffeeStores: [],
	};
	const [state, dispatch] = useReducer(storeReducer, INITIAL_STATE);
	return <StoreContext.Provider value={{ state, dispatch }}>{children}</StoreContext.Provider>;
};
