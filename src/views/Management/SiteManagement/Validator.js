import isEmpty from 'lodash/isEmpty'
export default function siteValidation(data) {
    let errors = {}
    if (!data.site_id || !data.site_name || !data.site_location || !data.region || !data.device) {
        errors = `All Fields are required`
    }

    return {
        errors,
        isValid: isEmpty(errors),
    }

}