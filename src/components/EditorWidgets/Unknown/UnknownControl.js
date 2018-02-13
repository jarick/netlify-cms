import React from 'react';
import ImmutablePropTypes from 'react-immutable-proptypes';

const UnknownControl = ({ field }) => (
  <div>No control for widget {"'"}{field.get('widget')}{"'"}.</div>
);

UnknownControl.propTypes = {
  field: ImmutablePropTypes.map,
};

export default UnknownControl;
