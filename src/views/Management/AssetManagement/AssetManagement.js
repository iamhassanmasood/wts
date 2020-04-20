import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, ASSET_API, TAGS_API, SITES_API } from '../../../Config/Config'
import assetValidation from './Validator'
import axios from 'axios'
import { connect } from 'react-redux'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
class AssetManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      AssetData: [],
      openaddmodal: false,
      isOpen: false,
      opendeleteModal: false,
      backdrop: true,
      asset_id: "",
      asset_name: '',
      asset_brand: '',
      owner_name: '',
      owner_type: '',
      page: 0,
      rowsPerPage: 10,
      timestamp: Math.floor(Date.now() / 1000),
      siteData: [],
      site: '',
      tagData: [],
      tag: '',
      id: '',
      delId: '',
      isSubmitted: false,
      errors: undefined,
      done: false,
      redirect: false,
    }
    this.timeConverter = this.timeConverter.bind(this)
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${ASSET_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            AssetData: res.data,
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          return localStorage.removeItem('accessToken');
        }
        return err
      })

    axios.get(`${BASE_URL}/${TAGS_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            tagData: res.data.results.sort((a, b) => b.timestamp - a.timestamp),
          })
        }
      })
      .catch(err => {
        if (err.response.status === 401) {
          return localStorage.removeItem('accessToken');
        }
        return err
      })

    axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            siteData: res.data.sort((a, b) => b.timestamp - a.timestamp),
          })
        }
      })
      .catch(err => err)
  }


  removerow = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.delete(`${BASE_URL}/${ASSET_API}/${this.state.delId}/`, { headers }).then(res => {
      this.setState({ done: true })
      var index = this.state.delId;
      const items = this.state.AssetData.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({ AssetData: items })
      }
    }).catch(err => {
      if (err.response.data.detail === "Authentication credentials were not provided.") {
        localStorage.removeItem('accessToken');
      } else return err
    })
  }


  openEditModal = (id, ai, an, on, ab, ot, tg, sit) => {
    const currentState = !this.state.isOpen
    this.setState({
      isOpen: currentState,
      id: id,
      asset_id: ai,
      asset_brand: ab,
      asset_name: an,
      owner_name: on,
      owner_type: ot,
      tag: tg,
      site: sit,
      errors: undefined,
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
    this.setState({ [name]: val, errors: "" });
  }

  handleEmpty = () => {
    this.setState({
      asset_id: "",
      asset_name: '',
      asset_brand: '',
      owner_name: '',
      owner_type: '',
      tag: '',
    })
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = assetValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {

      let body = "asset_id=" + this.state.asset_id + "&asset_name=" + this.state.asset_name + "&asset_brand=" + this.state.asset_brand + "&owner_name=" +
        this.state.owner_name + "&owner_type=" + this.state.owner_type + "&tag=" + this.state.tag + "&site=" + this.state.site + "&timestamp=" + this.state.timestamp;

      axios.post(`${BASE_URL}/${ASSET_API}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
              errors: undefined
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({ isSubmitted: false, errors: ((err.response.data.asset_id ? "Asset Id Must be Unique, Sorry! This Asset Id Already Exist" : '') || (err.response.data.asset_name ? "Asset Name Must Be Unique, Sorry! This Asset Name already exist" : '') || (err.response.data.tag ? "Tag Must Be Unique , Sorry! This Tag Already in use" : '')) }))
    }
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    var siteValue;
    for (var j = 0; j < this.state.siteData.length; j++) {
      if (this.state.siteData[j].site_id === this.state.site) {
        siteValue = this.state.siteData[j].id
      }
    }

    var tagValue;
    for (var i = 0; i < this.state.tagData.length; i++) {
      if (this.state.tagData[i].tag_id === this.state.tag) {
        tagValue = this.state.tagData[i].id
      }
    }
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = assetValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "asset_id=" + this.state.asset_id + "&asset_name=" + this.state.asset_name + "&asset_brand=" + this.state.asset_brand + "&owner_name=" + this.state.owner_name + "&owner_type=" + this.state.owner_type + "&tag=" + tagValue + "&site=" + siteValue + "&timestamp=" + this.state.timestamp;

      axios.put(`${BASE_URL}/${ASSET_API}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
              errors: undefined
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({ isSubmitted: false, errors: ((err.response.data.asset_name ? "Asset Name Must Be Unique, Sorry! This Asset Name already exist" : '') || (err.response.data.tag ? "Tag Must Be Unique , Sorry! This Tag Already in use" : '')) }))
    }
  }

  toggleDeleteModal(id) {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
  }

  handleChangeTag = () => {
    var e = document.getElementById("tag");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      tag: result
    })
  }

  handleChangeSite = () => {
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      site: result
    })
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

    const { asset_name, asset_id, asset_brand, owner_name, owner_type, isOpen, AssetData, openaddmodal, site, siteData, opendeleteModal, tag, tagData, errors, done } = this.state;
    console.log(site, tag)
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-ticket"></i> Asset Management
                <Button color='success' onClick={this.openAddModal} size='sm' className="card-header-actions">
                  <i className="fa fa-plus"></i> Add New Asset
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Asset Id</th>
                      <th>Asset Name</th>
                      <th>Tag</th>
                      <th>Site</th>
                      <th>Asset Brand</th>
                      <th>Owner Name</th>
                      <th>Owner Type</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {AssetData.map((item, i) => {

                      var timeNow = this.timeConverter(item.timestamp)
                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1}</td>
                        <td>{item.asset_id}</td>
                        <td>{item.asset_name}</td>
                        <td>{item.tag}</td>
                        <td>{item.site}</td>
                        <td>{item.asset_brand}</td>
                        <td>{item.owner_name}</td>
                        <td>{item.owner_type}</td>
                        <td>{timeNow}</td>
                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                          <button className='btn btn-primary btn-sm'
                            onClick={this.openEditModal.bind(this, item.id, item.asset_id, item.asset_name, item.asset_brand, item.owner_name, item.owner_type, item.tag, item.site)} >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, item.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>Delete Asset </ModalHeader>
                            <ModalBody>Are you want to delete this Asset ?</ModalBody>
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



        <Modal isOpen={isOpen} fade={false} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Assets</ModalHeader>
          <ModalBody>
            <form>

              <FormGroup>
                <Label htmlFor="asset_id">Asset ID<span /> </Label>
                <Input type="text" name="asset_id" value={asset_id} disabled={true} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_name">Asset Name<span /> </Label>
                <Input type="text" name="asset_name" value={asset_name} onChange={this.handleChange} placeholder="Asset Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_brand">Asset Brand<span /> </Label>
                <Input type="text" name="asset_brand" value={asset_brand} onChange={this.handleChange} placeholder="Asset Brand" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="owner_name">Owner Name<span /> </Label>
                <Input type="text" name="owner_name" value={owner_name} onChange={this.handleChange} placeholder="Owner Name " />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="owner_type">Owner Type<span /> </Label>
                <Input type="text" name="owner_type" value={owner_type} onChange={this.handleChange} placeholder="Owner Type" />
              </FormGroup>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="tag">Tag<span /> </Label>
                    <select className="form-control" type="select" name="tag" id="tag" value={tag} onChange={this.handleChangeTag} placeholder="Tag">
                      <option className="brave" value="" disabled defaultValue>Select Tag</option>
                      {tagData.map((tag, i) => (
                        <option key={i} value={tag.id}> {tag.tag_id} </option>))}
                    </select>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="site">Site<span /> </Label>
                    <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                      <option className="brave" value="" disabled defaultValue>Select Site</option>
                      {siteData.map((sit, i) => (
                        <option key={i} value={sit.id}> {sit.site_id} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Button color="info" block onClick={this.handleEditSubmit} type="submit"> Done</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>

        <Modal isOpen={openaddmodal} toggle={this.openAddModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ openaddmodal: false })}>Add New Asset</ModalHeader>
          <ModalBody>
            <form>

              <FormGroup>
                <Label >Asset ID<span /> </Label>
                <Input type="text" name="asset_id" value={asset_id.trim()} onChange={this.handleChange} placeholder="Asset Id" />
              </FormGroup>
              <FormGroup>
                <Label htmlFor="asset_name">Asset Name<span /> </Label>
                <Input type="text" name="asset_name" value={asset_name} onChange={this.handleChange} placeholder="Asset Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_brand">Asset Brand<span /> </Label>
                <Input type="text" name="asset_brand" value={asset_brand} onChange={this.handleChange} placeholder="Asset Brand" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="owner_name">Owner Name<span /> </Label>
                <Input type="text" name="owner_name" value={owner_name} onChange={this.handleChange} placeholder="Owner Name " />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="owner_type">Owner Type<span /> </Label>
                <Input type="text" name="owner_type" value={owner_type} onChange={this.handleChange} placeholder="Owner Type" />
              </FormGroup>

              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="tag">Tag<span /> </Label>
                    <Input type="select" name="tag" id="tag" value={tag} onChange={this.handleChangeTag} placeholder="Tag">
                      <option className="brave" value="" disabled defaultValue>Select Tag</option>
                      {tagData.map((tag, i) => (
                        <option key={i} value={tag.id}> {tag.tag_id} </option>))}
                    </Input>
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="site">Site<span /> </Label>
                    <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                      <option className="brave" value="" disabled defaultValue>Select Site</option>
                      {siteData.map((sit, i) => (
                        <option key={i} value={sit.id}> {sit.site_id} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <Button color="success" block onClick={this.handleAddSubmit.bind(this)} type='submit'>ADD ASSET</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {

  }
}

const mapDispatchToProps = dispatch => { }


export default connect(mapStateToProps, mapDispatchToProps)(AssetManagement);
