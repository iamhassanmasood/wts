import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, DEVICES_API, FORMAT } from '../../../Config/Config'
import deviceValidation from './Validator'
import axios from 'axios'
import { Pagination } from 'antd';
import { timeConverter } from '../../../GlobalFunctions/timeConverter'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }

class DeviceManagement extends Component {
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
      currentPage: 1,
      devicePerPage: 10,
      errors: undefined, done: undefined, redirect: false,
    }
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${DEVICES_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            data: res.data.data,
          })
        }
      }).catch(err => {
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
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
        .catch(err => this.setState({ isSubmitted: false, errors: (err.response.data.device_id ? err.response.data.device_id : '') }))
    }
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
    const { data, opendeleteModal, devicePerPage, currentPage, isOpen, api_key, device_id, openaddmodal, errors } = this.state;
    const indexOfLastAlert = currentPage * devicePerPage;
    const indexOfFirstAlert = indexOfLastAlert - devicePerPage;

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
                <Table hover bordered striped responsive size="sm" className="table table-striped table-dark">
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
                    {data.slice(indexOfFirstAlert, indexOfLastAlert).map((alt, i) => {

                      var timeNow = timeConverter(alt.timestamp)
                      return <tr key={i}>
                        <td>{i + 1 + (currentPage - 1) * devicePerPage}</td>
                        <td>{alt.device_id}</td>
                        <td>{alt.api_key}</td>
                        <td>{timeNow}</td>
                        <td>

                          <button className='btn btn-primary btn-sm btn-margin'
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

        <Pagination
          showQuickJumper
          defaultCurrent={2}
          pageSize={devicePerPage}
          total={data.length}
          onChange={this.paginate} />

        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Device</ModalHeader>
          <ModalBody>
            <form >

              <FormGroup >
                <Label>Device Id : </Label>
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
                <Label>Device Id <span /></Label>
                <Input type="text" name="device_id" value={device_id.trim()} onChange={this.handleChange} placeholder="Device Id" required />
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
