import { combineReducers } from "redux";
import markerReducer from "./markerReducer";
const allReducers = combineReducers({
    markers: markerReducer,
});

export default allReducers;