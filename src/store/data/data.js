import produce from "immer";

const SET_DISTANCE = "data/set_telemetry";
const SET_DURATION = "data/set_running_time";
const SET_START_TIME = "data/set_start_time";
const SET_COORDS = "data/set_coords";
const RESET_DATA_STATE = "data/reset_data_state";

export const setDistance = (payload) => ({
	type: SET_DISTANCE,
	payload,
});

export const resetDataState = (payload) => ({
	type: RESET_DATA_STATE,
	payload,
});

export const setDuration = (payload) => ({
	type: SET_DURATION,
	payload,
});

export const setStartTime = (payload) => ({
	type: SET_START_TIME,
	payload,
});

export const setCoords = (payload) => ({
	type: SET_COORDS,
	payload,
});

const dataState = {
	distance: "0.00",
	duration: 0,
	startTime: 0,
	coords: [],
};

export const dataReducer = (state = dataState, action) => {
	switch (action.type) {
		case SET_DISTANCE:
			return produce(state, (draft) => {
				draft.distance = action.payload;
			});
		case SET_DURATION:
			return produce(state, (draft) => {
				draft.duration = action.payload;
			});
		case SET_START_TIME:
			return produce(state, (draft) => {
				draft.startTime = action.payload;
			});
		case SET_COORDS:
			return produce(state, (draft) => {
				draft.coords.push(action.payload);
			});
		case RESET_DATA_STATE:
			return dataState;
		default:
			return state;
	}
};
