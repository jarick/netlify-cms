import PropTypes from 'prop-types';
import React from 'react';

const FilePreview = ({ value, getAsset }) => (
  <div className="nc-widgetPreview">
    {value && <a href={getAsset(value)}>{value}</a>}
  </div>
);

FilePreview.propTypes = {
  getAsset: PropTypes.func.isRequired,
  value: PropTypes.node,
};

export default FilePreview;
