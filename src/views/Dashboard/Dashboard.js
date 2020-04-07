import React, { Component, lazy } from 'react';
import MapModule from './../MapModule/MapModule'
import Chart from 'react-apexcharts'
import { BASE_URL, PORT, SITES_API, ASSET_API, ASSET_BY_SITE, ALERTS_API, REGIONS_API, DEVICES_API, } from '../../Config/Config'
import axios from 'axios';
import { Button, Card, CardHeader, CardGroup, CardColumns, CardBody, Col, Row } from 'reactstrap';
import AllSitesInformation from '../AllSitesInformation/AllSitesInformation.js'
import SearchSite from '../SeachModule/SearchSite'
import SearchAsset from '../SeachModule/SearchAsset'

class Dashboard extends Component {

  constructor(props) {
    super(props);
    this.state = {
      flag: false,
      siteData: [],
      site: '',
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
        colors: ['#5bc0de',
          '#4BB543',
          '#0275d8',
          '#d9534f',
          '#FFCC00'],
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
  }
  componentDidMount() {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    this.handleAssetData();
    this.setState({ done: true })
    axios.get(`${BASE_URL}:${PORT}/${SITES_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          var latlng = res.data.results.map(item => {
            return {
              latitude: parseFloat(item.lat_lng.split(",")[0]), longitude: parseFloat(item.lat_lng.split(",")[1]),
              site_name: item.site_name, id: item.id, site_id: item.site_id, region: item.region, timestamp: item.timestamp,
              device: item.device
            }
          })
          this.setState({ siteData: res.data.results, done: false, latlng })
        }
      })
      .catch(err => {
        if (err.response.data.detail === "Authentication credentials were not provided.") {
          localStorage.removeItem('accessToken');
          this.setState({ redirect: true })
        } else return err
      })

  }

  handleAssetData = () => {
    var token = localStorage.getItem('accessToken');
    var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }
    axios.get(`${BASE_URL}:${PORT}/${ASSET_API}/`, { headers })
      .then(res => {
        if (res.status === 200) {
          this.setState({
            assetData: res.data.results,
          })
        }
      }).catch(err => err)
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
    const { options, flag, latlng, siteData, assetData, site, asset } = this.state;

    const data = [10, 20, 30, 40, 50];

    return (
      <div className="animated fadeIn">
        <Row>
          <SearchSite id='sitee' site={site} handleChange={this.handleSite} Data={siteData} />
          <SearchAsset id='assete' asset={asset} handleChange={this.handleAst} Data={assetData} />
        </Row>
        <Row>
          <Col>
            <CardGroup className="mb-3">
              <Card>
                <CardBody style={{ backgroundColor: "gray" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "green" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "blue" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "red" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-pie-chart' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "yellow" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-speedometer' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>

          <Col>
            <CardGroup className="mb-3">
              <Card>
                <CardBody style={{ backgroundColor: "gray" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "green" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "blue" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-people' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "red" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-pie-chart' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ backgroundColor: "yellow" }}>
                  <div className="h1 text-muted text-right mb-2">
                    <i className='icon-speedometer' style={{ color: '#ffffff' }}></i>
                  </div>
                  <div className="h4 mb-0">10</div>
                </CardBody>
              </Card>
            </CardGroup>
          </Col>
        </Row>
        <Row>

          <div className='col-lg-8'>
            <Card>
              <CardHeader ><i className='fa fa-map'></i>Location </CardHeader>
              <MapModule
                isMarkerShown
                markers={latlng}
              />
            </Card>
          </div>
          <div className='col-lg-4'>

            {flag ? <Card>
              <CardHeader ><i class="far fa-chart-pie"></i>
            Asset Summary
              <a className="card-header-actions" onClick={this.switchCharts}>
                  <i className="fa fa-plus"></i> Switch Alarms
              </a>
                <CardBody>
                  <Chart options={options} series={data} type="pie" width={`100%`} height={300} />
                </CardBody>
              </CardHeader>
            </Card> : ""}

            {!flag ? <Card>
              <CardHeader >
                Asset Alarms
              <a className="card-header-actions" color='info' size='sm' onClick={this.switchCharts}>
                  <i className="fa fa-plus"></i> Switch Summary
              </a>
                <CardBody>
                  <Chart options={options} series={data} type="donut" width={`100%`} height={300} />
                </CardBody>
              </CardHeader>
            </Card> : ''}


          </div>

        </Row>

        <AllSitesInformation />
      </div>

    );
  }
}

export default Dashboard;
