import React, { Component } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem, Card, Button } from 'reactstrap';
import PropTypes from 'prop-types';
import { AppNavbarBrand, AppSidebarToggler } from '@coreui/react';
import Logo from '../../assets/img/brand/Logo.PNG'
import sygnet from '../../assets/img/brand/sygnet.PNG'

const propTypes = {
  children: PropTypes.node,
};
const defaultProps = {};

function DefaultHeader(props) {
  const history = useHistory();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.clear();
    history.push('/login')
  };
  // const { children, ...attributes } = props;

  return (
    <React.Fragment>
      <AppSidebarToggler className="d-lg-none satisfy" display="sm" mobile />
      <AppNavbarBrand
        full={{ src: Logo, width: 89, height: 25, alt: 'Cellcenal' }}
        minimized={{ src: sygnet, width: 30, height: 30, alt: 'Cellcenal' }}
      />
      <AppSidebarToggler className="d-md-down-none" display="lg" />

      <Nav className="d-md-down-none" navbar>

        <NavItem className="px-3">
          <NavLink to="/dashboard/networklevel" className="nav-link" >Network Level</NavLink>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/dashboard/sitelevel" className="nav-link">Site Level</Link>
        </NavItem>
        <NavItem className="px-3">
          <Link to="/dashboard/assetlevel" className="nav-link">Asset Level</Link>
        </NavItem>
      </Nav>
      <Nav className="m-auto" navbar>
        <div className="divforcard">

          <Button color='info' size="lg" className=" btn-brand mr-1 mb-1">
            <i className="fa fa-sitemap"></i>
            <span> 3444 </span>
          </Button>

          <Button color='success' size="lg" className=" btn-brand mr-1 mb-1">
            <i className="fa fa-ticket"></i>
            <span> 3444 </span>
          </Button>

          <Button color='danger' size="lg" className=" btn-brand mr-1 mb-1">
            <i className="fa fa-bell"></i>
            <span> 3444 </span>
          </Button>

        </div>
      </Nav>
      <Nav className="ml-auto" navbar>
        <Button onClick={handleLogout} className='logoutButton'><i className="fa fa-sign-out" title="Alerts"></i> Logout</Button>

      </Nav>
    </React.Fragment>
  );
}


DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
