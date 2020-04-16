import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, DEVICES_API } from '../../../Config/Config'
import deviceValidation from './Validator'
import axios from 'axios'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }

class DeviceManagement extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      opendeleteModal: false,
      openaddmodal: false,
      isOpen: false,
      device_id: "",
      api_key: "",
      timestamp: Math.floor(Date.now() / 1000),
      id: '',
      delId: '',
      isSubmitted: false,
      errors: undefined, done: undefined, redirect: false,
    }
    this.timeConverter = this.timeConverter.bind(this)
  }

  componentDidMount() {
    this._isMounted = true;
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${DEVICES_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (this._isMounted) {
          this.setState({
            data: res.data.results,
          })
        }
      }).catch(err => {
        if (err.response.status === 204) {
          return localStorage.removeItem('accessToken');
        }
        return err
      })
  }


  removerow = () => {
    axios.delete(`${BASE_URL}/${DEVICES_API}/${this.state.delId}/`, { headers }).then(res => {
      var index = this.state.delId;
      const items = this.state.data.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({
          data: items
        })
      }
    }).catch(err => err)
  }

  openEditModal = (id, d_id, api) => {
    const previousState = !this.state.isOpen;
    this.setState({
      isOpen: previousState,
      id: id,
      device_id: d_id,
      api_key: api,
      errors: undefined
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


  handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val });
  }

  handleEmpty() {
    this.setState({
      device_id: "",
      api_key: "",
    })
  }

  handleEditSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = deviceValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "device_id=" + this.state.device_id + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.put(`${BASE_URL}/${DEVICES_API}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
              isSubmitted: true,
              errors: undefined
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({ isSubmitted: false }))
    }
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = deviceValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "device_id=" + this.state.device_id + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.post(`${BASE_URL}/${DEVICES_API}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({ isSubmitted: false, errors: (err.response.data.device_id ? "Device Id Must Be Unique, Sorry this device id already exist" : '') }))
    }
  }

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
    const { data, opendeleteModal, isOpen, api_key, device_id, openaddmodal, errors } = this.state;
    return (
      <div className="justify-content-center">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fas fa-tablet"></i> Device Management
                <Button className="card-header-actions" color='success' size='sm' onClick={this.openAddModal}>
                  <i className="fa fa-plus"></i> Add New Device
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" >
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Device Id</th>
                      <th>Device Api Key</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.map((alt, i) => {

                      var timeNow = this.timeConverter(alt.timestamp)
                      return <tr key={i}>
                        <td>{i + 1}</td>
                        <td>{alt.device_id}</td>
                        <td>{alt.api_key}</td>
                        <td>{timeNow}</td>
                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                          <button className='btn btn-primary btn-sm'
                            onClick={this.openEditModal.bind(this, alt.id, alt.device_id, alt.api_key)}
                          >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, alt.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>
                          <Modal isOpen={opendeleteModal} backdrop={false} toggle={this.toggleDeleteModal} >
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}> Delete Device</ModalHeader>
                            <ModalBody>Are you want to delete Device?</ModalBody>
                            <ModalFooter>
                              <Button color="danger" onClick={() => {
                                this.removerow(alt.id)
                                this.setState({ opendeleteModal: false })
                              }}> Delete</Button>
                              <span></span>
                              <Button color='primary' onClick={() => this.setState({ opendeleteModal: false })}>Cancel</Button>
                            </ModalFooter>
                          </Modal>
                        </td>
                      </tr>
                    })}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Device</ModalHeader>
          <ModalBody>
            <form >

              <FormGroup >
                <Label>Device ID : </Label>
                <Input type="text" value={device_id} disabled={true} />
              </FormGroup>

              <Button color='info' block type="submit" onClick={this.handleEditSubmit.bind(this)}> Done</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

        <Modal isOpen={openaddmodal} backdrop={false} toggle={this.openAddModal}>
          <ModalHeader toggle={() => this.setState({ openaddmodal: false })}>Add New Device</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleEditSubmit}>

              <FormGroup >
                <Label>Device ID <span /></Label>
                <Input type="text" name="device_id" value={device_id.trim()} onChange={this.handleChange} placeholder="Device ID" required />
              </FormGroup>

              <Button onClick={this.handleAddSubmit.bind(this)}
                type="submit" color="success" block>
                ADD DEVICE</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default DeviceManagement;
