import { combineReducers } from 'redux'
import assetReducer from './assetReducer'
import alertsReducer from './alertsReducer';

const reducer = combineReducers({
    assetReducer,
    alertsReducer
})

export default reducer;