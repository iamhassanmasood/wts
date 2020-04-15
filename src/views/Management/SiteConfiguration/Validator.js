import isEmpty from 'lodash/isEmpty'
export default function siteConfigValidation(data) {
    let errors = {}
    if (
        !data.uuid ||
        !data.tag_missing_timeout ||
        !data.site_heartbeat_interval ||
        !data.low_battery_threshold ||
        !data.high_temp_threshold ||
        !data.low_temp_threshold ||
        !data.power_down_alert_interval ||
        !data.site
    ) {
        errors = `All Fields are Required`
    }

    return {
        isValid: isEmpty(errors),
        errors
    }
}