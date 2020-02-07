import { GET_ITEMS, EDIT_ITEM, GET_ITEM, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING } from "./types";
import axios from "axios";

// Get Items:
export const getItems = () => dispatch => {
    dispatch(setItemsLoading());
    axios
      .get("/api/items")
      .then(res => dispatch({
        type: GET_ITEMS,
        payload: res.data
      }))
};

// Get One Item:
export const getItem = (id) => dispatch => {
  dispatch(setItemsLoading());
  axios
    .get(`/api/items/${id}`)
    .then(res => dispatch({
      type: GET_ITEM,
      payload: res.data
    }))
};

// Add Item:
export const addItem = (item) => dispatch =>{
  axios.post("/api/items", item)
  .then(res => dispatch({
    type: ADD_ITEM,
    payload: res.data
  }))

};

// EDIT Item:
export const editItem = (id) => dispatch =>{
  axios.put(`/api/items/${id}`)
  .then(res => dispatch({
    type: EDIT_ITEM,
    payload: res.data
  }))

};

// Delete Item:
export const deleteItem = (id) => dispatch => {
    axios.delete(`/api/items/${id}`)
    .then(res=> dispatch({
      type: DELETE_ITEM,
      payload: id
    }))
};

// Loading Animation:
export const setItemsLoading = () => {
    return {
        type: ITEMS_LOADING
    };
};