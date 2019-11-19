import React from 'react';
import * as dc from 'dc';
import { scaleBand } from 'd3';

import { ChartTemplate } from './ChartTemplate';

const hourOfDayFunc = (divRef, data) => {
  const hourOfDayChart = dc.barChart(divRef);
  const dimension = data.dimension(
    d => d.hours.map(date => date.getHours()),
    true
  );
  const group = dimension.group();

  hourOfDayChart
    .dimension(dimension)
    .group(group)
    .gap(1)
    .x(scaleBand())
    .xUnits(dc.units.ordinal)
    .height(250)
    .renderHorizontalGridLines(true)
    .yAxisLabel('Total Alerts')
    .xAxisLabel('Hour');

  hourOfDayChart.yAxis().ticks(5);

  return hourOfDayChart;
};

export const HourOfDayChart = () => (
  <ChartTemplate chartFunction={hourOfDayFunc} title="Active Alerts by Hour" />
);
