import React from 'react';
import * as dc from 'dc';

import { ChartTemplate } from './ChartTemplate';
import { last } from './utils';

const directionChartFunc = (divRef, data) => {
  const dimension = data.dimension(({ magvar }) => {
    if (magvar > 315 || magvar <= 45) {
      return '1N';
    }
    if (magvar > 45 && magvar <= 135) {
      return '2E';
    }
    if (magvar > 135 && magvar <= 225) {
      return '3S';
    }
    return '4W';
  });
  const group = dimension.group();
  // .reduceSum(d => d.volume);

  const directionChart = dc.pieChart(divRef);
  directionChart /* dc.pieChart('#direction-chart', 'chartGroup') */
    .innerRadius(30)
    .dimension(dimension)
    .group(group)
    .ordering(dc.pluck('key'))
    .label(d => last(d.key));
  return directionChart;
};

export const DirectionChart = () => (
  <ChartTemplate
    chartFunction={directionChartFunc}
    title="Direction Breakdown"
  />
);
