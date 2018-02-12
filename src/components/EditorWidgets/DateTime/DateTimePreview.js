import React from 'react';
import PropTypes from 'prop-types';

const DateTimePreview = ({ value }) => (
  <div className="nc-widgetPreview">{value && `${ value }`}</div>
);

DateTimePreview.propTypes = {
  value: PropTypes.object,
};

export default DateTimePreview;
