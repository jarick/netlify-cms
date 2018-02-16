import PropTypes from 'prop-types';
import React from 'react';
import 'redux-notifications/lib/styles.css';

// eslint-disable-next-line import/prefer-default-export
export const Toast = ({ kind, message }) => (
  <div className={`nc-toast nc-toast-${ kind }`}>
    {message}
  </div>
);

Toast.propTypes = {
  kind: PropTypes.oneOf(['info', 'success', 'warning', 'danger']).isRequired,
  message: PropTypes.string,
};
