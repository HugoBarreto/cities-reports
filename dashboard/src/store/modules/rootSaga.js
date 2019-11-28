import { all } from 'redux-saga/effects';

import weeklyDataSagas from './weeklyData/sagas';

export default function* rootSaga() {
  yield all([weeklyDataSagas]);
}
