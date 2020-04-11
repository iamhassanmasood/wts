import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button, Spinner } from 'reactstrap';
import { BASE_URL, PORT, SITES_API, REGIONS_API, DEVICES_API } from '../../../Config/Config'
import axios from 'axios'
import siteValidation from './Validator'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }


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

  removerow = () => {
    this._isMounted = true;
    var index = this.state.delId;
    let data = this.state.data.filter(row => row.id !== index)
    axios.delete(`${BASE_URL}/${SITES_API}/${this.state.delId}/`, { headers }).then(res => {
      this.setState({ done: true })
      if (res.status === 204) {
        this.setState({ data, done: false })
      }

    }).catch(err => {
      if (err.response.data.detail === "Authentication credentials were not provided.") {
        localStorage.removeItem('accessToken');
        this.setState({ redirect: true })
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
    await axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            data: res.data.reverse(),
            done: false
          })
        }
      })
      .catch(err => {
        if (err.response.data.detail === "Authentication credentials were not provided.") {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        } else return err
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
    axios.get(`${BASE_URL}/${DEVICES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            deviceData: res.data.results,
          })
        }
      })
      .catch(err => err)
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
            })
            this.componentDidMount()
          }
        })
        .catch(err => {
          if (err.response.data.site_id) {
            this.setState({ errors: "Oops! Site ID already exists ", isSubmitted: false })
          } else if (err.response.data.site_name) {
            this.setState({ errors: "Oops! Site Name already exists ", isSubmitted: false })
          } else if (err.response.data.device) {
            this.setState({ errors: "Oops! This device already exists ", isSubmitted: false })
          }
        }
        )
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
            })
            this.componentDidMount();
          }
        })
        .catch(err => {
          if (err.response.data.site_id) {
            this.setState({ errors: "Oops! Site ID already exists ", isSubmitted: false })
          } else if (err.response.data.site_name) {
            this.setState({ errors: "Oops! Site Name already exists ", isSubmitted: false })
          } else if (err.response.data.device) {
            this.setState({ errors: "Oops! This device already exists ", isSubmitted: false })
          }
        })
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
  handleChangeLatLng = (e) => {
    let val = e.target.value;
    var k = e ? e.which : window.event.keyCode;
    if (k === 32) return false;
    var comma = val.includes(',')
    if (!comma) {
      this.setState({
        errors: "Please insert valid lat long, i.e 76,34"
      })
    }
    if (comma) {
      this.setState({
        errors: ""
      })
    }
    var space = val.includes(' ')
    if (space) {
      this.setState({
        errors: "No Space allow in lat long, i.e 76,34"
      })
    }
    this.setState({ site_location: val });
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

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  };

  toggleDeleteModal = (id) => {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
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
    const { site_name, site_id, site_type, id, site_location, region, device, isOpen, data,
      openaddmodal, page, rowsPerPage, opendeleteModal, regionData, deviceData, errors, done } = this.state;
    // if (regionData) {
    //   let regionValue = this.search(region, regionData)

    // }

    return (

      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-sitemap"></i> Site Management
                <Button color='success' onClick={this.openAddModal} size='sm' className="card-header-actions">
                  <i className="fa fa-plus"></i> Add New Site
                </Button>
              </CardHeader>
              <CardBody>
                {done ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><Spinner color='info' size='lg' /></div> :
                  <Table hover bordered striped responsive size="sm">
                    <thead>
                      <tr>
                        <th>Sr#</th>
                        <th>Site Id</th>
                        <th>Site Name</th>
                        <th>Location</th>
                        <th>Site Type</th>
                        <th>Region</th>
                        <th>Device</th>
                        <th>Time</th>
                        <th>Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.map((rowData, i) => {
                        var timeNow = this.timeConverter(rowData.timestamp)
                        return <tr key={i}>
                          <td>{i + 1 + rowsPerPage * page}</td>
                          <td>{rowData.site_id}</td>
                          <td>{rowData.site_name}</td>
                          <td>{rowData.site_location}</td>
                          <td>{rowData.site_type}</td>
                          <td>{rowData.region}</td>
                          <td>{rowData.device}</td>
                          <td>{timeNow}</td>
                          <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                            <button className='btn btn-primary btn-sm'
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
                  </Table>}
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
                  <option>warehouse</option>
                  <option>network</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_location">Lat,Lng <span /> </Label>
                <Input type="text" name="site_location" value={site_location.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="region">Region <span /> </Label>
                <Input type="select" name="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                  <option value="" disabled defaultValue>Select Region</option>
                  {regionData.map((reg, i) => (
                    <option key={i} value={reg.id}> {reg.region_name} </option>))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="Device">Device <span /> </Label>
                <Input type="select" name="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                  <option value="" disabled defaultValue>Select Device</option>
                  {deviceData.map((dev, i) => (
                    <option key={i} value={dev.id}> {dev.device_id} </option>))}
                </Input>
              </FormGroup>
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
                <Label htmlFor="site_id">Site ID <span /> </Label>
                <Input type="text" name="site_id" value={site_id.trim()} onChange={this.handleChange} placeholder="Site ID" />
              </FormGroup>

              <FormGroup>
                <Label>Site Name <span /> </Label>
                <Input type="text" name="site_name" value={site_name} onChange={this.handleChange} placeholder="Site Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_name">Site Type <span /> </Label>
                <Input type="select" name="site_type" value={site_type} onChange={this.handleChange} placeholder="Site Type" >
                  <option value="" disabled defaultValue>Select Site Type </option>
                  <option>warehouse</option>
                  <option>network</option>
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_location">Lat,Lng <span /> </Label>
                <Input type="text" name="site_location" value={site_location.trim()} onChange={this.handleChange} placeholder="Latitude, Longitude" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="region">Region <span /> </Label>
                <Input type='select' name="region" id="region" value={region} onChange={this.handleChangeRegion} placeholder="Region" >
                  <option value="" disabled defaultValue>Select Region</option>
                  {regionData.map((reg, i) => (
                    <option key={i} value={reg.id}> {reg.region_name} </option>))}
                </Input>
              </FormGroup>

              <FormGroup>
                <Label htmlFor="device">Device <span /> </Label>
                <Input type='select' name="device" id="device" value={device} onChange={this.handleChangeDevice} placeholder="Device" >
                  <option value="" disabled defaultValue>Select Device</option>
                  {deviceData.map((dev, i) => (
                    <option key={i} value={dev.id}> {dev.device_id} </option>))}
                </Input>
              </FormGroup>
              <Button onClick={this.handleAddSubmit.bind(this)} color='success' block type="submit" >ADD SITE</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>









      </div>

      // <div className="animated fadeIn">
      //   <Row>
      //     <Col xs="12" sm="6">
      //       <Card>
      //         <CardHeader>
      //           <strong>Company</strong>
      //           <small> Form</small>
      //         </CardHeader>
      //         <CardBody>
      //           <FormGroup>
      //             <Label htmlFor="company">Company</Label>
      //             <Input type="text" id="company" placeholder="Enter your company name" />
      //           </FormGroup>
      //           <FormGroup>
      //             <Label htmlFor="vat">VAT</Label>
      //             <Input type="text" id="vat" placeholder="DE1234567890" />
      //           </FormGroup>
      //           <FormGroup>
      //             <Label htmlFor="street">Street</Label>
      //             <Input type="text" id="street" placeholder="Enter street name" />
      //           </FormGroup>
      //           <FormGroup>
      //             <Label htmlFor="city">City</Label>
      //             <Input type="select" name="ccmonth">
      //               <option value="1">1</option>
      //               <option value="2">2</option>
      //               <option value="3">3</option>
      //               <option value="4">4</option>
      //               <option value="5">5</option>
      //               <option value="6">6</option>
      //               <option value="7">7</option>
      //               <option value="8">8</option>
      //               <option value="9">9</option>
      //               <option value="10">10</option>
      //               <option value="11">11</option>
      //               <option value="12">12</option>
      //             </Input>
      //           </FormGroup>
      //           <FormGroup>
      //             <Label htmlFor="country">Country</Label>
      //             <Input type="text" id="country" placeholder="Country name" />
      //           </FormGroup>
      //         </CardBody>
      //       </Card>
      //     </Col>
      //   </Row>
      // </div>


    );
  }
}

export default SiteManagement;
