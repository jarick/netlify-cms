import PropTypes from 'prop-types';
import React from 'react';

const NumberPreview = ({ value }) => <div className="nc-widgetPreview">{value}</div>;

NumberPreview.propTypes = {
  value: PropTypes.node,
};

export default NumberPreview;
