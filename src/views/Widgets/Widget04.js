import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Card, CardBody, Progress } from 'reactstrap';
import classNames from 'classnames';
import { mapToCssModules } from 'reactstrap/lib/utils';

const propTypes = {
  header: PropTypes.string,
  icon: PropTypes.string,
  color: PropTypes.string,
  iconColor: PropTypes.string,
  value: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  cssModule: PropTypes.object,
  invert: PropTypes.bool,
};

const defaultProps = {
  header: '87.500',
  icon: 'icon-people',
  color: 'info',
  value: '25',
  children: '',
  invert: false,
};

class Widget04 extends Component {
  render() {
    const { className, cssModule, header, icon, color, value, children, invert, ...attributes } = this.props;

    // demo purposes only
    const progress = { style: '', color: color, value: value };
    const card = { style: '', bgColor: '', icon: icon, iconColor: color };

    const classes = mapToCssModules(classNames(className, card.style, card.bgColor), cssModule);
    progress.style = classNames('progress-xs mt-3 mb-0', progress.style);
    var Color;
    if (card.iconColor === "success") {
      Color = '#4BB543'
    } if (card.iconColor === "warning") {
      Color = '#FFCC00'
    } if (card.iconColor === "danger") {
      Color = '#d9534f'
    } if (card.iconColor === "primary") {
      Color = '#0275d8'
    } if (card.iconColor === "info") {
      Color = '#5bc0de'
    }
    return (
      <Card className={classes} {...attributes}>
        <CardBody style={{ backgroundColor: "green" }}>
          <div className="h1 text-muted text-right mb-2">
            <i className={card.icon} style={{ color: Color }}></i>
          </div>
          <div className="h4 mb-0">{header}</div>
          <small className=" text-uppercase font-weight-bold">{children}</small>
          {/* <Progress className={progress.style} color={progress.color} value={progress.value} /> */}
        </CardBody>
      </Card>
    );
  }
}

Widget04.propTypes = propTypes;
Widget04.defaultProps = defaultProps;

export default Widget04;