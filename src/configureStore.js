/**
 * Create the store with dynamic reducers
 */

import { createStore, applyMiddleware, compose } from 'redux';
import { routerMiddleware } from 'react-router-redux';
import thunk from 'redux-thunk';

// ===持久化===
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/es/storage';
// ===end===

import createReducer from './reducers';

export default function configureStore(initialState = {}, history) {
  // Create the store with  middlewares
  // routerMiddleware: Syncs the location/URL path to the state
  const middlewares = [thunk, routerMiddleware(history)];

  const enhancers = [applyMiddleware(...middlewares)];

  // If Redux DevTools Extension is installed use it, otherwise use Redux compose
  /* eslint-disable no-underscore-dangle */
  const composeEnhancers =
    process.env.NODE_ENV !== 'production' &&
    typeof window === 'object' &&
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
      ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
        shouldHotReload: false,
      })
      : compose;
  /* eslint-enable */

  // 持久化改造 persist
  const config = {
    key: 'root',
    storage,
    // whitelist: ['login'],
  };

  const reducer = persistReducer(config, createReducer());

  const store = createStore(
    reducer,
    initialState,
    composeEnhancers(...enhancers)
  );

  // console.log(createReducer());
  // console.log(store);

  // Extensions
  store.injectedReducers = { _persist: null }; // Reducer registry

  // Make reducers hot reloadable, see http://mxs.is/googmo
  /* istanbul ignore next */
  // 这行还是有点问题的
  if (module.hot) {
    module.hot.accept('./reducers', () => {
      // 注入新的reducer
      store.replaceReducer(createReducer(store.injectedReducers));
    });
  }

  const persistor = persistStore(store);

  return { persistor, store };
}
