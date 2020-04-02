import React, { Component } from 'react'
import { Card, CardBody, CardColumns, CardHeader } from 'reactstrap';

export default class Management extends Component {
    render() {
        return (
            <div className="animated fadeIn">
                <Card>
                    <CardBody style={{ backgroundColor: 'white' }} >
                        <CardColumns className="cols-2">
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Asset Management</h3>
                                </CardBody>
                            </Card>
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem', }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Device Management</h3>

                                </CardBody>
                            </Card>
                        </CardColumns>
                        <CardColumns className="cols-2">
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Site Management</h3>

                                </CardBody>
                            </Card>
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Tag Management</h3>

                                </CardBody>
                            </Card>
                        </CardColumns>
                        <CardColumns className="cols-2">
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Region Management</h3>

                                </CardBody>
                            </Card>
                            <Card style={{ marginTop: '2rem', marginBottom: '2rem' }}>
                                <CardBody style={{ display: 'flex', justifyContent: "center", backgroundColor: "#023e58", cursor: 'pointer' }}>
                                    <h3>Site Configuration</h3>

                                </CardBody>
                            </Card>
                        </CardColumns>
                    </CardBody>
                </Card>
            </div>
        )
    }
}
