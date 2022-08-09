const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

const getMinifiedRecords = records => {
	return records.map(record => record.fields);
};

async function createCoffeeStore(coffeeStore) {
	console.log(coffeeStore)
	const createRecord = await table.create([
		{
			fields: coffeeStore,
		},
	]);
    if(!createRecord || createRecord.length === 0) return null;
	const minifiedCoffeeStore = getMinifiedRecords(createRecord);
	return minifiedCoffeeStore;
}

async function findCoffeeStoreById(id) {
	const result = await table
		.select({
			filterByFormula: `id="${id}"`,
		})
		.firstPage();
        if(!result || result.length === 0) return null;
        const minified = getMinifiedRecords(result);
        return minified;
}

export {
    createCoffeeStore,
    findCoffeeStoreById
};
