import PropTypes from 'prop-types';
import React from 'react';
import { ScrollSyncPane } from 'react-scroll-sync';

/**
 * We need to create a lightweight component here so that we can access the
 * context within the Frame. This allows us to attach the ScrollSyncPane to the
 * body.
 */
const PreviewContent = ({ previewComponent, previewProps }) => (
  <ScrollSyncPane attachTo={this.context.document.scrollingElement}>
    {React.createElement(previewComponent, previewProps)}
  </ScrollSyncPane>
);

PreviewContent.contextTypes = {
  document: PropTypes.any,
};

PreviewContent.propTypes = {
  previewComponent: PropTypes.element.isRequired,
  previewProps: PropTypes.object.isRequired,
};

export default PreviewContent;
