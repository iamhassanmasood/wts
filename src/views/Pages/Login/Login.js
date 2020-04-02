import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Spinner } from 'reactstrap';

import loginValidation from './Validator';
import axios from 'axios'
import { BASE_URL, PORT, LOGIN, CLIENT_ID, CLIENT_SECRET } from '../../../Config/Config'
import Logo from '../../../assets/img/brand/Logo.PNG'

class Login extends Component {

  constructor(props) {
    super(props)
    this.state = {
      username: '',
      password: '',
      isSubmitted: false,
      errors: undefined,
      accessToken: undefined,
      refreshToken: undefined,
      loading: false
    }

  }

  handleUserInput = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    this.setState({ [name]: value, errors: "" });
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.setState({ isSubmitted: true, errors: undefined });

    const { isValid, errors } = loginValidation(this.state);
    if (!isValid) {
      this.setState({ errors, isSubmitted: false });
      return false;
    } else {
      const username = this.state.username;
      const password = this.state.password;
      const CLIENT64 = btoa(CLIENT_ID + ":" + CLIENT_SECRET);
      let body = "grant_type=password&username=" + username + "&password=" + password;
      let headers = { 'Content-Type': 'application/x-www-form-urlencoded', 'Authorization': 'Basic ' + CLIENT64 }
      this.setState({ loading: true })
      axios.post(`${BASE_URL}:${PORT}/${LOGIN}/`, body, { headers })
        .then(res => {
          localStorage.setItem('accessToken', res.data.access_token);
          localStorage.setItem('expiry', res.data.expires_in);
          localStorage.setItem('refreshToken', res.data.refresh_token);
          if (res.status === 200) {
            this.props.history.push("/");
            this.setState({
              accessToken: res.data.access_token,
              refreshToken: res.data.refresh_token,
              isSubmitted: true,
              loading: false
            })
          }
        })
        .catch(err => err ? this.setState({
          errors: "Invalid Username or Password",
          isSubmitted: false,
          loading: false
        }) : ''
        );
    }
  };

  render() {
    const { username, password, errors, loading } = this.state;
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="9" lg="7" xl="6">

              <Card className="mx-4">
                <CardBody className="p-4" style={{ backgroundColor: 'white', color: "black" }}>
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', marginTop: '2rem', marginBottom: '2rem' }} ><img src={Logo} /> </div>
                  <Form>
                    <div style={{ textAlign: "center" }}>
                      <h1 className="text-muted">Login</h1>
                      {errors ?
                        <p style={{ color: 'red', fontWeight: 'bold' }}>Please enter valid username and password</p> :
                        <p className="text-muted">Please enter your username and password to login</p>
                      }
                    </div>
                    <InputGroup className="mb-3">
                      <Input
                        type="text"
                        placeholder="Username"
                        name="username"
                        value={username.trim()}
                        onChange={this.handleUserInput}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <Input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password.trim()}
                        onChange={this.handleUserInput}
                      />
                    </InputGroup>
                    {loading ? <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }} ><Spinner color='info' size='lg' /></div> :
                      <Button onClick={this.handleSubmit} color="info" block>Login</Button>}
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container >
      </div >
    );
  }
}

export default Login;
