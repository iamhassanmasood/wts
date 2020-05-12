import isEmpty from 'lodash/isEmpty'
export default function ReportValidation(data) {
    let errors = {}
    if (!data.level || !data.siteValue || !data.timeperiod || !(data.date || data.week || data.month)) {
        errors = `Please Fill All Fields Are Required!!`
    } else if (data.fromDate > data.toDate) {
        errors = `Please insert valid date`
    }
    return {
        errors,
        isValid: isEmpty(errors),
    }

}