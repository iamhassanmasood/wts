import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import axios from 'axios'
import { Pagination } from 'antd';
import { BASE_URL, FORMAT, REGIONS_API } from '../../../config/config'
import regionValidation from './Validator'
import { timeConverter } from '../../../globalFunctions/timeConverter'

export default class RegionManagement extends Component {
  constructor(props) {
    super(props)
    this.state = {
      RegionData: [],
      done: false,
      opendeleteModal: false,
      isOpen: false,
      openaddmodal: false,
      errors: undefined,
      region_id: undefined,
      region_name: undefined,
      isSubmitted: false,
      errors: undefined,
      timestamp: Math.floor(Date.now() / 1000),
      id: '',
      delId: '',
      opendeleteModal: false,
      currentPage: 1,
      regionPerPage: 10,
    }
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${REGIONS_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            RegionData: res.data.data,
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

  removerow = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.delete(`${BASE_URL}/${REGIONS_API}/${this.state.delId}/`, { headers }).then(res => {
      this.setState({ done: true })
      var index = this.state.delId;
      const items = this.state.RegionData.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({
          RegionData: items
        })
      }
    }).catch(err => {
      if (err.response.status === 401) {
        localStorage.removeItem('accessToken');
        this.props.history.push('/login')
      }
      return err
    })
  }

  openEditModal = (id, d_id, name) => {
    const previousState = !this.state.isOpen;
    this.setState({
      isOpen: previousState,
      id: id,
      region_id: d_id,
      region_name: name,
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
      region_id: "",
      region_name: "",
    })
  }
  handleEditSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = regionValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "region_id=" + this.state.region_id + "&region_name=" + this.state.region_name + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.put(`${BASE_URL}/${REGIONS_API}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err =>
          this.setState({ isSubmitted: false, errors: ((err.response.data.region_name ? "Region name must be unique, Sorry! This region name already exist" : '')) }))
    }
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = regionValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "region_id=" + this.state.region_id + "&region_name=" + this.state.region_name + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.post(`${BASE_URL}/${REGIONS_API}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({ isSubmitted: false, errors: ((err.response.data.region_id ? "Region Id must be unique, Sorry! This region Id already exist" : '') || (err.response.data.region_name ? "Region name must be unique, Sorry! This region name already exist" : '')) }))
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

    const { RegionData, done, isOpen, openaddmodal, opendeleteModal, errors, region_id, region_name, currentPage, regionPerPage } = this.state
    const indexOfLastAlert = currentPage * regionPerPage;
    const indexOfFirstAlert = indexOfLastAlert - regionPerPage;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-apple"></i> Region Management
                <Button color='success' size='sm' className="card-header-actions" onClick={this.openAddModal}>
                  <i className="fa fa-plus"></i> Add New Region
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped centred responsive size="sm" className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Region Id</th>
                      <th>Region Name</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {RegionData.slice(indexOfFirstAlert, indexOfLastAlert).map((rd, i) => {
                      var timeNow = timeConverter(rd.timestamp)
                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1 + (currentPage - 1) * regionPerPage}</td>
                        <td>{rd.region_id}</td>
                        <td>{rd.region_name}</td>
                        <td>{timeNow}</td>
                        <td>
                          <button className='btn btn-primary btn-sm btn-margin'
                            onClick={this.openEditModal.bind(this, rd.id, rd.region_id, rd.region_name)} >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, rd.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>Delete Region </ModalHeader>
                            <ModalBody>Are you want to delete this Region ?</ModalBody>
                            <ModalFooter>
                              <Button color='danger' onClick={() => {
                                this.setState({ opendeleteModal: false })
                                this.removerow(rd.id)
                              }}>Delete</Button>
                              <span></span>
                              <Button color='primary'
                                onClick={() => this.setState({ opendeleteModal: false })}> Cancel</Button>
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
          defaultCurrent={2}
          pageSize={regionPerPage}
          total={RegionData.length}
          onChange={this.paginate} />

        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Region</ModalHeader>
          <ModalBody>
            <form >

              <FormGroup >
                <Label>Region Id </Label>
                <Input type="text" value={region_id} name="region_id" value={region_id} disabled={true} />
              </FormGroup>

              <FormGroup >
                <Label>Region Name </Label>
                <Input type="text" name="region_name" value={region_name} onChange={this.handleChange} placeholder="Region Name" />
              </FormGroup>

              <Button color='info' block type="submit" onClick={this.handleEditSubmit.bind(this)}> Done</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

        <Modal isOpen={openaddmodal} backdrop={false} toggle={this.openAddModal}>
          <ModalHeader toggle={() => this.setState({ openaddmodal: false })}>Add New Region</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleEditSubmit}>

              <FormGroup >
                <Label>Region Id <span /></Label>
                <Input type="text" name="region_id" value={region_id} onChange={this.handleChange} placeholder="Region ID" required />
              </FormGroup>

              <FormGroup >
                <Label>Region Name <span /> </Label>
                <Input type="text" name="region_name" value={region_name} onChange={this.handleChange} placeholder="Region Name" />
              </FormGroup>

              <Button onClick={this.handleAddSubmit.bind(this)}
                type="submit" color="success" block>
                ADD Region</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

      </div>
    )
  }
}
