import PropTypes from 'prop-types';
import React from 'react';

const issueUrl = "https://github.com/netlify/netlify-cms/issues/new";

const ErrorComponent = () => (
  <div className="nc-errorBoundary">
    <h1 className="nc-errorBoundary-heading">Sorry!</h1>
    <p>
      <span>{"There's been an error - please"}</span>
      <a
        href={issueUrl}
        rel="noopener noreferrer"
        target="_blank"
        className="nc-errorBoundary-link"
      >
        report it
      </a>!
    </p>
  </div>
);

// eslint-disable-next-line import/prefer-default-export
export class ErrorBoundary extends React.Component {
  static propTypes = {
    errorComponent: PropTypes.node,
    children: PropTypes.node,
  };

  state = {
    hasError: false,
  };

  componentDidCatch(error) {
    // eslint-disable-next-line no-console
    console.error(error);
    this.setState({ hasError: true });
  }

  render() {
    const errorComponent = this.props.errorComponent || <ErrorComponent />;

    return this.state.hasError ? errorComponent : this.props.children;
  }
}
