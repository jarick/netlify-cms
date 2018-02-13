import PropTypes from 'prop-types';
import React from 'react';
import { markdownToHtml } from '../serializers';

const MarkdownPreview = ({ value, getAsset }) => {
  if (value === null) {
    return null;
  }
  const html = markdownToHtml(value, getAsset);
  return <div className="nc-widgetPreview" dangerouslySetInnerHTML={{ __html: html }} />;
};

MarkdownPreview.propTypes = {
  getAsset: PropTypes.func,
  value: PropTypes.string,
};

export default MarkdownPreview;
