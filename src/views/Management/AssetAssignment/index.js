import React, { Component } from 'react'
import { Card, CardBody, CardHeader, Col, Row } from 'reactstrap';

import { Steps, Button, message } from 'antd';

const { Step } = Steps;

const steps = [
  {
    title: 'Network Sites',
    content: 'First-content',
  },
  {
    title: 'Network Sites',
    content: 'Second-content',
  },
  {
    title: 'Assets',
    content: 'Last-content',
  },
  {
    title: 'Last',
    content: 'Last-content',
  },
];

export default class AssetAssignment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  next() {
    const current = this.state.current + 1;
    this.setState({ current });
  }

  prev() {
    const current = this.state.current - 1;
    this.setState({ current });
  }

  render() {
    const { current } = this.state;
    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fas fa-tablet"></i> Asset Assignment
              </CardHeader>
              <CardBody style={{ backgroundColor: 'white' }}>
                <Steps current={current}>
                  {steps.map(item => (
                    <Step key={item.title} title={item.title} />
                  ))}
                </Steps>
                <div className="steps-content">{steps[current].content}</div>
                <div className="steps-action">
                  {current < steps.length - 1 && (
                    <Button type="primary" onClick={() => this.next()}>
                      Next
                    </Button>
                  )}
                  {current === steps.length - 1 && (
                    <Button type="primary" onClick={() => message.success('Asset Assignment Successfull')}>
                      Done
                    </Button>
                  )}
                  {current > 0 && (
                    <Button style={{ margin: '0 8px' }} onClick={() => this.prev()}>
                      Previous
                    </Button>
                  )}
                </div>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}
