import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';

// const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

import DefaultLayout from './containers/DefaultLayout';

import Login from './views/Pages/Login';
import Page404 from './views/Pages/Page404';
const token = localStorage.getItem("accessToken");

const AuthenticatedRoutes = ({ component: Component, ...rest }) => (
  <Route
    {...rest}
    render={props =>
      token ? (
        <Component {...props} />
      ) : (
          <Redirect to={{
            pathname: "/login"
          }} />
        )
    }
  />

)
function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
        <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
        <Route exact path="/*" component={Page404} />
        {/* <Route exact path="*" component={Page404} />
          <Route path='/dashboard/Alerts' component={Alerts} />
          <Route path='/dashboard/Reports' component={Reports} />
          <Route path='/dashboard/Reports/GeneralReports' component={GeneralReports} />
          <Route path='/dashboard/Reports/ProgressReports' component={ProgressReports} />
          <Route path='/dashboard/management' component={Management} />
          <Route path='/dashboard/management/DeviceManagement' component={DeviceManagement} />
          <Route path='/dashboard/management/AssetManagement' component={AssetManagement} />
          <Route path='/dashboard/management/TagManagement' component={TagManagement} />
          <Route path='/dashboard/management/SiteManagement' component={SiteManagement} />
          <Route path='/dashboard/management/RegionManagement' component={RegionManagement} />
          <Route path='/dashboard/management/SiteConfiguration' component={SiteConfiguration} />
          <Route path='/dashboard/TransferAssets' component={TransferAssets} /> */}
      </Switch>
    </Router>
  );
}


export default App;
