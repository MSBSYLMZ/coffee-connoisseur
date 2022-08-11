import { findCoffeeStoreById, incrementVoting } from "lib/airtable";
import { failedResponse, missingCredentialsResponse, recordDontExistsResponse, successfulResponse, wrongMethodResponse } from "utils/http-responses";

export default async function handler(req, res) {
	if (req.method !== "PUT") return wrongMethodResponse(res, "PUT");
	const { id, vote } = req.body;
	if (!id || !vote) return missingCredentialsResponse(res);

	try {
		const record = await findCoffeeStoreById(id,vote);
		!record && recordDontExistsResponse(res);
		const updatedItem = await incrementVoting(record.recordId, +vote);
		if (!updatedItem) throw Error(`Can't update the record`);
		return successfulResponse(res, updatedItem);
	} catch (error) {
		console.log(error);
		return failedResponse(res, error);
	}
}
