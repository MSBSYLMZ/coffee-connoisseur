export async function createCoffeeStore(data) {
	const body = JSON.stringify({ coffeeStore: data });
	const options = {
		method: "POST",
        headers: {
            'Content-Type' : 'application/json',
        },
        body,
	};
    try {
        const response = await fetch(`/api/create-coffee-store`, options);
        if(!response.ok) throw Error('Could not create the coffee store'); 
        const result = await response.json();
        return result[0];

    } catch (error) {
        return null;
    }
}


