import produce from "immer";

const SET_RUN_HISTORY = "history/set_run_history";
const DELETE_RUN = "history/delete_run";
const SET_FETCHED_HISTORY = "history/set_fetched_history";

export const setRunHistory = ([key, value]) => ({
	type: SET_RUN_HISTORY,
	payload: [key, value],
});

export const deleteRun = (payload) => ({
	type: DELETE_RUN,
	payload,
});

export const setFetchedHistory = (payload) => ({
	type: SET_FETCHED_HISTORY,
	payload,
});

const historyState = {
	runs: {},
};

export function historyReducer(state = historyState, action) {
	switch (action.type) {
		case SET_RUN_HISTORY:
			return produce(state, (draft) => {
				draft.runs[action.payload[0]] = action.payload[1];
			});
		case DELETE_RUN:
			return produce(state, (draft) => {
				delete draft.runs[action.payload];
			});
		case SET_FETCHED_HISTORY:
			return produce(state, (draft) => {
				draft.runs = action.payload;
			});
		default:
			return state;
	}
}
