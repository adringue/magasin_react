import { GET_ITEMS, ADD_ITEM, DELETE_ITEM, ITEMS_LOADING, EDIT_ITEM, GET_ITEM } from "../actions/types";

const initialState = {
    items: [],
    item: null,
    loading: false
}

export default function(state = initialState, action) {
    switch(action.type) {
        case GET_ITEMS:
            return {
                ...state,
                items: action.payload,
                loading: false
            }

        case GET_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload),
                // items: action.payload,
                loading: false
            }
            
        case DELETE_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id !== action.payload)
            }

        case ADD_ITEM:
            return {
                ...state,
                // Items equals [the action payload(new item that comes in) and then add spread operator state.items and will add to the items (we do this)becuase we cannot mutate it, we can only makea  copy of it ]
                items: [action.payload, ...state.items]
            }

        case EDIT_ITEM:
            return {
                ...state,
                items: state.items.filter(item => item._id === action.payload),
                // item: action.payload,
                // Items equals [the action payload(new item that comes in) and then add spread operator state.items and will add to the items (we do this)becuase we cannot mutate it, we can only makea  copy of it ]
                // items: [action.payload, ...state.items]
                loading: false
            }

        
        
        case ITEMS_LOADING:
            return {
                ...state,
                loading: true
            }
        default:
            return state;
    }
}