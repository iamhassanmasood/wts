import React, { Component } from 'react';
import MapModule from './../MapModule/MapModule'
import Chart from 'react-apexcharts'
import { BASE_URL, PORT, SITES_API, ASSET_API, ASSET_BY_SITE, ALERTS_API, REGIONS_API, DEVICES_API, } from '../../config/config'
import axios from 'axios';
import { Button, Card, CardHeader, CardGroup, CardColumns, CardBody, Col, Row } from 'reactstrap';
import AllSitesInformation from '../AllSitesInformation/AllSitesInformation.js'
import SearchSite from '../SeachModule/SearchSite'
import SearchAsset from '../SeachModule/SearchAsset'
import Widget04 from '../../views/Widgets/Widget04'

class Dashboard extends Component {
  state = {
    flag: false,
    siteData: [],
    site: '',
    asset: '',
    assetData: [],
    Alertdata: [],
    count: undefined,
    deviceData: [],
    regionData: [],
    lat: undefined,
    lng: undefined,
    latlng: [],
    ws: null,
    wss: null,
    options: {
      labels: ['Registered Undiscovered', 'Registered Discovered', 'UnAuthorized Entry', 'Stolen', 'In Transit'],
      colors: ['#20a8d8',
        '#53af50',
        '#f4cb08',
        '#da534f',
        '#72808f'],
      legend: {
        show: false,
        position: 'bottom',
        labels: {
          colors: 'white',
          useSeriesColors: false
        },
      },
      plotOptions: {
        pie: {
          size: '65%'
        }
      },
      responsive: [{
        breakpoint: undefined,
        options: {
          chart: {
            sparkline: {
              enabled: false
            }
          }
        }
      }]
    },
    warehousePie: {
      labels: ['Check-In', 'Check-Out', 'Stolen'],
      colors: ['#90ee90',
        '#72808f',
        '#da534f'],
      legend: {
        show: false,
        position: 'bottom',
        labels: {
          colors: 'white',
          useSeriesColors: false
        },
      },
      plotOptions: {
        pie: {
          size: '65%'
        }
      },
      responsive: [{
        breakpoint: undefined,
        options: {
          chart: {
            sparkline: {
              enabled: false
            }
          }
        }
      }]
    },
  }

  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          const data = [...res.data]

          var latlong = data.map((item, index) => {
            return {
              latitude: parseFloat(item.site_location.split(",")[0]), longitude: parseFloat(item.site_location.split(",")[1]),
            }
          })
          this.setState({
            siteData: data,
            latlng: latlong

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

    axios.get(`${BASE_URL}/${ASSET_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          const data = [...res.data]
          this.setState({
            assetData: data,
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


  handleSite = () => {
    var e = document.getElementById("sitee");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      site: result
    })
  }
  handleAst = () => {
    var e = document.getElementById("assete");
    var result = e.options[e.selectedIndex].value;
    this.setState({
      asset: result
    })
  }

  switchCharts = () => {
    const previousState = this.state.flag;
    this.setState({ flag: !previousState })
  }

  render() {
    const { warehousePie, options, flag, latlng, siteData, assetData, site, asset } = this.state;
    const data = [10, 20, 30, 40, 50];
    const warehouseData = [10, 20, 30];

    return (
      <div className="">
        <Row style={{ marginTop: "-15px" }}>
          <SearchSite id='sitee' site={site} handleChange={this.handleSite} Data={siteData} />
          <SearchAsset id='assete' asset={asset} handleChange={this.handleAst} Data={assetData} />
        </Row>

        <Row style={{ marginTop: "-10px" }}>

          <Col>
            <b>WAREHOUSE</b>
            <CardGroup className="mb-3">
              <Widget04 icon="icon-people" color="checkIn" header="10" value="10"></Widget04>
              <Widget04 icon="icon-user-follow" color="assigned" header="20" value="20"></Widget04>
              <Widget04 icon="icon-basket-loaded" color="checkOut" header="30" value="30"></Widget04>
              <Widget04 icon="icon-pie-chart" color="stolen" header="40" value="40"></Widget04>
              <Widget04 icon="icon-speedometer" color="delivered" header="50" value="50"></Widget04>
            </CardGroup>
          </Col>

          <Col>
            <b>NETWORK SITES</b>
            <CardGroup className="mb-3">
              <Widget04 icon="icon-people" color="info" header="10" value="10"></Widget04>
              <Widget04 icon="icon-user-follow" color="success" header="20" value="20"></Widget04>
              <Widget04 icon="icon-basket-loaded" color="primary" header="30" value="30"></Widget04>
              <Widget04 icon="icon-pie-chart" color="danger" header="40" value="40"></Widget04>
              <Widget04 icon="icon-speedometer" color="warning" header="50" value="50"></Widget04>
            </CardGroup>
          </Col>

        </Row>
        <Row>


          <Col className='col-lg-8 MapModule'>
            <Card>
              <CardHeader ><i className='fa fa-map'></i>Location </CardHeader>
              <MapModule
                markers={this.state.latlng}
              />

            </Card>
          </Col>

          <div className='col-lg-4'>
            <Card>
              <CardHeader >
                WAREHOUSE
                <CardBody>
                  <Chart options={warehousePie} series={warehouseData} type="pie" width={`100%`} height={250} />
                </CardBody>
              </CardHeader>
              <CardHeader >
                NETWORK SITE
                <CardBody><Chart options={options} series={data} type="pie" width={`100%`} height={250} />
                </CardBody>
              </CardHeader>
            </Card>


          </div>

        </Row>


        <AllSitesInformation />
      </div>

    );
  }
}

export default Dashboard;
