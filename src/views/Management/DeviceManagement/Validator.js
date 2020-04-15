import isEmpty from 'lodash/isEmpty'
export default function deviceValidation(data) {
    let errors = {}
    if (!data.device_id) {
        errors = `Please Insert Device ID`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }

}