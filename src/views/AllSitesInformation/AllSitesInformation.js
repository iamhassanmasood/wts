import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button, Spinner } from 'reactstrap';

import { BASE_URL, PORT, SITES_API, REGIONS_API, DEVICES_API } from '../../Config/Config'
import axios from 'axios'

class AllSitesInformation extends Component {

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      deviceData: [],
      regionData: [],
      openaddmodal: false,
      isOpen: false,
      opendeleteModal: false,
      backdrop: true,
      site_id: "",
      site_name: '',
      lat_lng: '',
      region: '',
      device: '',
      page: 0,
      rowsPerPage: 10,
      timestamp: Math.floor(Date.now() / 1000),
      id: "",
      delId: '',
      isSubmitted: false,
      errors: undefined,
      done: false,
      redirect: false
    }
  }


  async componentDidMount() {
    this._isMounted = true;
    this.getRegion();
    this.getDevice();
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    await axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          const data = [...res.data]
          this.setState({
            data: data,
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          return localStorage.removeItem('accessToken');
        }
        return err
      })
  }

  getRegion = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${REGIONS_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            regionData: res.data.results
          })
        }
      })
      .catch(err => err)
  }

  getDevice = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}:${PORT}/${DEVICES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            deviceData: res.data.results,
          })
        }
      })
      .catch(err => err)
  }

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
    const { data, page, rowsPerPage, regionData, deviceData, errors, done } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-sitemap"></i>All Sites Information</CardHeader>
              <CardBody>
                {done ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><Spinner color='info' size='lg' /></div> :
                  <Table hover bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Sr#</th>
                        <th>Site Name</th>
                        <th>Region</th>
                        <th>Registration Time</th>
                        <th>Total Assets</th>
                        <th>Total Alerts</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).reverse().map((rowData, i) => {
                        var rName = this.state.regionData[regionData.findIndex(x => x.id === parseInt(rowData.region))]
                        if (rName) {
                          var region_name = rName.region_name;
                        }
                        var dName = this.state.deviceData[deviceData.findIndex(x => x.id === parseInt(rowData.device))]
                        if (dName) {
                          var device_name = dName.device_name;
                        }
                        var timeNow = this.timeConverter(rowData.timestamp)
                        return <tr key={i}>
                          <td>{i + 1 + rowsPerPage * page}</td>
                          <td>{rowData.site_name}</td>
                          <td>{region_name}</td>
                          <td>{timeNow}</td>
                          <td>NO Data from API</td>
                          <td>NO Data from API</td>
                        </tr>
                      })}
                    </tbody>
                  </Table>}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default AllSitesInformation;