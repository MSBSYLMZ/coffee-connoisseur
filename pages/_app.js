import { createContext, useReducer } from "react";
import "../styles/globals.css";
import { StoreProvider } from "contexts/store/store.context";



function MyApp({ Component, pageProps }) {
	return (
		<StoreProvider>
			<Component {...pageProps} />;
		</StoreProvider>
	);
}

export default MyApp;
