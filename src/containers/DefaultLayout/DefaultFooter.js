import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';

const propTypes = {
  children: PropTypes.node,
};

const defaultProps = {};

class DefaultFooter extends Component {
  render() {
    const { children, ...attributes } = this.props;

    return (
      <React.Fragment>
        <span> © 2020 Cellsenal, All rights reserved</span>
        <span className="ml-auto">Powered by <a href="https://cellsenal.com/">Cellsenal</a></span>
      </React.Fragment>
    );
  }
}

DefaultFooter.propTypes = propTypes;
DefaultFooter.defaultProps = defaultProps;

export default DefaultFooter;
