import { createStore, applyMiddleware, compose } from 'redux';
import { taskMiddleware } from 'react-palm/tasks';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './modules/rootReducer';
import rootSaga from './modules/rootSaga';

const sagaMonitor =
  process.env.NODE_ENV === 'development'
    ? console.tron.createSagaMonitor()
    : null;

const sagaMiddleware = createSagaMiddleware({ sagaMonitor });

const middlewares = [taskMiddleware, sagaMiddleware];
const enhancers =
  process.env.NODE_ENV === 'development'
    ? [console.tron.createEnhancer(), applyMiddleware(...middlewares)]
    : [applyMiddleware(...middlewares)];

const initialState = {};

const store = createStore(rootReducer, initialState, compose(...enhancers));

sagaMiddleware.run(rootSaga);

export { default as Constants } from './constants';
export default store;
