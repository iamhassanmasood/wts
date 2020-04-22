import { ADD_ASSET, REMOVE_ASSET, UPDATE_ASSET, ASSET_DATA } from '../actions/actionType'
let initialState = {
    AssetData: [],
    fetching: false
};

let assetReducer = (state = initialState, actions = null) => {
    switch (actions.type) {
        case ASSET_DATA:
            return {
                ...state,
                AssetData: actions.payload.data.data,
                fetching: false
            }
        case ADD_ASSET:
            return state
        case REMOVE_ASSET:
            return state
        case UPDATE_ASSET:
            return state
        default:
            return state
    }
}

export default assetReducer;