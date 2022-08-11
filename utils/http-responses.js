export const missingCredentialsResponse = (res, message = null, statusCode = null) =>
	res.status(statusCode ?? 400).json({ message: message ?? "Missing Credentials" });

export const wrongMethodResponse = (res, method, message = null, statusCode = null) =>
	res.status(statusCode ?? 400).json({ message: message ?? `Only ${method} requests allowed` });

export const recordDontExistsResponse = (res, message = null, statusCode = null) =>
	res.status(statusCode ?? 404).json({ message: message ?? `There is no item` });

export const successfulResponse = (res, data = null, statusCode = null) => {
	res.status(statusCode ?? 200);
	if (data) res.json(data);
	return res;
};

export const failedResponse = (res, error, statusCode = null) => {
	res.status(statusCode ?? 500);
	if (error) return res.json(error);
};
