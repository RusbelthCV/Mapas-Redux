import {
    ADD_MARKER,
  } from "../actions/types"
const initialState = {
    marks: []
  }
  
  export default function(state = initialState, action) {
    switch (action.type) {
        case ADD_MARKER:
            return {
                marks: [action.payload, ...state.marks]
            }
        default:
            return state
    }
  }