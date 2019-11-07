import React from 'react';
import * as dc from 'dc';

import { ChartTemplate } from './ChartTemplate';

const hourOfDayFunc = (divRef, data) => {
  const hourOfDayChart = dc.rowChart(divRef);
  const dimension = data.dimension(d => {
    return `${d.startTime.getHours()}`;
  });
  const group = dimension.group();

  hourOfDayChart.dimension(dimension).group(group);

  return hourOfDayChart;
};

export const HourOfDayChart = () => (
  <ChartTemplate chartFunction={hourOfDayFunc} title="Alerts by Day Hours" />
);
