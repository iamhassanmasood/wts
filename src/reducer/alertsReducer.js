import * as actions from '../actions/actionType'

export const initialState = {
    loading: false,
    hasErrors: false,
    alerts: [],
}

export default function alertsReducer(state = initialState, action) {
    switch (action.type) {
        case actions.GET_ALERTS:
            return { ...state, loading: true }
        case actions.GET_ALERTS_SUCCESS:
            return { alerts: action.payload, loading: false, hasErrors: false }
        case actions.GET_ALERTS_FAILURE:
            return { ...state, loading: false, hasErrors: true }
        default:
            return state
    }
}
