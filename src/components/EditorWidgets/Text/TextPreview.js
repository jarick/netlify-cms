import PropTypes from 'prop-types';
import React from 'react';

const TextPreview = ({ value }) => (
  <div className="nc-widgetPreview">{value}</div>
);

TextPreview.propTypes = {
  value: PropTypes.node,
};

export default TextPreview;
