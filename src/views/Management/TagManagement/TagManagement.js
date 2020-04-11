import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import axios from 'axios'
import { BASE_URL, TAGS_API } from '../../../Config/Config'
import tagValidation from './Validator'


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
      opendeleteModal: false

    }
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${TAGS_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            tagData: res.data.results,
            done: false
          })
        }
      })
      .catch(err => {
        console.log(err, "error")
        if (err.response.data.detail === "Authentication credentials were not provided.") {
          localStorage.removeItem('accessToken');
        } else return err
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
      if (err.response.data.detail === "Authentication credentials were not provided.") {
        localStorage.removeItem('accessToken');
      } else return err
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
        .catch(err => {
          if (err.response.data.tag_id) {
            this.setState({ errors: "Oops! Tag ID invalid ", isSubmitted: false })
          } else if (err.response.data.tag_type) {
            this.setState({ errors: "Oops! Tag Type invalid ", isSubmitted: false })
          }
        }
        )
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
        .catch(err => {
          if (err.response.data.tag_id) {
            this.setState({ errors: "Oops! Tag ID already exists ", isSubmitted: false })
          } else if (err.response.data.tag_type) {
            this.setState({ errors: "Oops! Tag Type inValid ", isSubmitted: false })
          }
        }
        )
    }
  }

  toggleDeleteModal = (id) => {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
  }


  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  }

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  }

  timeConverter = (UNIX_timestamp) => {
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
    const { tagData, done, isOpen, openaddmodal, opendeleteModal, errors, tag_id, tag_type } = this.state;
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
                <Table hover bordered striped centred responsive size="sm">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Tag ID</th>
                      <th>Tag Type</th>
                      <th>Time</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tagData.map((item, i) => {
                      var timeNow = this.timeConverter(item.timestamp)
                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1}</td>
                        <td>{item.tag_id}</td>
                        <td>{item.tag_type}</td>
                        <td>{timeNow}</td>
                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>
                          <button className='btn btn-primary btn-sm'
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




        <Modal isOpen={isOpen} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Tag</ModalHeader>
          <ModalBody>
            <form >

              <FormGroup >
                <Label>Tag ID : </Label>
                <Input type="text" value={tag_id} name="tag_id" value={tag_id} onChange={this.handleChange} placeholder="tag ID" />
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
                <Label>Tag ID <span /></Label>
                <Input type="text" name="tag_id" value={tag_id} onChange={this.handleChange} placeholder="tag ID" required />
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
                ADD Tag</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default TagManagement;
