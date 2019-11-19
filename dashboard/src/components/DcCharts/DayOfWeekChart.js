import React from 'react';
import * as dc from 'dc';

import { ChartTemplate } from './ChartTemplate';

const dayOfWeekFunc = (divRef, data) => {
  const dayOfWeekChart = dc.rowChart(divRef);

  const dimension = data.dimension(d => {
    const startDay = d.startTime.getDay();
    const endDay = d.endTime.getDay();
    const name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    if (startDay === endDay) {
      return [`${startDay}.${name[startDay]}`];
    }
    return [`${startDay}.${name[startDay]}`, `${endDay}.${name[endDay]}`];
  }, true);
  const group = dimension.group();

  dayOfWeekChart
    .dimension(dimension)
    .group(group)
    .ordering(dc.pluck('key'))
    .label(({ key }) => key.slice(2, key.length + 1));

  return dayOfWeekChart;
};

export const DayOfWeekChart = () => (
  <ChartTemplate chartFunction={dayOfWeekFunc} title="Weekday" />
);
