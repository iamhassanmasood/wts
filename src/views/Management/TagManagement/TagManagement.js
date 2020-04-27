import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import axios from 'axios'
import { Pagination } from 'antd';
import { BASE_URL, TAGS_API, FORMAT } from '../../../Config/Config'
import tagValidation from './Validator'
import { timeConverter } from '../../../GlobalFunctions/timeConverter'

class TagManagement extends Component {

  constructor(props) {
    super(props)
    this.state = {
      tagData: [],
      done: false,

      isOpen: false,
      openaddmodal: false,
      tag_id: undefined,
      tag_type: undefined,

      isSubmitted: false,
      errors: undefined,

      timestamp: Math.floor(Date.now() / 1000),
      id: '',
      delId: '',
      opendeleteModal: false,

      currentPage: 1,
      tagPerPage: 10,

    }
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${TAGS_API}/${FORMAT}`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            tagData: res.data.data,
            done: false
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

  removerow = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.delete(`${BASE_URL}/${TAGS_API}/${this.state.delId}/`, { headers }).then(res => {
      this.setState({ done: true })
      var index = this.state.delId;
      const items = this.state.tagData.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({
          tagData: items
        })
      }
    }).catch(err => {
      if (err.status === 401) {
        localStorage.removeItem('accessToken');
      }
      return err
    })
  }

  openEditModal = (id, d_id, name) => {
    const previousState = !this.state.isOpen;
    this.setState({
      isOpen: previousState,
      id: id,
      tag_id: d_id,
      tag_type: name,
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
      tag_id: "",
      tag_type: ""
    })
  }
  handleEditSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = tagValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "tag_id=" + this.state.tag_id + "&tag_type=" + this.state.tag_type + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.put(`${BASE_URL}/${TAGS_API}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err => err)
    }
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = tagValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "tag_id=" + this.state.tag_id + "&tag_type=" + this.state.tag_type + "&timestamp=" + this.state.timestamp;
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      axios.post(`${BASE_URL}/${TAGS_API}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err =>
          this.setState({ errors: (err.response.data.tag_id ? "Sorry! This Tag ID already exists " : ''), isSubmitted: false })
        )
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
    const { tagData, currentPage, tagPerPage, isOpen, openaddmodal, opendeleteModal, errors, tag_id, tag_type } = this.state;
    const indexOfLastAlert = currentPage * tagPerPage;
    const indexOfFirstAlert = indexOfLastAlert - tagPerPage;

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-tag"></i> Tag Management
                <Button color='success' size='sm' className="card-header-actions" onClick={this.openAddModal}>
                  <a>
                    <i className="fa fa-plus"></i> Add New Tag
                  </a>
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped centred responsive size="sm" className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Tag Id</th>
                      <th>Tag Type</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagData.slice(indexOfFirstAlert, indexOfLastAlert).map((item, i) => {
                      var timeNow = timeConverter(item.timestamp)
                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1 + (currentPage - 1) * tagPerPage}</td>
                        <td>{item.tag_id}</td>
                        <td>{item.tag_type}</td>
                        <td>{timeNow}</td>
                        <td>
                          <button className='btn btn-primary btn-sm btn-margin'
                            onClick={this.openEditModal.bind(this, item.id, item.tag_id, item.tag_type)} >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, item.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>Delete Tag </ModalHeader>
                            <ModalBody>Are you want to delete this tag ?</ModalBody>
                            <ModalFooter>
                              <Button color='danger' onClick={() => {
                                this.setState({ opendeleteModal: false })
                                this.removerow(item.id)
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
          showQuickJumper
          defaultCurrent={2}
          pageSize={tagPerPage}
          total={tagData.length}
          onChange={this.paginate} />


        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Tag</ModalHeader>
          <ModalBody>
            <form >

              <FormGroup >
                <Label>Tag Id</Label>
                <Input type="text" value={tag_id} name="tag_id" value={tag_id} disabled={true} />
              </FormGroup>

              <FormGroup >
                <Label>Tag Type <span /> </Label>
                <Input type="select" name="tag_type" value={tag_type} onChange={this.handleChange} placeholder="Tag Type" >
                  <option value="" disabled defaultValue>Select Tag </option>
                  <option>E9</option>
                  <option>E8</option>
                  <option>C7</option>
                </Input>
              </FormGroup>

              <Button color='info' block type="submit" onClick={this.handleEditSubmit.bind(this)}> Done</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

        <Modal isOpen={openaddmodal} backdrop={false} toggle={this.openAddModal}>
          <ModalHeader toggle={() => this.setState({ openaddmodal: false })}>Add New Tag</ModalHeader>
          <ModalBody>
            <form onSubmit={this.handleEditSubmit}>

              <FormGroup >
                <Label>Tag Id <span /></Label>
                <Input type="text" name="tag_id" value={tag_id} onChange={this.handleChange} placeholder="Tag Id" required />
              </FormGroup>

              <FormGroup >
                <Label>Tag Type <span /> </Label>
                <Input type="select" name="tag_type" value={tag_type} onChange={this.handleChange} placeholder="Tag Type" >
                  <option value="" disabled defaultValue>Select Tag </option>
                  <option>E9</option>
                  <option>E8</option>
                  <option>C7</option>
                </Input>
              </FormGroup>

              <Button onClick={this.handleAddSubmit.bind(this)}
                type="submit" color="success" block>
                ADD TAG</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default TagManagement;
