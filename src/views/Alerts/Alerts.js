import React, { useEffect, useState, Fragment } from 'react';
import { BASE_URL, FORMAT, ALERTS_API } from '../../Config/Config'
import { Pagination } from 'antd';
import { timeConverter } from '../../GlobalFunctions/timeConverter'
import axios from 'axios'; import AlertsModule from './AlertsModule';

export default function Alerts() {

  const [alerts, setAlerts] = useState([]);
  const [hasError, setErrors] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [alertsPerPage, setAlertsPerPage] = useState(10);

  useEffect(() => {
    const fetchAlerts = async () => {
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      setLoading(true);
      const res = await axios.get(`${BASE_URL}/${ALERTS_API}/${FORMAT}`, { headers });
      if (res.status === 200) {
        setAlerts(res.data.data);
      } else {
        setErrors(true)
      }
      setLoading(false);
    };

    fetchAlerts();
  }, []);

  const indexOfLastAlert = currentPage * alertsPerPage;
  const indexOfFirstAlert = indexOfLastAlert - alertsPerPage;
  const currentAlerts = alerts.slice(indexOfFirstAlert, indexOfLastAlert);
  const paginate = pageNumber => setCurrentPage(pageNumber);
  return (
    < Fragment >
      <AlertsModule
        Data={currentAlerts}
        timeConverter={timeConverter}
        loading={loading}
        page={currentPage}
        alertsPerPage={alertsPerPage} />
      {
        !loading ?
          <Pagination
            showQuickJumper
            defaultPageSize={10}
            defaultCurrent={2}
            pageSize={alertsPerPage}
            total={alerts.length}
            onChange={paginate} /> : ''
      }
    </Fragment >
  )

}
