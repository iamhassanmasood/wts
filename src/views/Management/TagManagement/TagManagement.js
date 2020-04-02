import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, ListGroup, ListGroupItem, ListGroupItemHeading, ListGroupItemText, Row, TabContent, TabPane, Button } from 'reactstrap';
import { BASE_URL, PORT, ASSET_API, SITES_API } from '../../../Config/Config'
import tagValidation from './Validator'
import axios from 'axios'

var token = localStorage.getItem('accessToken');
var headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Bearer ' + token }


class TagManagement extends Component {

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-tag"></i> Tag Management
                <Button color='success' size='sm' className="card-header-actions">
                  <a>
                    <i className="fa fa-plus"></i> Add New Tag
                  </a>
                </Button>
              </CardHeader>
              <CardBody></CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default TagManagement;
