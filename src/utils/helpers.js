import { setGpsError, setGpsState } from "../store/map/map";
import store from "../store/rootreducer";

export function displayToast(toast, id, type, description, onCloseComplete = null) {
	if (!toast.isActive(id)) {
		toast({
			id,
			position: "top",
			status: type,
			description,
			duration: 4000,
			isClosable: true,
			onCloseComplete,
		});
	}
}

export async function checkGpsPermission(toast) {
	const { state } = await navigator.permissions.query({ name: "geolocation" });
	switch (state) {
		case "denied":
			displayToast(toast, 1, "error", "GPS blocked, please enable GPS in browser settings!");
			store.dispatch(setGpsState(false));
			store.dispatch(setGpsError(true));
			break;
		case "granted":
			store.dispatch(setGpsState(true));
			store.dispatch(setGpsError(false));
			toast(toast, 2, "success", "GPS connection re-established, please press play to continue your run!");
			break;
		case "prompt":
			store.dispatch(setGpsState(false));
			displayToast(toast, 3, "warning", "To resume your run please enable GPS in browser settings!");
			navigator.geolocation.getCurrentPosition(
				() => {
					store.dispatch(setGpsState(true));
					store.dispatch(setGpsError(true));
				},
				() => store.dispatch(setGpsState(false)),
			);
			break;
	}
}
