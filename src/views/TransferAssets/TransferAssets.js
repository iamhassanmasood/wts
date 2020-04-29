import React, { Component } from 'react';
import { Container, Card, CardBody, CardHeader, Col, Row, FormGroup, Input, Label, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, SITES_API, ASSET_BY_SITE, TRANSFER_ASSET } from '../../config/config'
import transferValidation from './Validator'
import axios from 'axios'

class TransferAssets extends Component {

  state = {
    sites: [],
    assets: [],
    open: false,
    transfer: false,
    siteVal: '',
    assetVal: '',
    toSite: '',
    isSubmitted: false,
    errors: undefined,
    redirect: false,
    done: false,
    loading: false
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    this.setState({ done: true })
    axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          const data = [...res.data]
          this.setState({
            sites: data,
            done: false
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

  toggleModal = (e) => {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = transferValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      this.setState({
        open: true
      })
    };
  };

  toggleModalSuccess = () => {
    this.setState({
      transfer: !this.state.transfer
    });
  };
  handleEmpty = () => {
    this.setState({
      siteVal: '',
      assetVal: '',
      toSite: ''
    })
  }

  handleChange = () => {
    this.handleEmpty()
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      siteVal: result, errors: undefined, assetVal: ''
    })
    // this.handleChangeAssets(result);
  }

  handleChangeAssets = (id) => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${ASSET_BY_SITE}${id}`, { headers })
      .then(res => {
        this.setState({ loading: true })
        if (res.status === 200) {
          this.setState({
            assets: res.data,
            loading: false
          })
        }
      }).catch(err => {
        if (err.response.status === 401) {
          return localStorage.removeItem('accessToken')
        }
        return err
      })
  }

  handleChangeAst = () => {
    let e = document.getElementById("asset");
    let result = e.options[e.selectedIndex].value;
    this.setState({
      assetVal: result, errors: ""
    })
  }
  handleChangeToSite = () => {
    var e = document.getElementById("tosite");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      toSite: result, errors: ""
    })
  }

  handleSubmit = (e) => {
    e.preventDefault();
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    let body = "asset_id=" + this.state.assetVal + "&site_id=" + this.state.toSite;
    axios.post(`${BASE_URL}/${TRANSFER_ASSET}`, body, { headers })
      .then(res => {
        this.setState({ done: true })
        if (res.status === 200) {
          this.setState({
            open: false,
            transfer: true,
            siteVal: '',
            assetVal: '',
            toSite: '',
            done: false
          });
          setTimeout(() => this.setState({ transfer: false }), 2000)
        }
      }).catch(err => {
        if (err.response.status === 401) {
          localStorage.removeItem('accessToken');
        }
        return err
      })
  }


  render() {
    const { open, transfer, sites, assets, siteVal, assetVal, toSite, errors, done, loading } = this.state
    const sitesData = sites.map((item, i) => (
      <option key={i} value={item.id}>{item.site_name}</option>
    ))
    const assetData = assets.map((item, i) => (
      <option key={i} value={item[10]}>{item[1]}</option>
    ))
    const toSitesData = sites.map((item, i) => (
      <option key={i} value={item.id}>{item.site_name}</option>
    ))

    return (
      <div className="flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col lg="7" xl="8">
              <Card className="mx-4">
                <CardHeader> <i className="fa fa-exchange"></i>Transfer Asset</CardHeader>
                <CardBody className="p-4" style={{ backgroundColor: 'white', color: "black" }}>
                  <form>
                    <FormGroup>
                      <Label htmlFor="company">From Site</Label>
                      <Input type="select" id="site" name="site" onChange={this.handleChange} value={siteVal} placeholder="Select Site">
                        <option value='' disabled defaultValue>Select Site</option>
                        {sitesData}
                      </Input>
                    </FormGroup>
                    {siteVal ? <FormGroup>
                      <Label htmlFor="vat">Select Asset</Label>
                      <Input type="select" id="asset" name="asset" onChange={this.handleChangeAst} value={assetVal} placeholder="Select Asset" >
                        <option disabled value=''>Select Asset</option>
                        {assetData}
                      </Input>
                    </FormGroup> : ''}
                    {assetVal ? <FormGroup>
                      <Label htmlFor="street">To Site</Label>
                      <Input type="select" id="tosite" name="tosite" onChange={this.handleChangeToSite} value={toSite} placeholder="Transfer Site" >
                        <option disabled value=''>Select Transferring Site </option>
                        {toSitesData}
                      </Input>
                    </FormGroup> : ''}
                    <FormGroup>
                      <Button color="primary" block type="submit" onClick={this.toggleModal}> Transfer Asset</Button>
                      {errors ? <span style={{ color: 'red', fontSize: '12px' }}>{errors}</span> : ''}
                      {transfer ? <span style={{ color: 'green', fontSize: '14px' }}>Asset Transferred Successfully!!!</span> : ''}
                    </FormGroup>
                  </form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
        <Modal isOpen={open} toggle={this.toggleModal} >
          <ModalHeader> Transfer Assets </ModalHeader>
          <ModalBody>Are you want to transfer Asset?</ModalBody>
          <ModalFooter>
            <Button type="submit" color="success" onClick={this.handleSubmit}> Yes</Button>
            <Button type="submit" color="primary" onClick={() => this.setState({ open: false })}> No</Button>
          </ModalFooter>
        </Modal>



      </div>
    );
  }
}

export default TransferAssets;
