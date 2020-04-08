export const BASE_URL = `http://staging-wats.cs-satms.com`;
export const PORT = 8443;
export const SITES_API = `api/sites`;
export const REGIONS_API = `api/regions`;
export const DEVICES_API = `api/devices`;
export const ALERTS_API = `api/alerts`;
export const token = localStorage.getItem('accessToken');
export const headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token };
export const ASSET_API = `api/assets`
export const TRANSFER_ASSET = `assets_transfer`
export const ASSET_BY_SITE = `assets_states_report_by_site_id?site_id=`
export const LOGIN = `o/token`
export const CLIENT_SECRET = "tM8i79al4DXRX5l6ywJAYqnw17giqjCx9gVjNjmyJXunA0rpscuolQxkGfdXIzLjDcWO3HAN3GT4ZGOYXl0QmtHZBw8KLJQJVqVpoqQnk3wCg5dsh0DpV5UPYLaLg1vP";
export const CLIENT_ID = "dLrXEw6WIj9shLkbXHfngd4LrRX1EzGVl57t91gu";
export const ReportAPI = `alerts_reporting`