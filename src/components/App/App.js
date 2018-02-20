import PropTypes from 'prop-types';
import React from 'react';
import { localize } from 'redux-i18n';
import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';
import { Route, Switch, Redirect } from 'react-router-dom';
import { Notifs } from 'redux-notifications';
import TopBarProgress from 'react-topbar-progress-indicator';
import { loadConfig as actionLoadConfig } from '../../actions/config';
import { loginUser as actionLoginUser, logoutUser as actionLogoutUser } from '../../actions/auth';
import { currentBackend } from '../../backends/backend';
import { createNewEntry } from '../../actions/collections';
import { openMediaLibrary as actionOpenMediaLibrary } from '../../actions/mediaLibrary';
import MediaLibrary from '../../components/MediaLibrary/MediaLibrary';
import { Loader, Toast } from '../../components/UI';
import { SIMPLE, EDITORIAL_WORKFLOW } from '../../constants/publishModes';
import Collection from '../../components/Collection/Collection';
import Workflow from '../../components/Workflow/Workflow';
import Editor from '../../components/Editor/Editor';
import NotFoundPage from './NotFoundPage';
import Header from './Header';

TopBarProgress.config({
  barColors: {
    /**
     * Uses value from CSS --colorActive.
     */
    "0": '#3a69c8',
    '1.0': '#3a69c8',
  },
  shadowBlur: 0,
  barThickness: 2,
});

class App extends React.Component {

  static propTypes = {
    t: PropTypes.func,
    openMediaLibrary: PropTypes.func,
    auth: ImmutablePropTypes.map,
    config: ImmutablePropTypes.map,
    collections: ImmutablePropTypes.orderedMap,
    logoutUser: PropTypes.func.isRequired,
    dispatch: PropTypes.func.isRequired,
    user: ImmutablePropTypes.map,
    isFetching: PropTypes.bool.isRequired,
    publishMode: PropTypes.oneOf([SIMPLE, EDITORIAL_WORKFLOW]),
  };

  static configError(config, t) {
    return (<div>
      <h1>{t('error-page.title')}</h1>
      {/* eslint-disable react/no-danger */}
      <div dangerouslySetInnerHTML={{ __html: t('error-page.body', { error: config.get('error') }) }} />
    </div>);
  }

  componentDidMount() {
    this.props.dispatch(actionLoadConfig());
  }

  handleLogin(credentials) {
    this.props.dispatch(actionLoginUser(credentials));
  }

  authenticating() {
    const { auth, t, config } = this.props;
    const backend = currentBackend(this.props.config);

    if (backend == null) {
      return <div><h1>{t('app.waiting')}</h1></div>;
    }

    return (
      <div>
        <Notifs CustomComponent={Toast} />
        {
          React.createElement(backend.authComponent(), {
            onLogin: this.handleLogin.bind(this),
            error: auth && auth.get('error'),
            isFetching: auth && auth.get('isFetching'),
            siteId: config.getIn(["backend", "site_domain"]),
            base_url: config.getIn(["backend", "base_url"], null),
          })
        }
      </div>
    );
  }

  render() {
    const {
      user,
      config,
      collections,
      logoutUser,
      isFetching,
      publishMode,
      openMediaLibrary,
      t,
    } = this.props;


    if (config === null) {
      return null;
    }

    if (config.get('error')) {
      return App.configError(config, t);
    }

    if (config.get('isFetching')) {
      return <Loader active>Loading configuration...</Loader>;
    }

    if (user == null) {
      return this.authenticating();
    }

    const defaultPath = `/collections/${ collections.first().get('name') }`;
    const hasWorkflow = publishMode === EDITORIAL_WORKFLOW;

    return (
      <div className="nc-app-container">
        <Notifs CustomComponent={Toast} />
        <Header
          user={user}
          collections={collections}
          onCreateEntryClick={createNewEntry}
          onLogoutClick={logoutUser}
          openMediaLibrary={openMediaLibrary}
          hasWorkflow={hasWorkflow}
          displayUrl={config.get('display_url')}
        />
        <div className="nc-app-main">
          { isFetching && <TopBarProgress /> }
          <div>
            <Switch>
              <Redirect exact from="/" to={defaultPath} />
              <Redirect exact from="/search/" to={defaultPath} />
              { hasWorkflow ? <Route path="/workflow" component={Workflow} /> : null }
              <Route exact path="/collections/:name" component={Collection} />
              <Route path="/collections/:name/new" render={props => <Editor {...props} newRecord />} />
              <Route path="/collections/:name/entries/:slug" component={Editor} />
              <Route path="/search/:searchTerm" render={props => <Collection {...props} isSearchResults />} />
              <Route component={NotFoundPage} />
            </Switch>
            <MediaLibrary />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  const { auth, config, collections, globalUI } = state;
  const user = auth && auth.get('user');
  const isFetching = globalUI.get('isFetching');
  const publishMode = config && config.get('publish_mode');

  return { auth, config, collections, user, isFetching, publishMode };
};

const mapDispatchToProps = dispatch => ({
  dispatch,
  openMediaLibrary: () => dispatch(actionOpenMediaLibrary()),
  logoutUser: () => dispatch(actionLogoutUser()),
});

export default connect(mapStateToProps, mapDispatchToProps)(localize()(App));
