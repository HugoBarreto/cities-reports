import { addDataToMap } from 'kepler.gl/actions';

import REDUX_ENUMS from './constants';

export function keplerMountAddData({ mapDispatch, dispatch, data }) {
  dispatch({ type: REDUX_ENUMS.KEPLER_MOUNT_ADD_DATA_TO_MAP });
  mapDispatch(addDataToMap(data));
}

export function dcChartFilterKeplerData({ mapDispatch, dispatch, data }) {
  dispatch({ type: REDUX_ENUMS.DC_CHART_FILTER_KEPLER_DATA });
  mapDispatch(addDataToMap(data));
}

export function smallStatsFilterKeplerData({ mapDispatch, dispatch, data }) {
  dispatch({ type: REDUX_ENUMS.SMALL_STATS_FILTER_KEPLER_DATA });
  mapDispatch(addDataToMap(data));
}
