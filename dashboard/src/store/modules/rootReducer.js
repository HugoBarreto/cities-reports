import { combineReducers } from 'redux';
import keplerGlReducer from 'kepler.gl/reducers';

import sidebar from './sidebar/reducer';

export default combineReducers({
  keplerGl: keplerGlReducer,
  sidebar,
});
