import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Modal, ModalBody, ModalHeader, ModalFooter, Button, Spinner } from 'reactstrap';
import axios from 'axios'; import { Pagination } from 'antd';
import { BASE_URL, SITES_API, SITE_CONFIG, FORMAT } from '../../../Config/Config'
import siteConfigValidation from './Validator'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
export default class SiteConfiguration extends Component {
  state = {
    siteConfigData: [], opendeleteModal: false, isOpen: false,
    openaddmodal: false, errors: undefined, isSubmitted: false, delId: '', currentPage: 1, sitePerPage: 10,
    id: undefined, siteData: [],
    uuid: undefined,
    tag_missing_timeout: undefined,
    site_heartbeat_interval: undefined,
    low_battery_threshold: undefined,
    high_temp_threshold: undefined,
    low_temp_threshold: undefined,
    power_down_alert_interval: undefined,
    site: undefined
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${SITE_CONFIG}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          var data = [...res.data.data]
          this.setState({
            siteConfigData: data
          })
        }
      }).catch(err => {
        if (err.status === 401) {
          localStorage.removeItem('accessToken');
          this.props.history.push('/login')
        }
        return err
      })

    axios.get(`${BASE_URL}/${SITES_API}/${FORMAT}`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            siteData: res.data.data
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

  toggleDeleteModal(id) {
    const currentState = this.state.opendeleteModal;
    this.setState({ opendeleteModal: !currentState, delId: id })
  }

  openAddModal = () => {
    this.handleEmpty();
    const currentState = !this.state.openaddmodal
    this.setState({
      openaddmodal: currentState,
      errors: undefined
    })
  }

  openEditModal = (id, uu, tmt, shi, lbu, htt, ltt, pdai, s) => {
    const currentState = !this.state.isOpen
    this.setState({
      isOpen: currentState,
      id: id,
      uuid: uu,
      tag_missing_timeout: tmt,
      site_heartbeat_interval: shi,
      low_battery_threshold: lbu,
      high_temp_threshold: htt,
      low_temp_threshold: ltt,
      power_down_alert_interval: pdai,
      site: s
    })
  }

  handleChange = (event) => {
    let name = event.target.name;
    let val = event.target.value;
    this.setState({ [name]: val, errors: "" });
  }

  removerow = () => {
    axios.delete(`${BASE_URL}/${SITE_CONFIG}/${this.state.delId}/`, { headers }).then(res => {
      var index = this.state.delId;
      const items = this.state.siteConfigData.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({ siteConfigData: items })
      }
    }).catch(err => err)
  }

  handleEditSubmit = (e) => {
    e.preventDefault();

    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = siteConfigValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      let body = "uuid=" + this.state.uuid + "&tag_missing_timeout=" + this.state.tag_missing_timeout
        + "&site_heartbeat_interval=" + this.state.site_heartbeat_interval + "&low_battery_threshold="
        + this.state.low_battery_threshold + "&low_temp_threshold=" + this.state.low_temp_threshold +
        "&high_temp_threshold=" + this.state.high_temp_threshold + "&site=" + this.state.site +
        "&power_down_alert_interval=" + this.state.power_down_alert_interval;

      axios.put(`${BASE_URL}/${SITE_CONFIG}/${this.state.id}/`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            this.setState({
              isSubmitted: true,
              isOpen: false,
              loading: false
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({
          isSubmitted: false, loading: false, errors: ((err.response.data.uuid ? "Sorry! This UUID already exist" : '')
            || (err.response.data.site ? "Sorry! This site already in use" : '')
            || (err.response.data.tag_missing_timeout ? "Tag missing timeout: " + err.response.data.tag_missing_timeout : '')
            || (err.response.data.site_heartbeat_interval ? "Site heartbeat interval: " + err.response.data.site_heartbeat_interval : '')
            || (err.response.data.low_battery_threshold ? "Low battery threshold: " + err.response.data.low_battery_threshold : '')
            || (err.response.data.high_temp_threshold ? "High temperature threshold: " + err.response.data.high_temp_threshold : '')
            || (err.response.data.low_temp_threshold ? "Low temperature threshold: " + err.response.data.low_temp_threshold : '')
            || (err.response.data.power_down_alert_interval ? "Power down alert interval: " + err.response.data.power_down_alert_interval : '')
          )
        }))
    }
  }

  handleAddSubmit(e) {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = siteConfigValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {

      let body = "uuid=" + this.state.uuid + "&tag_missing_timeout=" + this.state.tag_missing_timeout
        + "&site_heartbeat_interval=" + this.state.site_heartbeat_interval + "&low_battery_threshold="
        + this.state.low_battery_threshold + "&low_temp_threshold=" + this.state.low_temp_threshold +
        "&high_temp_threshold=" + this.state.high_temp_threshold + "&site=" + this.state.site +
        "&power_down_alert_interval=" + this.state.power_down_alert_interval;

      axios.post(`${BASE_URL}/${SITE_CONFIG}/`, body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err => this.setState({
          isSubmitted: false, errors: ((err.response.data.uuid ? "Sorry! This UUID already exist" : '')
            || (err.response.data.site ? "Sorry! This site already in use" : '')
            || (err.response.data.tag_missing_timeout ? "Tag missing timeout: " + err.response.data.tag_missing_timeout : '')
            || (err.response.data.site_heartbeat_interval ? "Site heartbeat interval: " + err.response.data.site_heartbeat_interval : '')
            || (err.response.data.low_battery_threshold ? "Low battery threshold: " + err.response.data.low_battery_threshold : '')
            || (err.response.data.high_temp_threshold ? "High temperature threshold: " + err.response.data.high_temp_threshold : '')
            || (err.response.data.low_temp_threshold ? "Low temperature threshold: " + err.response.data.low_temp_threshold : '')
            || (err.response.data.power_down_alert_interval ? "Power down alert interval: " + err.response.data.power_down_alert_interval : '')
          )
        }))
    }

  }

  handleChangeSite = () => {
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      site: result
    })
  }

  handleEmpty = () => {
    this.setState({
      uuid: '',
      tag_missing_timeout: '',
      site_heartbeat_interval: '',
      low_battery_threshold: '',
      high_temp_threshold: '',
      low_temp_threshold: '',
      power_down_alert_interval: '',
      site: ''
    })
  }

  paginate = pageNumber => {
    this.setState({
      currentPage: pageNumber
    })
  };

  render() {
    const { siteConfigData, opendeleteModal, openaddmodal, isOpen, uuid, tag_missing_timeout, site_heartbeat_interval, low_battery_threshold,
      high_temp_threshold, low_temp_threshold, power_down_alert_interval, site, errors, siteData, sitePerPage, currentPage, loading } = this.state;

    const indexOfLastAlert = currentPage * sitePerPage;
    const indexOfFirstAlert = indexOfLastAlert - sitePerPage;
    console.log(this.state.site, "ssssssss")

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-apple"></i> Site Configuration
                <Button color='success' onClick={this.openAddModal} size='sm' className="card-header-actions">
                  <i className="fa fa-plus"></i> Configure New Site
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm" className="table table-striped table-dark">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>UUID</th>
                      <th>Site</th>
                      <th>Tag Missing Timeout</th>
                      <th>Site Heartbeat Interval</th>
                      <th>Low Battery Threshold</th>
                      <th>High Temperature Threshold</th>
                      <th>Low Temperature Threshold</th>
                      <th>Power Down Alert Interval</th>
                      <th className='actions-col-css'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteConfigData.slice(indexOfFirstAlert, indexOfLastAlert).map((item, i) => {

                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1 + (currentPage - 1) * sitePerPage}</td>
                        <td>{item.uuid}</td>
                        <td>{item.site}</td>
                        <td>{item.tag_missing_timeout}</td>
                        <td>{item.site_heartbeat_interval}</td>
                        <td>{item.low_battery_threshold}</td>
                        <td>{item.high_temp_threshold}</td>
                        <td>{item.low_temp_threshold}</td>
                        <td>{item.power_down_alert_interval}</td>
                        <td>

                          <button className='btn btn-primary btn-sm btn-margin'
                            onClick={this.openEditModal.bind(this, item.id, item.uuid, item.tag_missing_timeout, item.site_heartbeat_interval,
                              item.low_battery_threshold, item.high_temp_threshold, item.low_temp_threshold, item.power_down_alert_interval, item.site)} >
                            <i className='fa fa-edit fa-lg'></i></button>
                          <button className='btn btn-danger btn-sm'
                            onClick={this.toggleDeleteModal.bind(this, item.id)}>
                            <i className='fa fa-trash fa-lg'></i></button>

                          <Modal isOpen={opendeleteModal} toggle={this.toggleDeleteModal} backdrop={false}>
                            <ModalHeader toggle={() => this.setState({ opendeleteModal: false })}>Delete Configuration </ModalHeader>
                            <ModalBody>Are you want to delete this Configured Site ?</ModalBody>
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
          defaultCurrent={2}
          pageSize={sitePerPage}
          total={siteConfigData.length}
          onChange={this.paginate} />


        <Modal isOpen={isOpen} fade={false} toggle={this.openEditModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ isOpen: false })}>Edit Configuration</ModalHeader>
          <ModalBody>
            <form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="uuid">UUID<span /> </Label>
                    <Input type="text" name="uuid" id="uuid" value={uuid} onChange={this.handleChange} />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="site">Site<span /> </Label>
                    <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site" disabled={true}>
                      <option className="brave" value="" disabled defaultValue>Select Site</option>
                      {siteData.map((sit, i) => (
                        <option key={i} value={sit.id}> {sit.site_name} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label htmlFor="tag_missing_timeout">Tag Missing Timeout<span /> </Label>
                <Input type="number" name="tag_missing_timeout" value={tag_missing_timeout} onChange={this.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_heartbeat_interval">Site Heartbeat Interval<span /> </Label>
                <Input type="number" name="site_heartbeat_interval" value={site_heartbeat_interval} onChange={this.handleChange} />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="low_battery_threshold">Low Battery Threshold<span /> </Label>
                <Input type="number" name="low_battery_threshold" value={low_battery_threshold} onChange={this.handleChange} />
              </FormGroup>

              <Row form>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="high_temp_threshold">High Temperature Threshold<span /> </Label>
                    <Input type="number" name="high_temp_threshold" value={high_temp_threshold} onChange={this.handleChange} />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="low_temp_threshold">Low Temperature Threshold<span /> </Label>
                    <Input type="number" name="low_temp_threshold" value={low_temp_threshold} onChange={this.handleChange} />
                  </FormGroup>
                </Col>

              </Row>
              <FormGroup>
                <Label htmlFor="power_down_alert_interval">Power Down Alert Interval<span /> </Label>
                <Input type="number" name="power_down_alert_interval" value={power_down_alert_interval} onChange={this.handleChange} />
              </FormGroup>
              {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} >
                <Spinner color='info' size='lg' /></div> :
                <Button color="info" block onClick={this.handleEditSubmit} type="submit"> Done</Button>}
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>


        <Modal isOpen={openaddmodal} toggle={this.openAddModal} backdrop={false}>
          <ModalHeader toggle={() => this.setState({ openaddmodal: false })}>Add New Configuration</ModalHeader>
          <ModalBody>
            <form>
              <Row form>
                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="uuid">UUID<span /> </Label>
                    <Input type="text" name="uuid" id="uuid" value={uuid} onChange={this.handleChange} placeholder='uuid' />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="site">Site<span /> </Label>
                    <Input type="select" name="site" id="site" value={site} onChange={this.handleChangeSite} placeholder="Site">
                      <option className="brave" value="" disabled defaultValue>Select Site</option>
                      {siteData.map((sit, i) => (
                        <option key={i} value={sit.id}> {sit.site_name} </option>))}
                    </Input>
                  </FormGroup>
                </Col>
              </Row>

              <FormGroup>
                <Label htmlFor="tag_missing_timeout">Tag Missing Timeout<span /> </Label>
                <Input type="number" name="tag_missing_timeout" value={tag_missing_timeout} onChange={this.handleChange} placeholder='Tag Missing Timeout' />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="site_heartbeat_interval">Site Heartbeat Interval<span /> </Label>
                <Input type="number" name="site_heartbeat_interval" value={site_heartbeat_interval} onChange={this.handleChange} placeholder='Site Heartbeat Interval' />
              </FormGroup>

              <FormGroup>
                <Label htmlFor="low_battery_threshold">Low Battery Threshold<span /> </Label>
                <Input type="number" name="low_battery_threshold" value={low_battery_threshold} onChange={this.handleChange} placeholder='Low Battery Threshold' />
              </FormGroup>

              <Row form>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="high_temp_threshold">High Temperature Threshold<span /> </Label>
                    <Input type="number" name="high_temp_threshold" value={high_temp_threshold} onChange={this.handleChange} placeholder='High Temperature Threshold' />
                  </FormGroup>
                </Col>

                <Col md={6}>
                  <FormGroup>
                    <Label htmlFor="low_temp_threshold">Low Temperature Threshold<span /> </Label>
                    <Input type="number" name="low_temp_threshold" value={low_temp_threshold} onChange={this.handleChange} placeholder='Low Temperature Threshold' />
                  </FormGroup>
                </Col>

              </Row>
              <FormGroup>
                <Label htmlFor="power_down_alert_interval">Power Down Alert Interval<span /> </Label>
                <Input type="number" name="power_down_alert_interval" value={power_down_alert_interval} onChange={this.handleChange} placeholder='Power Down Alert Interval' />
              </FormGroup>

              <Button color="success" block onClick={this.handleAddSubmit.bind(this)} type='submit'>Add Configuration</Button>
              {errors ? <span style={{ color: 'red', margin: "auto", fontSize: '12px' }}>{errors}</span> : ""}
            </form>
          </ModalBody>
        </Modal>
      </div>
    )
  }
}
