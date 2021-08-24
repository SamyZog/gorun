import produce from "immer";

const SET_DRAWER_STATE = "map/set_drawer_state";
const SET_ALERT_STATE = "map/set_alert_state";
const SET_GPS = "map/set_gps";
const SET_MAP = "map/set_map";
const SET_GEOLOCATE = "map/set_geolocate";
const SET_RUN_STATE = "map/set_run_start";
const SET_PAUSE = "map/set_pause";
const RESET_MAP_STATE = "map/reset_map_state";
const SET_TELEMETRY_STATE = "map/set_telemetry_state";

export const setMapDrawer = (payload) => ({
	type: SET_DRAWER_STATE,
	payload,
});

export const setTelemetryState = (payload) => ({
	type: SET_TELEMETRY_STATE,
	payload,
});

export const setAlertState = (payload) => ({
	type: SET_ALERT_STATE,
	payload,
});

export const setRunState = (payload) => ({
	type: SET_RUN_STATE,
	payload,
});

export const setPause = (payload) => ({
	type: SET_PAUSE,
	payload,
});

export const setGps = (payload) => ({
	type: SET_GPS,
	payload,
});

export const setMap = (payload) => ({
	type: SET_MAP,
	payload,
});

export const setGeolocate = (payload) => ({
	type: SET_GEOLOCATE,
	payload,
});

export const resetMapState = (payload) => ({
	type: RESET_MAP_STATE,
	payload,
});

const mapState = {
	isDrawerOpen: false,
	isTelemtryOpen: false,
	isAlertOpen: false,
	isGps: false,
	map: null,
	geolocate: null,
	isRunInProgress: false,
	isPaused: false,
};

export function mapReducer(state = mapState, action) {
	switch (action.type) {
		case SET_DRAWER_STATE:
			return produce(state, (draft) => {
				draft.isDrawerOpen = action.payload;
			});
		case SET_TELEMETRY_STATE:
			return produce(state, (draft) => {
				draft.isTelemtryOpen = action.payload;
			});
		case SET_GPS:
			return produce(state, (draft) => {
				draft.isGps = action.payload;
			});
		case SET_MAP:
			return produce(state, (draft) => {
				draft.map = action.payload;
			});
		case SET_GEOLOCATE:
			return produce(state, (draft) => {
				draft.geolocate = action.payload;
			});
		case SET_RUN_STATE:
			return produce(state, (draft) => {
				draft.isRunInProgress = action.payload;
			});
		case SET_PAUSE:
			return produce(state, (draft) => {
				draft.isPaused = action.payload;
			});
		case SET_ALERT_STATE:
			return produce(state, (draft) => {
				draft.isAlertOpen = action.payload;
			});
		case RESET_MAP_STATE:
			return mapState;
		default:
			return state;
	}
}
/* -------------------------------------------------------------------------- */
