import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const UnknownPreview = ({ field }) => (
  <div className="nc-widgetPreview">No preview for widget “{field.get('widget')}”.</div>
);

UnknownPreview.propTypes = {
  field: ImmutablePropTypes.map,
};

export default UnknownPreview;
