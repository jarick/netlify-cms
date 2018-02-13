import PropTypes from 'prop-types';
import React from 'react';

const StringControl = ({
  forID,
  value,
  onChange,
  classNameWrapper,
  setActiveStyle,
  setInactiveStyle,
}) => (
  <input
    type="text"
    id={forID}
    className={classNameWrapper}
    value={value || ''}
    onChange={e => onChange(e.target.value)}
    onFocus={setActiveStyle}
    onBlur={setInactiveStyle}
  />
);

StringControl.propTypes = {
  onChange: PropTypes.func.isRequired,
  forID: PropTypes.string,
  value: PropTypes.node,
  classNameWrapper: PropTypes.string.isRequired,
  setActiveStyle: PropTypes.func.isRequired,
  setInactiveStyle: PropTypes.func.isRequired, 
};

export default StringControl;
