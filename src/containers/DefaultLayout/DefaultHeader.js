import React, { Component } from 'react';
import { Link, NavLink, useHistory } from 'react-router-dom';
import { Badge, UncontrolledDropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, NavItem } from 'reactstrap';
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
      <Nav className="ml-auto" navbar>
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link"><i className="fa fa-sitemap fa-lg" title="Sites"></i><Badge pill color="info">15</Badge></NavLink>
        </NavItem>
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link"><i className="fa fa-ticket fa-lg" title="Assets"></i><Badge pill color="primary">15</Badge></NavLink>
        </NavItem>
        <NavItem className="d-md-down-none">
          <NavLink to="#" className="nav-link" title="Alerts"><i className="fa fa-bell fa-lg"></i><Badge pill color="danger">5</Badge></NavLink>
        </NavItem>
        <UncontrolledDropdown nav direction="down">
          <DropdownToggle nav>
            <DropdownItem onClick={handleLogout}><i className="fa fa-sign-out" title="Alerts"></i> Logout</DropdownItem>
          </DropdownToggle>
        </UncontrolledDropdown>
      </Nav>
    </React.Fragment>
  );
}


DefaultHeader.propTypes = propTypes;
DefaultHeader.defaultProps = defaultProps;

export default DefaultHeader;
