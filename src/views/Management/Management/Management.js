import React, { Component } from 'react'
import { Card, CardBody, CardColumns, CardHeader } from 'reactstrap';
import { NavLink } from 'react-router-dom';

export default class Management extends Component {
  render() {
    return (
      <div className="animated fadeIn">
        <Card>
          <CardBody style={{ backgroundColor: 'white' }} >
            <CardColumns className="cols-2">
              <Card >
                <NavLink className="nav-link" to='management/AssetManagement'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Asset Management</h3>
                </CardBody>
                </NavLink>
              </Card>
              <Card>
                <NavLink className="nav-link" to='management/Management'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Device Management</h3>

                </CardBody>
                </NavLink>
              </Card>
            </CardColumns>
            <CardColumns className="cols-2">
              <Card >
                <NavLink className="nav-link" to='management/AssetManagement'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Site Management</h3>

                </CardBody>
                </NavLink>
              </Card>
              <Card >
                <NavLink className="nav-link" to='management/AssetManagement'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Tag Management</h3>
                </CardBody>
                </NavLink>
              </Card>
            </CardColumns>
            <CardColumns className="cols-2">
              <Card >
                <NavLink className="nav-link" to='management/AssetManagement'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Region Management</h3>

                </CardBody>
                </NavLink>
              </Card>
              <Card >
                <NavLink className="nav-link" to='management/AssetManagement'> <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                  <h3>Site Configuration</h3>

                </CardBody>
                </NavLink>
              </Card>
            </CardColumns>
          </CardBody>
        </Card>
      </div>
    )
  }
}
