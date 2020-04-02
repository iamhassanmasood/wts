import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Badge, Row, Card, CardBody, CardHeader, Col, Pagination, PaginationItem, PaginationLink, Table } from 'reactstrap';

import usersData from './UsersData'

function UserRow(props) {
  const user = props.user
  const userLink = `/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.id.toString()}>
      <th scope="row"><Link to={userLink}>{user.id}</Link></th>
      <td><Link to={userLink}>{user.name}</Link></td>
      <td>{user.registered}</td>
      <td>{user.role}</td>
      <td><Link to={userLink}><Badge color={getBadge(user.status)}>{user.status}</Badge></Link></td>
    </tr>
  )
}

class Users extends Component {

  render() {

    const userList = usersData.filter((user) => user.id < 10)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={12}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Site Management
              </CardHeader>
              <CardBody>
                <Table hover bordered striped responsive size="sm">
                  <thead>
                    <tr>
                      <th>Sr#</th>
                      <th>Site Id</th>
                      <th>Site Name</th>
                      <th>Location</th>
                      <th>Region</th>
                      <th>Device</th>
                      <th>Time</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>1</td>
                      <td>2012/01/01</td>
                      <td>Member</td>
                      <td> Alif </td>
                      <td>Vishnu Serghei</td>
                      <td>2012/01/01</td>
                      <td>Member</td>
                      <td style={{ display: 'flex', justifyContent: 'space-evenly' }}><button className='btn btn-primary btn-sm'>
                        <i className='fa fa-edit fa-lg'></i></button>
                        <button className='btn btn-danger btn-sm'>
                          <i className='fa fa-trash fa-lg'></i></button>
                      </td>
                    </tr>
                    <tr>
                      <td>2</td>
                      <td>2012/01/01</td>
                      <td>Member</td>
                      <td> Alif </td>
                      <td>Vishnu Serghei</td>
                      <td>2012/01/01</td>
                      <td>Member</td>
                      <td style={{ display: 'flex', justifyContent: 'space-evenly' }}><button className='btn btn-primary btn-sm'>
                        <i className='fa fa-edit fa-lg'></i></button>
                        <button className='btn btn-danger btn-sm'>
                          <i className='fa fa-trash fa-lg'></i></button>
                      </td>
                    </tr>
                  </tbody>
                </Table>
                {/* <nav>
                  <Pagination>
                    <PaginationItem><PaginationLink previous tag="button">Prev</PaginationLink></PaginationItem>
                    <PaginationItem active>
                      <PaginationLink tag="button">1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem><PaginationLink tag="button">2</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">3</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink tag="button">4</PaginationLink></PaginationItem>
                    <PaginationItem><PaginationLink next tag="button">Next</PaginationLink></PaginationItem>
                  </Pagination>
                </nav> */}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
