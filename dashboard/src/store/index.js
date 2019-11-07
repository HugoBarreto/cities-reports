import { createStore, applyMiddleware, compose } from 'redux';
import { taskMiddleware } from 'react-palm/tasks';
import rootReducer from './modules/rootReducer';

const middlewares = [taskMiddleware];
const enhancers = [applyMiddleware(...middlewares)];

const initialState = {};

export default createStore(rootReducer, initialState, compose(...enhancers));
