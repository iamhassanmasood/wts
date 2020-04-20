let assetReducer = (state = [], actions) => {
    switch (actions.type) {
        case "ADD_ASSET":
            return state
        case "REMOVE_ASSET":
            return state
        case "UPDATE_ASSET":
            return state
        default:
            return state
    }
}

export default assetReducer;