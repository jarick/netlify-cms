import React from 'react';
import PropTypes from 'prop-types';
import ImmutablePropTypes from 'react-immutable-proptypes';


class PreviewHOC extends React.Component {

  /**
   * Only re-render on value change, but always re-render objects and lists.
   * Their child widgets will each also be wrapped with this component, and
   * will only be updated on value change.
   */
  shouldComponentUpdate(nextProps) {
    const isWidgetContainer = ['object', 'list'].includes(nextProps.field.get('widget'));
    return isWidgetContainer || this.props.value !== nextProps.value;
  }

  render() {
    const { previewComponent, ...props } = this.props;
    return React.createElement(previewComponent, props);
  }
}

PreviewHOC.propTypes = {
  field: ImmutablePropTypes.map,
  value: PropTypes.any,
  previewComponent: PropTypes.element,
};

export default PreviewHOC;
