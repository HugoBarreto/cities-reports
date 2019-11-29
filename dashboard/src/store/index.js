import { createStore, applyMiddleware, compose } from 'redux';
import { enhanceReduxMiddleware } from 'kepler.gl/middleware';

import rootReducer from './modules/rootReducer';

const middlewares = enhanceReduxMiddleware([]);
/* const enhancers =
  process.env.NODE_ENV === 'development'
    ? [console.tron.createEnhancer(), applyMiddleware(...middlewares)]
    : [applyMiddleware(...middlewares)];
 */
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

const store = createStore(rootReducer, initialState, compose(...enhancers));

export { default as Constants } from './constants';
export default store;
