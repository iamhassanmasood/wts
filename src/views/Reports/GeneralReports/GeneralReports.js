import React, { Component, Fragment } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Button } from 'reactstrap';
import { BASE_URL, PORT, SITES_API, ASSET_BY_SITE, REPORT_API } from '../../../config/config'
import axios from 'axios'
import ReportValidation from './Validator'
import { Pagination, DatePicker } from 'antd';
import Chart from 'react-apexcharts';
import ReactApexChart from 'react-apexcharts';

export default class GeneralReports extends Component {
  constructor(props) {
    super(props);
    this.state = {
      siteData: [], siteValue: '', errors: '', isSubmitted: false,
      reportData: undefined, rowsPerPage: 10,
      currentPage: 1, openDataCard: false,
      week: '', month: '', date: '', timeperiod: '', level: '', alertsReporting: [], statesReporting: [],

      optionPie: {
        labels: ['Registered Undiscovered', 'Registered Discovered', 'UnAuthorized Entry', 'Stolen', 'In Transit'],
        colors: ["#0992e1", "#fd3550", '#7f8281', "#1e5aa0", "#fb551d",],
        legend: {
          position: 'bottom',
          labels: {
            colors: 'white',
            useSeriesColors: false
          },
        },
        responsive: [{
          breakpoint: undefined,
          options: {
            chart: {
              sparkline: {
                enabled: true
              }
            }
          }
        }]
      },
      series: [{
        name: 'Asset',
        data: [40, 37, 48, 70, 54]
      }],
      optionsBar: {
        plotOptions: {
          bar: { distributed: true },
          dataLabels: { show: false }
        },
        colors: ["#0992e1", "#fd3550", '#7f8281', "#1e5aa0", "#fb551d",],
        legend: { position: 'bottom' },
        responsive: [
          {
            breakpoint: undefined,
            options: {
              chart: {
                sparkline: {
                  enabled: true
                }
              }
            }
          }],
        chart: {
          foreColor: '#fff',
          animations: {
            speed: 1600,
          },
        },
        xaxis: {
          categories: ['Registered Undiscovered', 'Registered Discovered', 'UnAuthorized Entry', 'Stolen', 'In Transit'],
          labels: { show: false }

        },
      },

    }

  }
  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          const data = [...res.data]
          this.setState({ siteData: data })
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

