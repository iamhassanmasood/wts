import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Spinner } from 'reactstrap';
import { BASE_URL, SITES_API, REGIONS_API, DEVICES_API, FORMAT } from '../../../config/config'
import axios from 'axios'
import { Pagination, message } from 'antd'; import { timeConverter } from '../../../globalFunctions/timeConverter'
import siteValidation from './Validator'
import { CSVLink } from "react-csv";

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }

const Headers = [
  { label: "Site Id", key: "site_id" },
  { label: "Site Name", key: "site_name" },
  { label: "Site Location", key: "site_location" },
  { label: "Site Type", key: "site_type" },
  { label: "Region", key: "region" },
  { label: "Device", key: "device" },
]

class SiteManagement extends Component {

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
      site_location: '',
      site_type: '',
      region: '',
      device: '',
      timestamp: Math.floor(Date.now() / 1000),
      id: "",
      delId: '',
      isSubmitted: false,
      errors: undefined,
      done: false,
      redirect: false,
      currentPage: 1,
      sitePerPage: 10,
    }
  }

  removerow = () => {
    var index = this.state.delId;
    let data = this.state.data.filter(row => row.id !== index)
    axios.delete(`${BASE_URL}/${SITES_API}/${this.state.delId}/`, { headers }).then(res => {
      this.setState({ done: true })
      if (res.status === 204) {
        this.setState({ data, done: false })
        message.error(`Site Removed`)
      }

    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem('accessToken');
        this.props.history.push('/login')
      } else return err
    })
  }

  openEditModal = (id, si, sn, st, lal, rg, dev) => {
    const currentState = !this.state.isOpen
    this.setState({
      isOpen: currentState,
      id: id,
      site_id: si,
      site_name: sn,
      site_type: st,
      site_location: lal,
      region: rg,
      device: dev,
      errors: undefined
    })
  }

  async componentDidMount() {
    this.getRegion();
    this.getDevice();
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    await axios.get(`${BASE_URL}/${SITES_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data.reverse(),
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        }
        return err
      })
  }
  getRegion = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${REGIONS_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            regionData: res.data.data
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        } else return err
      })
  }

  getDevice = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${DEVICES_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            deviceData: res.data.data,
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        } else return err
      })
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = siteValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "site_id=" + this.state.site_id + "&site_name=" + this.state.site_name + "&site_type=" + this.state.site_type + "&site_location=" + this.state.site_location + "&region=" + this.state.region + "&device=" +
        this.state.device + "&timestamp=" + this.state.timestamp;
      axios.post(`${BASE_URL}/${SITES_API}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
              errors: undefined,
              isSubmitted: true
            })
            message.success(` New Site ${this.state.site_name} Added Successfully`)
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({
          isSubmitted: false, errors: ((err.response.data.site_id ? err.response.data.site_id : '')
            || (err.response.data.site_name ? "Sorry, This site name already exist" : '')
            || (err.response.data.device ? "This device already in use!" : '')
            || (err.response.data.site_location ? "Invalid site location!" : '')
          )
        }))
    }
  }

  search = (nameKey, myArray) => {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i].name === nameKey) {
        return myArray[i];
      }
    }
  }

  handleEditSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = siteValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {

      var regionValue;
      for (var j = 0; j < this.state.regionData.length; j++) {
        if (this.state.regionData[j].region_id === this.state.region) {
          regionValue = this.state.regionData[j].id
        }
      }

      var deviceValue;
      for (var i = 0; i < this.state.deviceData.length; i++) {
        if (this.state.deviceData[i].device_id === this.state.device) {
          deviceValue = this.state.deviceData[i].id
        }
      }

      let body = "site_id=" + this.state.site_id + "&site_name=" + this.state.site_name + "&site_type=" + this.state.site_type +
        "&site_location=" + this.state.site_location + "&region=" + regionValue + "&device=" + deviceValue + "&timestamp=" + this.state.timestamp;
      axios.put(`${BASE_URL}/${SITES_API}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
              errors: undefined,
              isSubmitted: true
            })
            message.info(`${this.state.site_name} Updated Successfully`)
            this.componentDidMount();
          }
        })
        .catch(err => this.setState({
          isSubmitted: false, errors: ((err.response.data.site_id ? "Sorry! this site id already exists" : '')
            || (err.response.data.site_name ? "Sorry, This site name already exist " : '')
            || (err.response.data.device ? "This device already in use!" : '')
            || (err.response.data.site_location ? "Invalid site location!" : '')

          )
        }))
    }
  }
  handleEmpty = () => {
    this.setState({
      site_id: "",
      site_name: '',
      site_type: '',
      site_location: '',
      region: '',
      device: '',
    })
  }

  openAddModal = () => {
    this.handleEmpty();
    const currentState = !this.state.openaddmodal
    this.setState({
      openaddmodal: currentState,
      errors: undefined
    })
  }

  handleChange = (e) => {
    let name = e.target.name;
    let val = e.target.value;
    var k = e ? e.which : window.event.keyCode;
    if (k === 32) return false;
    this.setState({ [name]: val, errors: "" });
  }

  handleChangeRegion = () => {
    var e = document.getElementById("region");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      region: result, errors: ""
    })
  }
  handleChangeDevice = () => {
    var e = document.getElementById("device");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      device: result, errors: ""
    })
  }

  toggleDeleteModal = (id) => {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
  }

  paginate = pageNumber => {
    this.setState({
      currentPage: pageNumber
    })
  };

  render() {
    const { site_name, site_id, site_type, id, site_location, region, device, isOpen, data,
      openaddmodal, opendeleteModal, regionData, deviceData, errors, done, sitePerPage, currentPage } = this.state;

    const indexOfLastAlert = currentPage * sitePerPage;
    const indexOfFirstAlert = indexOfLastAlert - sitePerPage;
    return (

      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-sitemap"></i> Site Management
                <Button color='success' onClick={this.openAddModal} size='sm' className="card-header-actions btn-pill">
                  <i className="fa fa-plus"></i> Add New Site
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Site Id</th>
                      <th>Site Name</th>
                      <th>Location</th>
                      <th>Site Type</th>
                      <th>Region</th>
                      <th>Device</th>
                      <th>Created At</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(indexOfFirstAlert, indexOfLastAlert).map((rowData, i) => {
                      var timeNow = timeConverter(rowData.timestamp)
                      return <tr key={i}>
                        <td>{i + 1 + (currentPage - 1) * sitePerPage}</td>
                        <td>{rowData.site_id}</td>
                        <td>{rowData.site_name}</td>
                        <td>{rowData.site_location}</td>
                        <td>{rowData.site_type}</td>
                        <td>{rowData.region}</td>
                        <td>{rowData.device}</td>
                        <td>{timeNow}</td>
                        <td>
                          <button className='btn btn-primary btn-sm btn-margin'
                            onClick={this.openEditModal.bind(this, rowData.id, rowData.site_id, rowData.site_name, rowData.site_type, rowData.site_location, rowData.region, rowData.device)}>
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, rowData.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>  Delete Site </ModalHeader>
                            <ModalBody>Are you want to delete this Site ? </ModalBody>
                            <ModalFooter>
                              <Button color='danger' onClick={() => {
                                this.setState({ opendeleteModal: false })
                                this.removerow(rowData.id)
                              }}>Delete</Button >
                              <span></span>
                              <Button color='primary' onClick={() => this.setState({ opendeleteModal: false })}>Cancel</Button >
                            </ModalFooter>
                          </Modal>

                        </td>
                      </tr>
                    })}
                  </tbody>
                </Table>
                <CSVLink data={data} headers={Headers} filename={"Sites.csv"} className='card-header-actions'>
                  <Button color="primary" size="sm" className="btn-pill">Export CSV</Button>
                </CSVLink>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Pagination
          defaultCurrent={2}
          pageSize={sitePerPage}
          total={data.length}
          onChange={this.paginate} />

        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Site</ModalHeader>
          <ModalBody>
            <form>

              <FormGroup>
                <Label>Site ID <span /> </Label>
                <Input type="text" name="site_id" value={site_id} disabled={true} placeholder={id} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_name">Site Name <span /> </Label>
                <Input type="text" name="site_name" value={site_name} onChange={this.handleChange} placeholder="Site Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_name">Site Type <span /> </Label>
                <Input type="select" name="site_type" value={site_type} onChange={this.handleChange} placeholder="Site Type" >
                  <option value="" disabled defaultValue>Select Site Type </option>
                  <option value="warehouse">Warehouse</option>
                  <option value="network">Network</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_location">Location<span /> </Label>
                <Input type="text" name="site_location" value={site_location.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude" />
              </FormGroup>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="region">Region <span /> </Label>
                    <Input type="select" name="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                      <option value="" disabled defaultValue>Select Region</option>
                      {regionData.map((reg, i) => (
                        <option key={i} value={reg.id}> {reg.region_name} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="Device">Device <span /> </Label>
                    <Input type="select" name="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                      <option value="" disabled defaultValue>Select Device</option>
                      {deviceData.map((dev, i) => (
                        <option key={i} value={dev.id}> {dev.device_id} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Button color="info" block onClick={this.handleEditSubmit.bind(this)} type="submit"> Done</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

        <Modal isOpen={openaddmodal} toggle={this.openAddModal} backdrop={false}>
          <ModalHeader toggle={this.openAddModal}>Add New Site</ModalHeader>
          <ModalBody>
            <form>

              <FormGroup>
                <Label htmlFor="site_id">Site Id <span /> </Label>
                <Input type="text" name="site_id" value={site_id.trim()} onChange={this.handleChange} placeholder="Site Id" />
              </FormGroup>

              <FormGroup>
                <Label>Site Name <span /> </Label>
                <Input type="text" name="site_name" value={site_name} onChange={this.handleChange} placeholder="Site Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_name">Site Type <span /> </Label>
                <Input type="select" name="site_type" value={site_type} onChange={this.handleChange} placeholder="Site Type" >
                  <option value="" disabled defaultValue>Select Site Type </option>
                  <option value="warehouse">Warehouse</option>
                  <option value="network">Network</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_location">Location <span /> </Label>
                <Input type="text" name="site_location" value={site_location.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude" />
              </FormGroup>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="region">Region <span /> </Label>
                    <Input type='select' name="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                      <option value="" disabled defaultValue>Select Region</option>
                      {regionData.map((reg, i) => (
                        <option key={i} value={reg.id}> {reg.region_name} </option>))}
                    </Input>
                  </FormGroup>

                </Col>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="device">Device <span /> </Label>
                    <Input type='select' name="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                      <option value="" disabled defaultValue>Select Device</option>
                      {deviceData.map((dev, i) => (
                        <option key={i} value={dev.id}> {dev.device_id} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Button onClick={this.handleAddSubmit.bind(this)} color='success' block type="submit" >ADD SITE</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

      </div>
    );
  }
}

export default SiteManagement;
