import { createCoffeeStore as createCoffeeStoreAirtable, findCoffeeStoreById } from "lib/airtable";

export default async function createCoffeeStore(req, res) {
	if (req.method !== "POST") return res.status(400).json({ message: "Only POST requests allowed" });
	const { coffeeStore } = req.body;
	if (!coffeeStore.id || !coffeeStore.name) return res.status(400).json({ message: "Missing Credentials" });
	try {
		const findCoffeeStoreRecords = await findCoffeeStoreById(coffeeStore.id);
		if (findCoffeeStoreRecords) {
			return res.status(200).json(findCoffeeStoreRecords);
		} else {
			const createdCoffeeStore = await createCoffeeStoreAirtable(coffeeStore);
			if (!createdCoffeeStore) throw Error(`Can't create the coffee store`);
			return res.status(200).json(createdCoffeeStore);
		}
	} catch (error) {
		console.log("Error finding store", error);
		res.status(500);
		return res.json({ message: "Something went wrong", error });
	}
}
