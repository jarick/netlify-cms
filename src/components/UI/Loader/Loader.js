import React from 'react';
import PropTypes from 'prop-types';
// eslint-disable-next-line no-shadow
import CSSTransition from 'react-transition-group/CSSTransition';
import c from 'classnames';

// eslint-disable-next-line
export class Loader extends React.Component {

  static propTypes = {
    children: PropTypes.node,
    active: PropTypes.bool,
    className: PropTypes.string,
  };

  state = {
    currentItem: 0,
  };

  componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  setAnimation = () => {
    if (this.interval) return;
    const { children } = this.props;

    this.interval = setInterval(() => {
      const nextItem = (this.state.currentItem === children.length - 1)
         ? 0 
         : this.state.currentItem + 1;
      this.setState({ currentItem: nextItem });
    }, 5000);
  };

  renderChild = () => {
    const { children } = this.props;
    const { currentItem } = this.state;
    if (!children) {
      return null;
    } else if (typeof children === 'string') {
      return <div className="nc-loader-text">{children}</div>;
    } else if (Array.isArray(children)) {
      this.setAnimation();
      return (<div className="nc-loader-text">
        <CSSTransition
          classNames={{
            enter: 'nc-loader-enter',
            enterActive: 'nc-loader-enterActive',
            exit: 'nc-loader-exit',
            exitActive: 'nc-loader-exitActive',
          }}
          timeout={500}
        >
          <div key={currentItem} className="nc-loader-animateItem">
            {children[currentItem]}
          </div>
        </CSSTransition>
      </div>);
    }

    return null;
  };

  render() {
    const { active, className } = this.props;
    const combinedClassName = c('nc-loader-root', { 'nc-loader-active': active }, className);
    return <div className={combinedClassName}>{this.renderChild()}</div>;
  }
}
