import PropTypes from 'prop-types';
import React from 'react';

const StringPreview = ({ value }) => (
  <div className="nc-widgetPreview">{ value }</div>
);

StringPreview.propTypes = {
  value: PropTypes.node,
};

export default StringPreview;
