import React from 'react';
import PropTypes from 'prop-types';
import ReactToggled from 'react-toggled';
import c from 'classnames';

// eslint-disable-next-line import/prefer-default-export
export const Toggle = ({
  active,
  onChange,
  className,
  classNameBackground,
  classNameSwitch,
  onFocus,
  onBlur,
}) => (
  <ReactToggled on={active} onToggle={onChange}>
    {({ on, getElementTogglerProps }) => (
      <span
        className={c('nc-toggle', className, { 'nc-toggle-active': on })}
        role="switch"
        aria-checked={on.toString()}
        onFocus={onFocus}
        onBlur={onBlur}
        {...getElementTogglerProps()}
      >
        <span className={`nc-toggle-background ${ classNameBackground }`} />
        <span className={`nc-toggle-switch ${ classNameSwitch }`} />
      </span>
    )}
  </ReactToggled>
);

Toggle.propTypes = {
  active: PropTypes.bool,
  onChange: PropTypes.func,
  className: PropTypes.string,
  classNameBackground: PropTypes.string,
  classNameSwitch: PropTypes.string,
  onFocus: PropTypes.func.isRequired,
  onBlur: PropTypes.func.isRequired,
};
