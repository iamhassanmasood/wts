import { ADD_ASSET, REMOVE_ASSET, UPDATE_ASSET, ASSET_DATA, GET_ALERTS, GET_ALERTS_SUCCESS, GET_ALERTS_FAILURE } from './actionType'
import { BASE_URL, ASSET_API, FORMAT, token, headers } from './../config/config'
import axios from 'axios'

export const assetData = () => {
    const request = axios.get(`${BASE_URL}/${ASSET_API}/${FORMAT}`, { headers })
    return ({
        type: ASSET_DATA,
        payload: request
    })
}

export const addAsset = () => {

}

export const removeAsset = (id) => {

}

export const updateAsset = (id) => {

}





export const getAlerts = () => ({ type: GET_ALERTS })
export const getAlertsSuccess = alerts => ({
    type: GET_ALERTS_SUCCESS,
    payload: alerts,
})
export const getAlertsFailure = () => ({ type: GET_ALERTS_FAILURE })

export function fetchAlerts() {
    return async dispatch => {
        dispatch(getAlerts())

        try {
            const response = await fetch('http://staging-wats.cs-satms.com/api/alerts/?format=datatables', { headers })
            const data = await response.json()

            dispatch(getAlertsSuccess(data))
        } catch (error) {
            dispatch(getAlertsFailure())
        }
    }
}
