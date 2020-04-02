import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';
import { BASE_URL, PORT, SITES_API, ASSET_BY_SITE, ReportAPI } from '../../../Config/Config'
import axios from 'axios'
import ReportValidation from './Validator'

export default class GeneralReports extends Component {
  _isMounted = false
  constructor(props) {
    super(props);
    this.state = {
      siteData: [], assetsData: [], redirect: false, siteValue: '', errors: '', isSubmitted: false,
      assetValue: '', fromDate: '', toDate: '', reportData: undefined, rowsPerPage: 15,
      page: 0, count: 0, done: false, openDataCard: false,
    }

  }
  componentDidMount() {
    this._isMounted = true;
    this.setState({ done: true })
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({ siteData: res.data.results, done: false })
        }
      })
      .catch(err => {
        if (err.response.data.detail === "Authentication credentials were not provided.") {
          localStorage.removeItem('accessToken');
          this.setState({ redirect: true })
        } else return err
      })
  }
  componentWillUnmount() {
    this._isMounted = false;
  }

  handleEmpty = () => {
    this.setState({ siteValue: '', assetValue: '', fromDate: '', toDate: '' })
  }
  handleChange = () => {
    this.handleEmpty()
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      siteValue: result, errors: undefined
    })
    this.handleChangeAssets(result);
  }
  handleChangeAst = () => {
    let e = document.getElementById("asset");
    let result = e.options[e.selectedIndex].value;
    this.setState({
      assetValue: result, errors: undefined
    })
  }
  handleChangeDate = (e) => {
    let name = e.target.name;
    let value = e.target.value;
    this.setState({
      [name]: value
    })

  }

  handleChangeAssets = (id) => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}:${PORT}/${ASSET_BY_SITE}${id}`, { headers })
      .then(res => {
        if (this._isMounted) {
          this.setState({
            assetsData: res.data
          })
        }
      }).catch(err => err)
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });
    const { isValid, errors } = ReportValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      var token = localStorage.getItem('accessToken');
      var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
      const { siteValue, assetValue, fromDate, toDate } = this.state;
      const fromTime = (new Date(fromDate).getTime()) / 1000;
      const toTime = (new Date(toDate).getTime()) / 1000 + 86400;
      let body = "site_id=" + siteValue + "&asset_id=" + assetValue + "&from_time=" + fromTime + "&to_time=" + toTime;
      axios.post(`${BASE_URL}:${PORT}/${ReportAPI}`, body, { headers })
        .then(res => {
          if (res.status === 200) {
            var arr = [];
            for (var i = 0; i < res.data.length; i++) {
              arr.unshift({ site_name: res.data[i][0], asset_name: res.data[i][1], event: res.data[i][2] })
            }
            this.setState({
              reportData: arr,
              isSubmitted: true,
              errors: undefined,
              count: res.data.length,
              openDataCard: false,
            })
          }
        }).catch(err => err)

    };
  }

  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage });
  }


  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: +event.target.value, page: 0 });
  };

  openDataCard = () => {
    this.setState({ openDataCard: true })
  }
  closeDataCard = () => {
    this.setState({ openDataCard: false })
  }


  render() {
    const { siteValue, assetValue, siteData, assetsData, fromDate, toDate, errors, reportData, page, rowsPerPage, count, done, openDataCard } = this.state;
    const sitesData = siteData.map((item, i) => (
      <option key={i} value={item.id}>{item.site_name}</option>
    ))

    const assetData = assetsData.map((item, i) => (
      <option key={i} value={item[10]}>{item[1]}</option>
    ))
    return (
      <div className="animated fadeIn">
        {!openDataCard ? <Card>
          <CardHeader>  <i className="fa fa-clipboard"></i>General Report
            <Button color='success' size='sm' className="card-header-actions" onClick={this.openDataCard}>
              <a>
                <i className="fa fa-plus"></i> Get Report
              </a>
            </Button></CardHeader>
          <CardBody>
            {!done ?
              <Table hover bordered striped responsive size="sm" >
                <thead>
                  <tr>
                    <th style={{ width: '10%' }}>Sr#</th>
                    <th style={{ width: '20%' }}>Site</th>
                    <th style={{ width: '20%' }}>Asset</th>
                    <th style={{ width: '50%' }}>Event</th>
                  </tr>
                </thead>
                <tbody>
                  {reportData !== undefined ? reportData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((item, i) => (
                    <tr key={i}>
                      <td>{i + 1 + rowsPerPage * page}</td>
                      <td>{item.site_name}</td>
                      <td>{item.asset_name}</td>
                      <td>{item.event}</td>
                    </tr>))
                    : undefined}
                </tbody>
              </Table> : ''}
            {reportData === undefined ? <p style={{ textAlign: 'center', color: 'red' }}>
              Please! Click on Get Report and Fill All Requirements </p> : count === 0 ? <p style={{ textAlign: 'center', color: 'red' }}>
                No Requested Data Available Right Now</p> : ''}

          </CardBody>
        </Card> :
          <Row className="justify-content-center">
            <Col lg="5" xl="6">
              <Card className="mx-4">
                <CardHeader>  <i className="fa fa-align-justify"></i>Get Report
            <     Button color='danger' size='sm' className="card-header-actions" onClick={this.closeDataCard}>
                    close
                  </Button></CardHeader>
                <CardBody>
                  <form>
                    <FormGroup>
                      <Label htmlFor="company">Site</Label>
                      <Input type="select" id="site" name="site" onChange={this.handleChange} value={siteValue} placeholder="Select Site">
                        <option value='' disabled defaultValue>Select Site</option>
                        {sitesData}
                      </Input>
                    </FormGroup>
                    {siteValue ? <FormGroup>
                      <Label htmlFor="site">Select Asset</Label>
                      <Input type="select" id="asset" name="asset" onChange={this.handleChangeAst} value={assetValue} placeholder="Select Asset" >
                        <option disabled value=''>Select Asset</option>
                        {assetData}
                        <option value={0}>All Assets</option>
                      </Input>
                    </FormGroup> : ''}
                    {assetValue ? <FormGroup>
                      <Label htmlFor="street">From Date</Label>
                      <Input type='date' name='fromDate' onChange={this.handleChangeDate} value={fromDate} />
                    </FormGroup> : ''}
                    {fromDate ? <FormGroup>
                      <Label htmlFor="street">To Date</Label>
                      <Input type='date' name='toDate' onChange={this.handleChangeDate} value={toDate} />
                    </FormGroup> : ''}
                    {fromDate ? <FormGroup>
                      <Button color="info" block type="submit" onClick={this.handleSubmit}>Generate Report</Button>
                    </FormGroup> : ''}
                  </form>
                  {errors ? <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{errors}</p> : ''}
                </CardBody>
              </Card>
            </Col>
          </Row>}

      </div>
    )
  }
}
