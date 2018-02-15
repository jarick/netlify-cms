import PropTypes from 'prop-types';
import React from 'react';
import { Icon } from '../../components/UI';

export default class AuthenticationPage extends React.Component {
  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    inProgress: PropTypes.bool,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  handleLogin = (e) => {
    e.preventDefault();
    this.props.onLogin(this.state);
  };

  render() {
    const { inProgress } = this.props;
    const { t } = this.context;

    return (
      <section className="nc-githubAuthenticationPage-root">
        <Icon className="nc-githubAuthenticationPage-logo" size="500px" type="netlify-cms" />
        <button
          className="nc-githubAuthenticationPage-button"
          disabled={inProgress}
          onClick={this.handleLogin}
        >
          {inProgress ? t('auth.logging') : t('auth.login')}
        </button>
      </section>
    );
  }
}
