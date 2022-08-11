import { fetchCoffeeStores } from "lib/coffee-stores";
import { failedResponse, successfulResponse } from "utils/http-responses";

export default async function handler(req, res) {
	const { latLong, limit } = req.query;
	try {
		const fetchedCoffeeStores = await fetchCoffeeStores(latLong, limit);
		if (fetchedCoffeeStores) return successfulResponse(res, fetchedCoffeeStores);
		throw Error(`Can't fetch the coffee stores by location`);
	} catch (error) {
		console.log(error);
		return failedResponse(res,error)
	}
}
