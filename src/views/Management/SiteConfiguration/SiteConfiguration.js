import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import axios from 'axios'
import siteConfigValidation from './Validator'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
export default class SiteConfiguration extends Component {
  state = {
    siteConfigData: [], opendeleteModal: false, isOpen: false,
    openaddmodal: false, errors: undefined, isSubmitted: false, delId: '',
    id: undefined,
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
    axios.get('http://staging-wats.cs-satms.com/api/site_config/', { headers })
      .then(res => {
        if (res.status === 200) {
          var data = [...res.data.results]
          this.setState({
            siteConfigData: data
          })
        }
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

  openEditModal = (id, uuid, tmt, shi, lbu, htt, ltt, pdai, s) => {
    const currentState = !this.state.isOpen
    this.setState({
      isOpen: currentState,
      id: id,
      uuid: uuid,
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
    axios.delete('http://staging-wats.cs-satms.com/api/site_config/', { headers }).then(res => {
      var index = this.state.delId;
      const items = this.state.siteConfigData.filter(row => row.id !== index)
      if (res.status === 204) {
        this.setState({ siteConfigData: items })
      }
    }).catch(err => console.log(err, "this is what"))
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

      axios.put('http://staging-wats.cs-satms.com/api/site_config/', body, { headers })
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

      axios.post('http://staging-wats.cs-satms.com/api/site_config/', body, { headers })
        .then(res => {
          if (res.status === 201) {
            this.setState({
              isSubmitted: true,
              openaddmodal: false,
            })
            this.componentDidMount()
          }
        })
        .catch(err => err)
    }
  }



  render() {
    const { siteConfigData, opendeleteModal } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-apple"></i> Site Configuration
                <Button color='success' size='sm' className="card-header-actions">
                  <i className="fa fa-plus"></i> Configure New Site
                </Button>
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>UUid</th>
                      <th>Tag Missing Timeout</th>
                      <th>Heartbeat Interval</th>
                      <th>Low Battery Threshold</th>
                      <th>High Temperature</th>
                      <th>Low Temperature</th>
                      <th>Power Down Interval</th>
                      <th>Site</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {siteConfigData.map((item, i) => {

                      return <tr tabIndex={-1} key={i}>
                        <td>{i + 1}</td>
                        <td>{item.uuid}</td>
                        <td>{item.tag_missing_timeout}</td>
                        <td>{item.site_heartbeat_interval}</td>
                        <td>{item.low_battery_threshold}</td>
                        <td>{item.high_temp_threshold}</td>
                        <td>{item.low_temp_threshold}</td>
                        <td>{item.power_down_alert_interval}</td>
                        <td>{item.site}</td>
                        <td style={{ display: 'flex', justifyContent: 'space-evenly' }}>

                          <button className='btn btn-primary btn-sm'
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
      </div>
    )
  }
}
