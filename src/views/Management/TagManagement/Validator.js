import isEmpty from 'lodash/isEmpty'
export default function tagValidation(data) {
    let errors = {}
    if (!data.tag_id || !data.tag_name) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }
}