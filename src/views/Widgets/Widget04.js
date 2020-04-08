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
    var Color = "white";
    var bgColor = "";
    var textCards = "";
    var cardFooter = "";
    if (card.iconColor === "success") {
      bgColor = '#4CAF50';
      textCards = "Registered Discovered";
      cardFooter = "#255f27";
    } if (card.iconColor === "warning") {
      bgColor = '#73818f';
      textCards = "In-Transit";
      cardFooter = "#5e5e5f";
    } if (card.iconColor === "danger") {
      bgColor = '#d9534f';
      textCards = "Stolen";
      cardFooter = "#6b302e";
    } if (card.iconColor === "primary") {
      bgColor = '#f8cb00';
      textCards = "Unauthorized Entery";
      cardFooter = "#968536";
    } if (card.iconColor === "info") {
      bgColor = '#20a8d8';
      textCards = "Registered Undiscovered";
      cardFooter = "#285363";

    }

    if (card.iconColor === "checkIn") {
      bgColor = '#90ee90';
      textCards = "Check-In";
      cardFooter = "#82b982";
    } if (card.iconColor === "assigned") {
      bgColor = '#ffff33';
      textCards = "Assigned";
      cardFooter = "#8c8c24";
    } if (card.iconColor === "checkOut") {
      bgColor = '#73818f';
      textCards = "Check-Out";
      cardFooter = "#424548";
    } if (card.iconColor === "stolen") {
      bgColor = '#d9534f';
      textCards = "Stolen";
      cardFooter = "#6b302e";
    } if (card.iconColor === "delivered") {
      bgColor = '#013220';
      textCards = "Delivered";
      cardFooter = "#1a1b1a";
    }
    return (
      <Card className={classes} {...attributes}>
        <CardBody style={{ backgroundColor: bgColor, textAlign: "center" }}>
          <div className="h1 text-muted mb-2">
            <i className={card.icon} style={{ color: Color }}></i>
          </div>
          <div className="h3 mb-0">{header}</div>
          <small className=" text-uppercase font-weight-bold">{children}</small>
          {/* <Progress className={progress.style} color={progress.color} value={progress.value} /> */}
          {/* <span style={{background: "rgba(0, 0, 0, 0.2)"}} className="mb-0">{textCards}</span> */}
        </CardBody>
        <span style={{ background: cardFooter, textAlign: "center", height: "40px", justifyContent: "center", alignItems: "center", display: "flex" }} className="h6 mb-0">{textCards}</span>
      </Card>
    );
  }
}

Widget04.propTypes = propTypes;
Widget04.defaultProps = defaultProps;

export default Widget04;