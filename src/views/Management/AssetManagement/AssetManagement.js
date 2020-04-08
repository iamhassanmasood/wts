import React, { Component } from 'react';
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, ASSET_API, SITES_API } from '../../../Config/Config'
import assetValidation from './Validator'
import axios from 'axios'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
class AssetManagement extends Component {

  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      openaddmodal: false,
      isOpen: false,
      opendeleteModal: false,
      backdrop: true,
      asset_id: "",
      asset_name: '',
      asset_brand: '',
      asset_owner_name: '',
      asset_owner_type: '',
      page: 0,
      rowsPerPage: 10,
      timestamp: Math.floor(Date.now() / 1000),
      siteData: [],
      site: '',
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
    this._isMounted = true;
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${ASSET_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            data: res.data.results,
            asset_id: '',
            asset_name: '',
            asset_brand: '',
            asset_owner_name: '',
            asset_owner_type: '',
            redirect: false
          })
        }
      })
      .catch(err => {
        if (err.response.data.detail === "Authentication credentials were not provided.") {
          localStorage.removeItem('accessToken');
          this.setState({ redirect: true })
        } else return err
      })

    axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            siteData: res.data.results.sort((a, b) => b.timestamp - a.timestamp),
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
      const items = this.state.data.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({ data: items })
      }
    }).catch(err => {
      if (err.response.data.detail === "Authentication credentials were not provided.") {
        localStorage.removeItem('accessToken');
        this.setState({ redirect: true })
      } else return err
    })
  }

  openEditModal = (id, ai, an, aon, ab, aot, s) => {
    const currentState = !this.state.isOpen
    this.setState({
      isOpen: currentState,
      id: id,
      asset_id: ai,
      asset_brand: ab,
      asset_name: an,
      asset_owner_name: aon,
      asset_owner_type: aot,
      site: s,
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
      asset_owner_name: '',
      asset_owner_type: '',
      site: '',
    })
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = assetValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "asset_id=" + this.state.asset_id + "&asset_name=" + this.state.asset_name + "&asset_brand=" + this.state.asset_brand + "&asset_owner_name=" +
        this.state.asset_owner_name + "&asset_owner_type=" + this.state.asset_owner_type + "&site=" + this.state.site + "&timestamp=" + this.state.timestamp;
      axios.post(`${BASE_URL}/${ASSET_API}/`, body, { headers })
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
          if (err.response.data.asset_id) {
            this.setState({ errors: "Oops! Asset ID already exists ", isSubmitted: false })
          } else if (err.response.data.asset_name) {
            this.setState({ errors: "Oops! AssetName already exists ", isSubmitted: false })
          }
        })
    }
  }

  handleEditSubmit = (e) => {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = assetValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = `asset_id=+${this.state.asset_id}+&asset_name=+${this.state.asset_name}+&asset_brand=+${this.state.asset_brand}+&asset_owner_name=+${this.state.asset_owner_name}+&asset_owner_type=+${this.state.asset_owner_type}+&timestamp=${this.state.timestamp}+&site=+${this.state.site}`;
      axios.put(`${BASE_URL}/${ASSET_API}/${this.state.id}/`, body, { headers })
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
          if (err.response.data.asset_id) {
            this.setState({ errors: "Oops! AssetID already exists ", isSubmitted: false })
          } else if (err.response.data.asset_name) {
            this.setState({ errors: "Oops! AssetName already exists ", isSubmitted: false })
          }
        }
        )
    }
  }

  toggleDeleteModal(id) {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
  }

  handleChangeSite = () => {
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      site: result
    })
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

    const { asset_name, asset_id, asset_brand, asset_owner_name, asset_owner_type, isOpen, data, openaddmodal, page, rowsPerPage, opendeleteModal, site, siteData, errors, done } = this.state;

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
                      <th>Site</th>
                      <th>Asset Brand</th>
                      <th>Owner Name</th>
                      <th>Owner Type</th>
                      <th>Created At</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((rd, i) => {
                      var sName = this.state.siteData[this.state.siteData.findIndex(x => x.id === parseInt(rd.site))]
                      if (sName) {
                        var site_name = sName.site_name;
                      }

                      var timeNow = this.timeConverter(rd.timestamp)
                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1 + rowsPerPage * page}</td>
                        <td>{rd.asset_id}</td>
                        <td>{rd.asset_name}</td>
                        <td>{site_name}</td>
                        <td>{rd.asset_brand}</td>
                        <td>{rd.asset_owner_name}</td>
                        <td>{rd.asset_owner_type}</td>
                        <td>{timeNow}</td>
                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                          <button className='btn btn-primary btn-sm'
                            onClick={this.openEditModal.bind(this, rd.id, rd.asset_id, rd.asset_name, rd.asset_brand, rd.asset_owner_name, rd.asset_owner_type, rd.site)} >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, rd.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>Delete Asset </ModalHeader>
                            <ModalBody>Are you want to delete this Asset ?</ModalBody>
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
                <Input type="text" name="asset_name" value={asset_name} onChange={this.handleChange} placeholder="Site Name" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_brand">Asset Brand<span /> </Label>
                <Input type="text" name="asset_brand" value={asset_brand} onChange={this.handleChange} placeholder="Asset Brand" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_owner_name">Asset Owner Name<span /> </Label>
                <Input type="text" name="asset_owner_name" value={asset_owner_name} onChange={this.handleChange} placeholder="Asset Owner Name " />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_owner_type">Asset Owner Type<span /> </Label>
                <Input type="text" name="asset_owner_type" value={asset_owner_type} onChange={this.handleChange} placeholder="Asset Owner Type" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site">Site<span /> </Label>
                <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                  <option className="brave" value="" disabled defaultValue>Select Site</option>
                  {siteData.map((sit, i) => (
                    <option key={i} value={sit.id}> {sit.site_name} </option>))}
                </Input>
              </FormGroup>
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
                <Label htmlFor="asset_owner_name">Asset Owner Name<span /> </Label>
                <Input type="text" name="asset_owner_name" value={asset_owner_name} onChange={this.handleChange} placeholder="Asset Owner Name " />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="asset_owner_type">Asset Owner Type<span /> </Label>
                <Input type="text" name="asset_owner_type" value={asset_owner_type} onChange={this.handleChange} placeholder="Asset Owner Type" />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site">Site<span /> </Label>
                <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                  <option value="" disabled defaultValue>Select Site</option>
                  {siteData.map((sit, i) => (
                    <option key={i} value={sit.id}> {sit.site_name} </option>))}
                </Input>
              </FormGroup>

              <Button color="success" block onClick={this.handleAddSubmit.bind(this)} type='submit'>ADD ASSET</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    );
  }
}

export default AssetManagement;
