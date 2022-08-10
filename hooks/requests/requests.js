export async function createCoffeeStore(data) {
	const body = JSON.stringify({ coffeeStore: data });
	const options = {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body,
	};
	try {
		const response = await fetch(`/api/create-coffee-store`, options);
		if (!response.ok) throw Error("Could not create the coffee store");
		const result = await response.json();
		return result;
	} catch (error) {
		return null;
	}
}

export async function favoriteCoffeeStore(id) {
	const body = JSON.stringify({ id });
    const options = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
		},
		body,
	};
	try {
		const response = await fetch(`/api/favorite-coffee-store-by-id`, options);
		if (!response.ok) throw Error("Could not favorite the coffee store");
		const result = await response.json();
        console.log(result);
		return result;
	} catch (error) {
		return null;
	}
}
