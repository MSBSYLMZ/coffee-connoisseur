import { findCoffeeStoreById } from "lib/airtable";
import { failedResponse, missingCredentialsResponse, recordDontExistsResponse, successfulResponse } from "utils/http-responses";

export default async function handler(req, res) {
    const { id } = req.query;
	if (!id) return missingCredentialsResponse(res);
	try {
		const coffeeStore = await findCoffeeStoreById(id);
		if (!coffeeStore) return recordDontExistsResponse(res)
        return successfulResponse(res, coffeeStore)
	} catch (error) {
		console.log(error);
		return failedResponse(res,error);
	}
}
