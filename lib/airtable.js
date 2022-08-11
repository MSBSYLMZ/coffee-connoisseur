const Airtable = require("airtable");
const base = new Airtable({ apiKey: process.env.AIRTABLE_API_KEY }).base(process.env.AIRTABLE_BASE_KEY);

const table = base("coffee-stores");

const getMinifiedRecords = records => {
	return records.map(record => ({recordId: record.id, ...record.fields}));
};

async function createCoffeeStore(coffeeStore) {
	const createRecord = await table.create([
		{
			fields: coffeeStore,
		},
	]);
    if(!createRecord || createRecord.length === 0) return null;
	const minifiedCoffeeStore = getMinifiedRecords(createRecord);
	return minifiedCoffeeStore[0];
}

async function findCoffeeStoreById(id) {
	const result = await table
		.select({
			filterByFormula: `id="${id}"`,
		})
		.firstPage();
        if(!result || result.length === 0) return null;
        const minified = getMinifiedRecords(result);
        return minified[0];
}

async function incrementVoting(id, vote){
	const updateData = [
		{
			id,
			fields: {
				vote
			}
		}
	];
	const result = await table.update(updateData);
	if(!result || result.length === 0) return null;
	const minified = getMinifiedRecords(result);
	return minified[0];
}

export {
    createCoffeeStore,
    findCoffeeStoreById,
	incrementVoting
};
