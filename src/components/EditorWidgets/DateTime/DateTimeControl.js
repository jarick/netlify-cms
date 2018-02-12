import React from 'react';
import PropTypes from 'prop-types';
import DateControl from '../Date/DateControl';

const DateTimeControl = props => <DateControl {...props} includeTime />;

DateTimeControl.propTypes = {
  field: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  classNameWrapper: PropTypes.string.isRequired,
  setActiveStyle: PropTypes.func.isRequired,
  setInactiveStyle: PropTypes.func.isRequired,
  value: PropTypes.oneOfType([
    PropTypes.object,
    PropTypes.string,
  ]),
  format: PropTypes.string,
};

export default DateTimeControl;
