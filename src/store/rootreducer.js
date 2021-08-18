import { combineReducers, createStore } from "redux";
import { authReducer } from "./auth/auth";

const rootreducer = combineReducers({
	auth: authReducer,
});

const store = createStore(rootreducer);

export default store;
