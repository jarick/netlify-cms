import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import waitUntilAction from './middleware/waitUntilAction';
import reducer from '../reducers/combinedReducer';
import historyMiddlware from './middleware/history';

export default function configureStore(initialState) {
  const store = createStore(reducer, initialState, compose(
    applyMiddleware(thunkMiddleware, historyMiddlware, waitUntilAction),
    window.devToolsExtension ? window.devToolsExtension() : f => f
  ));

  return store;
}
