import { combineReducers } from "redux";
import markerReducer from "./markerReducer";
const allReducers = combineReducers({
    marks: markerReducer,
});

export default allReducers;