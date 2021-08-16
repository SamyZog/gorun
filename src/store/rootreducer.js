import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth";
import { interfaceReducer } from "./interface/interface";

const rootreducer = combineReducers({
	interface: interfaceReducer,
	auth: authReducer,
});

const store = createStore(rootreducer);

export default store;
