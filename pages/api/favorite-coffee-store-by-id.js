import { findCoffeeStoreById, incrementVoting } from "lib/airtable";
import { failedResponse, missingCredentialsResponse, recordDontExistsResponse, successfulResponse, wrongMethodResponse } from "utils/http-responses";

export default async function handler(req, res) {
	if (req.method !== "PUT") return wrongMethodResponse(res, "PUT");
	const { id } = req.body;
	if (!id) return missingCredentialsResponse(res);

	try {
		const record = await findCoffeeStoreById(id);
		!record && recordDontExistsResponse(res);
		const updatedItem = await incrementVoting(record.recordId, +record.vote);
		if (!updatedItem) throw Error(`Can't update the record`);
		return successfulResponse(res, {...record, vote: +record.vote + 1});
	} catch (error) {
		console.log(error);
		return failedResponse(res, error);
	}
}
