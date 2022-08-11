import { createCoffeeStore as createCoffeeStoreAirtable, findCoffeeStoreById } from "lib/airtable";
import { failedResponse, missingCredentialsResponse, successfulResponse, wrongMethodResponse } from "utils/http-responses";

export default async function createCoffeeStore(req, res) {
	if (req.method !== "POST") return wrongMethodResponse(res, "POST");
	const { coffeeStore } = req.body;
	if (!coffeeStore.id || !coffeeStore.name) return missingCredentialsResponse(res);
	try {
		const findCoffeeStoreRecords = await findCoffeeStoreById(coffeeStore.id);
		if (findCoffeeStoreRecords) {
			return successfulResponse(res, findCoffeeStoreById);
		} else {
			const createdCoffeeStore = await createCoffeeStoreAirtable(coffeeStore);
			if (!createdCoffeeStore) throw Error(`Can't create the coffee store`);
			return successfulResponse(res, createdCoffeeStore);
		}
	} catch (error) {
		return failedResponse(res, error);
	}
}
