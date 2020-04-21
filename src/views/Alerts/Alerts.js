import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, FORMAT, ALERTS_API, SITES_API } from '../../Config/Config'
import { connect } from 'react-redux'
import { fetchAlerts } from '../../actions/action'

import axios from 'axios'

class Alerts extends Component {

  state = {
    Alertdata: [],
    rowsPerPage: 15,
    page: 0,
    count: undefined,
    redirect: false,
    done: false,
  }

  componentDidMount() {
    // this.connectAlert();
    this.loadPage()
  }
  loadPage = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${ALERTS_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          var arr = [...res.data.data];
          this.setState({
            Alertdata: arr,
          })
        }
      })
      .catch(err => {
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        }
        return err
      })

  }
  /**
  connectAlert = () => {
    var wss = new WebSocket(`wss://wts.cs-satms.com:8443/ws/api/alerts/`);
    let that = this;
    var connectInterval;
    wss.onopen = () => {
      this.setState({ wss: wss });
      that.timeout = 250;
      clearTimeout(connectInterval);
    };
    wss.onclose = e => {
      that.timeout = that.timeout + that.timeout;
      connectInterval = setTimeout(this.checkAlert, Math.min(10000, that.timeout));
    };

    wss.onerror = err => err ? wss.close() : ''

    wss.onmessage = e => {
      if (e.data) {
        var data = JSON.parse(e.data);
      }
      var alertMessage = data.message;
      if (alertMessage.length > 0) {

        const linkexist = alertMessage.includes('Link');
        var { Alertdata } = this.state;
        if (linkexist) {
          Alertdata.unshift({ site: alertMessage.split(',')[2], event: alertMessage.split(',')[1], timestamp: alertMessage.split(',')[3], asset: null })
          this.setState({ Alertdata })
        } else {
          Alertdata.unshift({ asset: alertMessage.split(',')[0], event: alertMessage.split(',')[1], timestamp: alertMessage.split(',')[2], site: null })
          this.setState({ Alertdata })
        }
      }
    }
  };

  checkAlert = () => {
    const { wss } = this.state;
    if (!wss || wss.readyState === WebSocket.CLOSED) this.connect();
  };
   */

  timeConverter(UNIX_timestamp) {
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



  render() {

    const { Alertdata, page, rowsPerPage } = this.state;

    if (Alertdata) {
      var rows = Alertdata.reverse().map((alt, i) => {
        var AlertTimeNow;
        if (!alt.timestamp) {
          AlertTimeNow = '';
        } else {
          AlertTimeNow = this.timeConverter(alt.timestamp);
        }
        return <tr key={i} style={{ height: '30px' }}>
          <td >{i + 1}</td>
          <td >{alt.event}</td>
          <td>{alt.asset_id}</td>
          <td>{alt.registered_site_id}</td>
          <td>{alt.alert_site_id}</td>
          <td>{alt.alert_type}</td>
          <td>{AlertTimeNow}</td>
        </tr>
      })
    }


    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-bell"></i> Alerts
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Events</th>
                      <th>Asset Id </th>
                      <th>Registered Site Id</th>
                      <th>Site Id</th>
                      <td>Alert Type</td>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </Table>

              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default connect()(Alerts);