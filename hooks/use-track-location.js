import { useContext, useState } from "react";
import { StoreContext } from "contexts/store/store.context";
import { setLatLong } from "contexts/store/store.actions";
import { selectLatLong } from "contexts/store/store.selectors";

function useTrackLocation() {
	const {dispatch, state} = useContext(StoreContext)
	const [locationErrorMsg, setLocationErrorMsg] = useState(null);
	const latLong = selectLatLong(state);
    const [isFindingLocation, setIsFindingLocation] = useState(false); 
	function success(position) {
		const latitude = position.coords.latitude;
		const longitude = position.coords.longitude;
		dispatch(setLatLong(`${latitude},${longitude}`))
		setLocationErrorMsg("");
        setIsFindingLocation(false);
	}

	function error() {
		setLocationErrorMsg("Unable to retrive your location");
        setIsFindingLocation(false);
	}

	function handleTrackLocation() {
        setIsFindingLocation(true);
		if (!navigator.geolocation) {
            setIsFindingLocation(false)
		} else {
			navigator.geolocation.getCurrentPosition(success, error);
		}
	}
	return {
		latLong,
		handleTrackLocation,
		locationErrorMsg,
        isFindingLocation
	};
}

export default useTrackLocation;
