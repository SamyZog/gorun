import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth/auth";
import { dataReducer } from "./data/data";
import { historyReducer } from "./history/history";
import { mapReducer } from "./map/map";

const rootreducer = combineReducers({
	auth: authReducer,
	data: dataReducer,
	map: mapReducer,
	history: historyReducer,
});

const store = createStore(rootreducer);

export default store;
