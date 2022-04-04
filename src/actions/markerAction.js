import { ADD_MARKER } from "./types"

export const addMarker = mark => {
  return {
    type: ADD_MARKER,
    payload: mark,
  }
}