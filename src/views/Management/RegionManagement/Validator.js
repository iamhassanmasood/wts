import isEmpty from 'lodash/isEmpty'
export default function regionValidation(data) {
    let errors = {}
    if (!data.region_id || !data.region_name) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }

}