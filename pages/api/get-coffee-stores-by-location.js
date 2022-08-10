import { fetchCoffeeStores } from "lib/coffee-stores";

export default async function handler(req, res) {
	const { latLong, limit } = req.query;
	try {
		const fetchedCoffeeStores = await fetchCoffeeStores(latLong, limit);
		if (fetchCoffeeStores) return res.status(200).json(fetchedCoffeeStores);
		throw Error(`Can't fetch the coffee stores by location`);
	} catch (error) {
		return res.status(500).json(error);
	}
}
