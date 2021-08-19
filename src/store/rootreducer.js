import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth/auth";
import { mapReducer } from "./map/map";

const rootreducer = combineReducers({
	auth: authReducer,
	map: mapReducer,
});

const store = createStore(rootreducer);

export default store;
