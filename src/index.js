import React from 'react';
import createReactClass from 'create-react-class';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import I18n from 'redux-i18n';
import translations from './translations';
import history from './routing/history';
import configureStore from './redux/configureStore';
import { setStore } from './valueObjects/AssetProxy';
import { ErrorBoundary } from './components/UI';
import registry from './lib/registry';
import App from './components/App/App';
import './components/EditorWidgets';
import './components/MarkdownPlugins';
import './index.css';

/* global NETLIFY_CMS_VERSION b:true */
/**
 * Log the version number.
 */
// eslint-disable-next-line
console.log(`Netlify CMS version ${NETLIFY_CMS_VERSION}`);

/**
 * Create mount element dynamically.
 */
const el = document.createElement('div');
el.id = 'nc-root';
document.body.appendChild(el);

/**
 * Configure Redux store.
 */
const store = configureStore();
setStore(store);

/**
 * Create connected root component.
 */
const Root = () => (
  <ErrorBoundary>
    <Provider store={store}>
      <I18n translations={translations}>
        <ConnectedRouter history={history}>
          <Route component={App} />
        </ConnectedRouter>
      </I18n>
    </Provider>
  </ErrorBoundary>
);

/**
 * Render application root.
 */
render(<Root />, el);

/**
 * Add extension hooks to global scope.
 */
const CMS = { ...registry };
if (typeof window !== 'undefined') {
  window.CMS = CMS;
  window.createClass = window.createClass || createReactClass;
  window.h = window.h || React.createElement;
}

/**
 * Export the registry for projects that import the CMS.
 */
export default CMS;
