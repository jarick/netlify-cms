import PropTypes from 'prop-types';
import React, { Component } from 'react';

/* eslint-disable react/prefer-stateless-function */
export default class WrapWidget extends Component {
  static propTypes = {
    controlComponent: PropTypes.func.isRequired,
  };

  render() {
    const {
      controlComponent,
      ...props,
    } = this.props;

    return React.createElement(controlComponent, props);
  }
}
