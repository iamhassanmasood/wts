import React, { Component } from 'react'
import { Card, CardBody, CardColumns, CardHeader, Col } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class Management extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody style={{ backgroundColor: 'white' }} >
            <Col>
              <Card >
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/AssetManagement'>  <h3>Asset Management</h3>
                  </NavLink>
                </CardBody>
              </Card>
              <Card>
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/DeviceManagement'>  <h3>Device Management</h3>

                  </NavLink>
                </CardBody>
              </Card>

              <Card >
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/SiteManagement'>  <h3>Site Management</h3>

                  </NavLink>
                </CardBody>
              </Card>
              <Card >
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/TagManagement'>  <h3>Tag Management</h3>
                  </NavLink>
                </CardBody>
              </Card>

              <Card >
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/RegionManagement'>  <h3>Region Management</h3>

                  </NavLink>
                </CardBody>
              </Card>
              <Card >
                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <NavLink className="nav-link" to='management/SiteConfiguration'>  <h3>Site Configuration</h3>

                  </NavLink>
                </CardBody>
              </Card>
            </Col>
          </CardBody>
        </Card>
      </div>
    )
  }
}
