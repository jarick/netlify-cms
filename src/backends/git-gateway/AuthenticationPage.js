import PropTypes from 'prop-types';
import React from "react";
import { partial } from 'lodash';
import { Icon } from '../../components/UI';

let component = null;

if (window.netlifyIdentity) {
  window.netlifyIdentity.on('login', (user) => {
    if (component) {
      component.handleIdentityLogin(user);
    }
  });
  window.netlifyIdentity.on('logout', () => {
    if (component) {
      component.handleIdentityLogout();
    }
  });
}

export default class AuthenticationPage extends React.Component {

  static propTypes = {
    onLogin: PropTypes.func.isRequired,
    inProgress: PropTypes.bool.isRequired,
    error: PropTypes.string,
  };

  static contextTypes = {
    t: PropTypes.func,
  };

  constructor(props) {
    super(props);
    component = this;
  }

  state = { email: "", password: "", errors: {} };

  componentDidMount() {
    if (
      !this.loggedIn
      && window.netlifyIdentity
      && window.netlifyIdentity.currentUser()
    ) {
      this.props.onLogin(window.netlifyIdentity.currentUser());
      window.netlifyIdentity.close();
    }
  }

  componentWillUnmount() {
    component = null;
  }

  handleIdentityLogin = (user) => {
    this.props.onLogin(user);
    window.netlifyIdentity.close();
  };

  handleIdentityLogout = () => {
    window.netlifyIdentity.open();
  };

  handleIdentity = () => {
    const user = window.netlifyIdentity.currentUser();
    if (user) {
      this.props.onLogin(user);
    } else {
      window.netlifyIdentity.open();
    }
  };

  handleChange = (name, e) => {
    this.setState({ ...this.state, [name]: e.target.value });
  };

  handleLogin = (e) => {
    e.preventDefault();

    const { email, password } = this.state;
    const errors = {};
    if (!email) {
      errors.email = 'Make sure to enter your email.';
    }
    if (!password) {
      errors.password = 'Please enter your password.';
    }

    if (Object.keys(errors).length > 0) {
      this.setState({ errors });
      return;
    }

    AuthenticationPage.authClient.login(this.state.email, this.state.password, true)
    .then((user) => {
      this.props.onLogin(user);
    })
    .catch((error) => {
      this.setState({
        errors: { server: error.description || error.msg || error },
        loggingIn: false,
      });
    });
  };

  render() {
    const { errors } = this.state;
    const { error, inProgress } = this.props;
    const { t } = this.context;

    if (window.netlifyIdentity) {
      return (<section className="nc-gitGatewayAuthenticationPage-root">
        <Icon className="nc-githubAuthenticationPage-logo" size="500px" type="netlify-cms" />
        <button className="nc-githubAuthenticationPage-button" onClick={this.handleIdentity}>
          {t('auth.login-netlify')}
        </button>
      </section>);
    }

    return (
      <section className="nc-gitGatewayAuthenticationPage-root">
        <Icon className="nc-githubAuthenticationPage-logo" size="500px" type="netlify-cms" />
        <form className="nc-gitGatewayAuthenticationPage-form" onSubmit={this.handleLogin}>
          {!error && <p>
            <span className="nc-gitGatewayAuthenticationPage-errorMsg">{error}</span>
          </p>}
          {!errors.server && <p>
            <span className="nc-gitGatewayAuthenticationPage-errorMsg">{errors.server}</span>
          </p>}
          <div className="nc-gitGatewayAuthenticationPage-errorMsg">
            { errors.email || null }
          </div>
          <input
            type="text"
            name="email"
            placeholder="Email"
            value={this.state.email}
            onChange={partial(this.handleChange, 'email')}
          />
          <div className="nc-gitGatewayAuthenticationPage-errorMsg">
            { errors.password || null }
          </div>
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={this.state.password}
            onChange={partial(this.handleChange, 'password')}
          />
          <button className="nc-gitGatewayAuthenticationPage-button" disabled={inProgress}>
            {inProgress ? t('auth.logging') : t('auth.login')}
          </button>
        </form>
      </section>
    );
  }
}
