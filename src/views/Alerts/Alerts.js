import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, ALERTS_API, SITES_API } from '../../Config/Config'

import axios from 'axios'
class Alerts extends Component {

  _isMounted = false
  state = {
    Alertdata: [],
    rowsPerPage: 15,
    page: 0,
    count: undefined,
    redirect: false,
    done: false,
  }

  componentDidMount() {
    this._isMounted = true;
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    this.connectAlert();
    this.setState({ done: true })
    axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=1&offset=0`, { headers })
      .then(res => {
        this.setState({ count: res.data.count })
        var offset = this.state.count - 100;
        axios.get(`${BASE_URL}:${PORT}/${ALERTS_API}/?limit=100&offset=${offset}`, { headers })
          .then(res => {
            if (res.status === 200) {
              var arr = res.data.results;
              var Alertdata = []
              for (var i = 0; i < arr.length; i++) {
                Alertdata.push({ event: arr[i].event, asset: arr[i].asset, site: arr[i].site, timestamp: arr[i].timestamp })
              }

              this.setState({
                Alertdata,
                done: false
              })
            }
          }).catch(err => {
            if (err.response.data.detail === "Authentication credentials were not provided.") {
              localStorage.removeItem('accessToken');
              this.setState({ redirect: true })
            } else return err
          })
      })
  }
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
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  }


  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  };

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
          {alt.site ? <td>{alt.site.name}</td> : <td>-</td>}
          {alt.asset ? <td>{alt.asset.name}</td> : <td>-</td>}
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
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Events</th>
                      <th>Site</th>
                      <th>Asset</th>
                      <th>Created At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows}
                  </tbody>
                </Table>
                {/* <nav>
                <Pagination>
                  <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                  <PaginationItem active>
                    <PaginationLink tag="button">1</PaginationLink>
                  </PaginationItem>
                  <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                  <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                </Pagination>
              </nav> */}
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    );
  }
}

export default Alerts;
