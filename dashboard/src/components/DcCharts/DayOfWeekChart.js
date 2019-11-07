import React from 'react';
import * as dc from 'dc';

import { ChartTemplate } from './ChartTemplate';

const dayOfWeekFunc = (divRef, data) => {
  const dayOfWeekChart = dc.rowChart(divRef);
  const dimension = data.dimension(d => {
    const day = d.startTime.getDay();
    const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return `${day}.${name[day]}`;
  });
  const group = dimension.group();

  dayOfWeekChart.dimension(dimension).group(group);

  return dayOfWeekChart;
};

export const DayOfWeekChart = () => (
  <ChartTemplate chartFunction={dayOfWeekFunc} title="Weekday" />
);