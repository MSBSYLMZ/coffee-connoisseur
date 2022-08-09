import { useRouter } from "next/router";
import Image from "next/image";
import Head from "next/head";
import Link from "next/link";
import styles from "@styles/coffee-store.module.css";
import cls from "classnames";
import { fetchCoffeeStores } from "lib/coffee-stores";
import { selectCoffeeStores } from "contexts/store/store.selectors";
import { useContext, useEffect, useState } from "react";
import { StoreContext } from "contexts/store/store.context";
import { isEmpty } from "utils";
import { createCoffeeStore as createCS } from "hooks/requests/requests";

export async function getStaticProps(staticProps) {
	const { params } = staticProps;
	const coffeeStores = await fetchCoffeeStores();
	const findCoffeeStore = coffeeStores.find(coffeeStore => coffeeStore.id.toString() === params.id) ?? {};
	return {
		props: {
			coffeeStore: findCoffeeStore,
		},
	};
}

export async function getStaticPaths() {
	const coffeeStores = await fetchCoffeeStores();
	const paths = coffeeStores.map(coffeeStore => {
		return {
			params: {
				id: coffeeStore.id.toString(),
			},
		};
	});
	return {
		paths,
		fallback: true,
	};
}

const CoffeeStore = props => {
	const { state } = useContext(StoreContext);
	const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore || {});

	const router = useRouter();
	const id = router.query.id;
	const coffeeStores = selectCoffeeStores(state);

	const handleUpvoteButton = () => {};

	const handleCreateCoffeeStore = async coffeeStore => {
		const coffeeStoreDataForCreation = { ...coffeeStore, vote: 0 };
		const response = await createCS(coffeeStoreDataForCreation);
		if (!response) {
			console.log("Could not create the coffee store");
		} else {
			setCoffeeStore({ ...coffeeStore, vote: response.vote });
		}
	};

	const { address, neighborhood, name, vote, imgUrl } = coffeeStore ?? {};

	useEffect(() => {
		if (isEmpty(coffeeStore)) {
			const cs = coffeeStores.find(store => store.id === id);
			if (cs) handleCreateCoffeeStore(cs);
		} else {
			handleCreateCoffeeStore(coffeeStore);
		}
	}, []);

	if (router.isFallback) return <div>Loading</div>;
	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
			</Head>
			<div className={styles.container}>
				<div className={styles.col1}>
					<div className={styles.backToHomeLink}>
						<Link href="/">
							<a>← Back To Homepage</a>
						</Link>
					</div>
					<div className={styles.nameWrapper}>
						<h1 className={styles.name}>{name}</h1>
					</div>
					<Image
						src={
							imgUrl ||
							"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
						}
						width={600}
						height={360}
						className={styles.storeImg}
						alt={name}
					/>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/places.svg" width={24} height={24} />
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/nearMe.svg" width={24} height={24} />
							<p className={styles.text}>{neighborhood || ""}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image src="/static/icons/star.svg" width={24} height={24} />
						<p className={styles.text}>{vote || 0}</p>
					</div>
					<button className={styles.upvoteButton} onClick={handleUpvoteButton}>
						Up Vote!
					</button>
				</div>
			</div>
		</div>
	);
};

export default CoffeeStore;
