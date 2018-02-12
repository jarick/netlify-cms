import React from 'react';
import PropTypes from 'prop-types';


const ImagePreview = ({ value, getAsset }) => (
  <div className="nc-widgetPreview">
    {value && <img
      src={getAsset(value)}
      className="nc-imageWidget-image"
      role="presentation"
    />}
  </div>
);

ImagePreview.propTypes = {
  getAsset: PropTypes.func.isRequired,
  value: PropTypes.node,
};

export default ImagePreview;
