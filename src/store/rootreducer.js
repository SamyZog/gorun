import { combineReducers, createStore } from "redux";
import interfaceStore from "./interface/reducer";

const rootreducer = combineReducers({ interfaceStore });

const store = createStore(rootreducer);

export default store;
