import React from 'react';
import PropTypes from 'prop-types';

// eslint-disable-next-line import/prefer-default-export
export const FileUploadButton = ({ label, imagesOnly, onChange, disabled, className }) => (
  <label htmlFor="file" className={`nc-fileUploadButton ${ className || '' }`}>
    <span>{label}</span>
    <input
      id="file"
      type="file"
      accept={imagesOnly ? 'image/*' : '*/*'}
      onChange={onChange}
      disabled={disabled}
    />
  </label>
);

FileUploadButton.propTypes = {
  label: PropTypes.string.isRequired,
  imagesOnly: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  disabled: PropTypes.bool,
  className: PropTypes.string,
};
