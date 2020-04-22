import React, { useEffect, useState, Fragment } from 'react';
import { BASE_URL, FORMAT, ALERTS_API, SITES_API } from '../../Config/Config'
import { Pagination } from 'antd';

import axios from 'axios'
import AlertsModule from './AlertsModule';

export default function Alerts() {

  const timeConverter = (UNIX_timestamp) => {
    var a = new Date(UNIX_timestamp * 1000);
    var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + ' ' + month + ' ' + year + ' ' + hour + ':' + min + ':' + sec;
    return time;
  }

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsPerPage, setAlertsPerPage] = useState(10);

  useEffect(() => {
    const fetchAlerts = async () => {
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/${ALERTS_API}/${FORMAT}`, { headers });
      setAlerts(res.data.data);
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const paginate = pageNumber => setCurrentPage(pageNumber);

  return (
    <Fragment>
      <AlertsModule
        Data={currentAlerts}
        timeConverter={e => timeConverter(e)}
        loading={loading}
        page={currentPage}
        alertsPerPage={alertsPerPage} />
      {!loading ?
        <Pagination
          showQuickJumper
          defaultPageSize={10}
          defaultCurrent={2}
          pageSize={alertsPerPage}
          total={alerts.length}
          onChange={paginate} /> : ''}

    </Fragment>
  )

}
