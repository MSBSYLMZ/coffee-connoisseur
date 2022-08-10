import Card from "../components/card/card";

import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner/banner";
import styles from "@styles/Home.module.css";
import { fetchCoffeeStores } from "lib/coffee-stores";
import useTrackLocation from "hooks/use-track-location";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "contexts/store/store.context";
import { setCoffeeStores } from "contexts/store/store.actions";
import { selectCoffeeStores } from "contexts/store/store.selectors";

export async function getStaticProps(context) {
	const coffeeStores = await fetchCoffeeStores();
	return {
		props: {
			coffeeStores,
		},
	};
}

export default function Home(props) {
	const { dispatch, state } = useContext(StoreContext);
	const coffeeStores = selectCoffeeStores(state);
	const [title, setTitle] = useState("Toronto Coffee Stores");
	const [coffeeSotoresError, setCoffeeStoresError] = useState(null);
	const { handleTrackLocation, latLong, locationErrorMsg, isFindingLocation } = useTrackLocation();

	const handleBannerButtonClick = () => {
		handleTrackLocation();
	};

	const handleLatLongChange = async () => {
		const response = await fetch(`/api/get-coffee-stores-by-location?latLong=${latLong}&limit=30`);
		const data = await response.json();
		// const data = await fetchCoffeeStores(latLong, 30);
		if (data && data.length > 0) {
			dispatch(setCoffeeStores(data));
			setTitle("Coffee Stores Near Me");
		} else if (data.error) {
			setCoffeeStoresError(data.error.message);
		}
	};

	useEffect(() => {
		if (latLong) handleLatLongChange(latLong);
	}, [latLong]);

	useEffect(() => {
		if (!coffeeStores || coffeeStores.length < 1) dispatch(setCoffeeStores(props.coffeeStores));
	}, []);

	return (
		<div className={styles.container}>
			<Head>
				<title>Home | Coffee Connoisseur</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className={styles.main}>
				<h1 className={styles.title}>Coffee Connoisseur</h1>
				<Banner buttonText={isFindingLocation ? "Locating..." : "View stores nearby"} handleButtonClick={handleBannerButtonClick} />
				{locationErrorMsg && <p>{`Something went wrong:${locationErrorMsg}`}</p>}
				{coffeeSotoresError && <p>{`Can't fetch the coffee stores:${coffeeSotoresError}`}</p>}
				<div className={styles.heroImage}>
					<Image src="/static/hero-image.png" width={700} height={400} alt="hero" />
				</div>
				{coffeeStores.length > 0 && (
					<div className={styles.sectionWrapper}>
						<h2 className={styles.heading2}>{title}</h2>
						<div className={styles.cardLayout}>
							{coffeeStores.map(coffeeStore => (
								<Card
									key={coffeeStore.id}
									name={coffeeStore.name}
									imgUrl={
										coffeeStore.imgUrl ||
										"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
									}
									href={`/coffee-store/${coffeeStore.id}`}
									className={styles.card}
								/>
							))}
						</div>
					</div>
				)}
			</main>
		</div>
	);
}
