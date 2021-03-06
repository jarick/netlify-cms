import React, { Component } from 'react';
import PropTypes from 'prop-types';

/**
 * ScrollSyncPane Component
 *
 * Wrap your content in it to keep its scroll position in sync with other panes
 *
 * @example ./example.md
 */


export default class ScrollSyncPane extends Component {

  static propTypes = {
    children: PropTypes.node.isRequired,
    attachTo: PropTypes.object,
    group: PropTypes.string,
  };

  static defaultProps = {
    group: 'default',
  };

  static contextTypes = {
    registerPane: PropTypes.func.isRequired,
    unregisterPane: PropTypes.func.isRequired,
  };

  componentDidMount() {
    this.node = this.props.attachTo || this.node;
    this.context.registerPane(this.node, this.props.group);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.group !== nextProps.group) {
      this.context.unregisterPane(this.node, this.props.group);
      this.context.registerPane(this.node, nextProps.group);
    }
  }

  componentWillUnmount() {
    this.context.unregisterPane(this.node, this.props.group);
  }

  render() {
    return <div ref={(node) => { this.node = node; }}>{this.props.children}</div>;
  }
}
