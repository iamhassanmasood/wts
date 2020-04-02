import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, FormGroup, Input, Label, Row, Table, Pagination, PaginationItem, PaginationLink, Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';

export default class RegionManagement extends Component {
    render() {
        return (
            <div className="animated fadeIn">
                <Row>
                    <Col xl={12}>
                        <Card>
                            <CardHeader>
                                <i className="fa fa-apple"></i> Region Management
                                <Button color='success' size='sm' className="card-header-actions">
                                    <i className="fa fa-plus"></i> Add New Region
                                </Button>
                            </CardHeader>
                            <CardBody></CardBody>
                        </Card>
                    </Col>
                </Row>
            </div>
        )
    }
}
