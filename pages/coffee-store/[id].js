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
import { createCoffeeStore as createCS, favoriteCoffeeStore } from "hooks/requests/requests";
import useSWR from "swr";

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
	const [votingCount, setVotingCount] = useState(coffeeStore.vote ?? 0);
	const [timeoutsForRequest, setTimeoutsForRequest] = useState();
	const router = useRouter();
	const id = router.query.id;
	const coffeeStores = selectCoffeeStores(state);

	const handleUpvoteButton = async () => {
		setVotingCount(preCount => preCount + 1);
	};
	const handleCreateCoffeeStore = async coffeeStore => {
		const coffeeStoreDataForCreation = { ...coffeeStore, vote: 0 };
		const response = await createCS(coffeeStoreDataForCreation);
		if (response) setCoffeeStore(coffeeStore);
	};

	const { address, neighborhood, name, imgUrl } = coffeeStore ?? {};
	const { data: swrData, error: swrError } = useSWR(`/api/get-coffee-store-by-id?id=${id}`, url => fetch(url).then(res => res.json()));

	useEffect(() => {
		if (isEmpty(coffeeStore)) {
			const cs = coffeeStores.find(store => store.id === id);
			if (cs) {
				setCoffeeStore(cs);
				handleCreateCoffeeStore(cs);
			}
		} else {
			handleCreateCoffeeStore(coffeeStore);
		}
	}, []);

	useEffect(() => {
		if (swrData && !isEmpty(swrData) && !("message" in swrData)) {
			setCoffeeStore(swrData);
			setVotingCount(swrData.vote);
		}
	}, [swrData]);

	useEffect(() => {
		if (coffeeStore.vote) setVotingCount(coffeeStore.vote);
	}, [coffeeStore.vote]);

	useEffect(() => {
		if (!isNaN(coffeeStore.vote) && !isEmpty(coffeeStore) && votingCount !== coffeeStore.vote) {
			const timeout = setTimeout(async () => {
				await favoriteCoffeeStore(id, votingCount);
			}, 500);
			if (timeoutsForRequest) clearTimeout(timeoutsForRequest);
			setTimeoutsForRequest(preTimeout => timeout);
		}
	}, [votingCount]);

	if (router.isFallback) return <div>Loading</div>;
	if (swrError) return <div>Something went wrong</div>;
	return (
		<div className={styles.layout}>
			<Head>
				<title>{name}</title>
				<meta name="description" content={`${name} coffee store details.`}></meta>
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
					<div className={styles.storeImgWrapper}>
						<Image
							src={
								imgUrl ||
								"https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
							}
							width={600}
							height={360}
							className={styles.storeImg}
							layout="responsive"
							alt="banner"
							quality={100}
						/>
					</div>
				</div>
				<div className={cls("glass", styles.col2)}>
					{address && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/places.svg" width={24} height={24} alt="address icon" />
							<p className={styles.text}>{address}</p>
						</div>
					)}
					{neighborhood && (
						<div className={styles.iconWrapper}>
							<Image src="/static/icons/nearMe.svg" width={24} height={24} alt="neighborhood-icon" />
							<p className={styles.text}>{neighborhood || ""}</p>
						</div>
					)}
					<div className={styles.iconWrapper}>
						<Image src="/static/icons/star.svg" width={24} height={24} alt="start-icon" />
						<p className={styles.text}>{votingCount || 0}</p>
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
