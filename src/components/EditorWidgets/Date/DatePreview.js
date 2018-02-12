import React from 'react';
import PropTypes from 'prop-types';

const DatePreview = ({ value }) => (
  <div className="nc-widgetPreview">{value ? value.toString() : null}</div>
);

DatePreview.propTypes = {
  value: PropTypes.object,
};

export default DatePreview;
