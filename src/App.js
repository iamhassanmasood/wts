import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import './App.scss';

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

const DefaultLayout = React.lazy(() => import('./containers/DefaultLayout'));

const Login = React.lazy(() => import('./views/Pages/Login'));
const Page404 = React.lazy(() => import('./views/Pages/Page404'));
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
      <React.Suspense fallback={loading()}>
        <Switch>
          <Route exact path="/login" name="Login Page" render={props => <Login {...props} />} />
          <Route path="/" name="Home" render={props => <DefaultLayout {...props} />} />
          <Route exact path="/*" component={Page404} />
          {/* <Route component={Page404} /> */}
        </Switch>
      </React.Suspense>
    </Router>
  );
}


export default App;
