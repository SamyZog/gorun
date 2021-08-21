import produce from "immer";

// action types
/* -------------------------------------------------------------------------- */
const SET_DRAWER_STATE = "map/set_drawer_state";
const TOGGLE_TELEMETRY_HEIGHT = "map/toggle_telemetry_height";
const SET_RUN_START = "map/set_run_start";
const SET_PAUSE = "map/set_pause";
const SET_GPS_STATE = "map/set_gps_state";
const SET_GPS_ERROR = "map/set_gps_error";
const SET_COUNTDOWN_PHASE = "map/set_countdown_phase";
const SET_GEO_OBJECT = "map/set_geo_object";
const SET_TELEMETRY = "map/set_telemetry";
const RESET_MAP_STATE = "map/reset_auth";
const SET_SPEED = "map/set_speed";
/* -------------------------------------------------------------------------- */

// actions
/* -------------------------------------------------------------------------- */
export const setDrawerState = (payload) => ({
	type: SET_DRAWER_STATE,
	payload,
});

export const setCountDownPhase = (payload) => ({
	type: SET_COUNTDOWN_PHASE,
	payload,
});

export const setGeoObject = (payload) => ({
	type: SET_GEO_OBJECT,
	payload,
});

export const toggleTelemetryHeight = (payload) => ({
	type: TOGGLE_TELEMETRY_HEIGHT,
	payload,
});

export const setRunStart = (payload) => ({
	type: SET_RUN_START,
	payload,
});

export const setPause = (payload) => ({
	type: SET_PAUSE,
	payload,
});

export const setGpsState = (payload) => ({
	type: SET_GPS_STATE,
	payload,
});

export const setGpsError = (payload) => ({
	type: SET_GPS_ERROR,
	payload,
});

export const setTelemetry = ([key, value]) => ({
	type: SET_TELEMETRY,
	payload: [key, value],
});

export const resetAuthState = () => ({
	type: RESET_MAP_STATE,
});

export const setSpeed = (payload) => ({
	type: SET_SPEED,
	payload,
});
/* -------------------------------------------------------------------------- */

// initial state
/* -------------------------------------------------------------------------- */
const mapState = {
	isDrawerOpen: false,
	isTelemetryOpen: false,
	isRunGoing: null,
	isPaused: null,
	isGps: null,
	isTracking: false,
	isGpsError: false,
	isCountdown: false,
	geoObject: null,
	telemetry: {
		startTime: null,
		endTime: null,
		geoStamps: [],
		speed: 0,
	},
};
/* -------------------------------------------------------------------------- */

// reducer
/* -------------------------------------------------------------------------- */
export function mapReducer(state = mapState, action) {
	switch (action.type) {
		case SET_DRAWER_STATE:
			return produce(state, (draft) => {
				draft.isDrawerOpen = action.payload;
			});
		case TOGGLE_TELEMETRY_HEIGHT:
			return produce(state, (draft) => {
				draft.isTelemetryOpen = !draft.isTelemetryOpen;
			});
		case SET_RUN_START:
			return produce(state, (draft) => {
				draft.isRunGoing = action.payload;
				draft.telemetry.startTime = Date.now();
			});
		case SET_PAUSE:
			return produce(state, (draft) => {
				draft.isPaused = action.payload;
			});
		case SET_GPS_STATE:
			return produce(state, (draft) => {
				draft.isGps = action.payload;
			});
		case SET_GPS_ERROR:
			return produce(state, (draft) => {
				draft.isGpsError = action.payload;
			});
		case SET_COUNTDOWN_PHASE:
			return produce(state, (draft) => {
				draft.isCountdown = action.payload;
			});
		case SET_GEO_OBJECT:
			return produce(state, (draft) => {
				draft.geoObject = action.payload;
			});
		case SET_TELEMETRY:
			return produce(state, (draft) => {
				if (action.payload[0] === "geoStamps") {
					draft.telemetry[action.payload[0]].push(action.payload[1]);
					return;
				}
				draft.telemetry[action.payload[0]] = action.payload[1];
			});
		case SET_SPEED:
			return produce(state, (draft) => {
				draft.telemetry.speed = action.payload;
			});
		case RESET_MAP_STATE:
			return mapState;
		default:
			return state;
	}
}
/* -------------------------------------------------------------------------- */