  handleEmpty = () => {
    this.setState({ siteValue: '' })
  }
  handleChange = () => {
    this.handleEmpty()
    var e = document.getElementById("site");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      siteValue: result, errors: undefined
    })
  }

  handleChangeDate = (d, ds) => {
    this.setState({
      date: ds, month: undefined, week: undefined
    })
  }

  handleChangeWeek = (w, ws) => {
    this.setState({
      week: ws, date: undefined, month: undefined
    })
  }

  handleChangeMonth = (m, ms) => {
    this.setState({
      month: ms, date: undefined, week: undefined
    })
  }

  handleChangeValue = (e) => {
    this.setState({
      timeperiod: e.target.value,
      week: '', month: '', date: '', errors: undefined,
    })
  }

  handleChangeLevel = (e) => {
    this.setState({
      level: e.target.value, errors: undefined,
    })
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
      var date;
      if (this.state.timeperiod === 'daily') {
        date = this.state.date
      } else if (this.state.timeperiod === 'weekly') {
        date = this.state.week
      } else if (this.state.timeperiod === 'monthly') {
        date = this.state.month
      }

      axios.get(`${BASE_URL}/${REPORT_API}/?level=${this.state.level}&report_type=${this.state.timeperiod}&date=${date}`, { headers })
        .then(res => {
          if (res.status === 200) {
            const alertsReporting = [...res.data.alerts_reporting]
            const statesReporting = [...res.data.states_reporting]
            this.setState({
              alertsReporting,
              statesReporting
            })
          }
        }).catch(err => err)

    };
  }
  paginate = pageNumber => {
    this.setState({
      currentPage: pageNumber
    })
  };

  render() {
    const { siteValue, siteData, errors, timeperiod, reportData, level, rowsPerPage, alertsReporting, statesReporting } = this.state;
    const sitesData = siteData.map((item, i) => (
      <option key={i} value={item.id}>{item.site_name}</option>
    ))
    var finalPie = [10, 20, 40, 50, 60]

    console.log(alertsReporting, "Alerts hy", statesReporting, "States hain")
    return (
      <div className="animated fadeIn">

        <CardHeader>  <i className="fa fa-clipboard"></i>Reporting </CardHeader>
        <br />
        <div className='col-lg-12' >
          <div className='row'>
            <Col xl='8' md='8' lg='5'>
              <ReactApexChart options={this.state.optionsBar} series={this.state.series} type="bar" width={`100%`} height={315} />
            </Col>
            <Col xl='4' md='4' lg='5'>
              <Chart options={this.state.optionPie} series={finalPie} type="pie" width={`100%`} height={350} />
            </Col>
          </div>
        </div>
        <Card>
          <CardHeader> Alerts </CardHeader>
          <CardBody>
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
                {reportData !== undefined ? reportData.map((item, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>{item.site_name}</td>
                    <td>{item.asset_name}</td>
                    <td>{item.event}</td>
                  </tr>))
                  : undefined}
              </tbody>
            </Table>
            {/* <Pagination
              defaultCurrent={2}
              pageSize={rowsPerPage}
              total={etcdata.length}
              onChange={this.paginate} /> */}

          </CardBody>
        </Card>
        <Row className="justify-content-center">
          <Col lg="6" xl="6">
            <Card className="mx-12">
              <CardHeader>  <i className="fa fa-clipboard"></i>Reports Form.</CardHeader>
              <CardBody style={{ backgroundColor: "white", color: 'black' }}>
                <form>
                  <Row className="m-auto">
                    <Col><FormGroup> <Label> <Input type="radio" name="radio1" onChange={this.handleChangeLevel} checked={level === "network"} value='network' /> Network Level </Label></FormGroup> </Col>
                    <Col><FormGroup> <Label> <Input type="radio" name="radio1" onChange={this.handleChangeLevel} checked={level === "site"} value='site' /> Site Level </Label></FormGroup> </Col>
                    <Col><FormGroup> <Label> <Input type="radio" name="radio1" onChange={this.handleChangeLevel} checked={level === "asset"} value='asset' />  Asset Level </Label></FormGroup> </Col>
                  </Row>


                  <FormGroup>
                    <Label htmlFor="company">Site</Label>
                    <Input type="select" id="site" name="site" onChange={this.handleChange} value={siteValue} placeholder="Select Site">
                      <option value='' disabled defaultValue>Select Site</option>
                      {sitesData}
                    </Input>
                  </FormGroup>

                  <Row className="m-auto">
                    <Col><FormGroup> <Label> <Input type="radio" name="radio2" onChange={this.handleChangeValue} id="daily" checked={timeperiod === "daily"} value="daily" /> Daily </Label></FormGroup> </Col>
                    <Col><FormGroup> <Label> <Input type="radio" name="radio2" onChange={this.handleChangeValue} id="weekly" checked={timeperiod === "weekly"} value="weekly" /> Weekly </Label></FormGroup> </Col>
                    <Col><FormGroup> <Label> <Input type="radio" name="radio2" onChange={this.handleChangeValue} id="monthly" checked={timeperiod === "monthly"} value="monthly" />  Monthly </Label></FormGroup> </Col>
                  </Row>

                  <FormGroup>
                    {timeperiod === "daily" ?
                      <Fragment>
                        <Label>Date</Label><br />
                        <DatePicker className="col-lg-12" format={"DD-MM-YYYY"}
                          bordered={true} name='d' onChange={(d, ds) => this.handleChangeDate(d, ds)} />
                      </Fragment>
                      : ''}

                    {timeperiod === "weekly" ?
                      <Fragment>
                        <Label>Week</Label><br />
                        <DatePicker
                          className="col-lg-12" picker="week" format={"WW-YYYY"}
                          bordered={true} name='w' onChange={(w, ws) => this.handleChangeWeek(w, ws)} />
                      </Fragment> : ''}

                    {timeperiod === "monthly" ?
                      <Fragment>
                        <Label>Month</Label><br />
                        <DatePicker className="col-lg-12" picker="month" format={"MM-YYYY"}
                          bordered={true} name='m' onChange={(m, ms) => this.handleChangeMonth(m, ms)} />
                      </Fragment> : ''}
                  </FormGroup>

                  <FormGroup>
                    <Button color="primary" block type="submit" onClick={this.handleSubmit}>Get Report</Button>
                  </FormGroup>
                </form>
                {errors ? <p style={{ color: 'red', fontWeight: 'bold', textAlign: 'center' }}>{errors}</p> : ''}
              </CardBody>
            </Card>
          </Col>
        </Row>

      </div>
    )
  }
}
