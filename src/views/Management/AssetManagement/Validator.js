import isEmpty from 'lodash/isEmpty'
export default function assetValidation(data) {
    let errors = {}
    if (!data.asset_id || !data.asset_name || !data.asset_brand || !data.owner_name || !data.owner_type || !data.tag || !data.site) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }
}