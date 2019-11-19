import React from 'react';
import * as dc from 'dc';
import { scaleLinear } from 'd3';

import { numberFormat } from './utils';
import { ChartTemplate } from './ChartTemplate';

const fluctuationChartFunc = (divRef, data) => {
  const fluctuationChart = dc.barChart(divRef);
  const dimension = data.dimension(d =>
    Math.round(((d.close - d.open) / d.open) * 100)
  );
  const group = dimension.group();
  fluctuationChart
    .dimension(dimension)
    .group(group)
    .gap(1)
    .x(scaleLinear().domain([-25, 25]))
    .valueAccessor(x => Math.log10(1 + x.value))
    .centerBar(true)
    .round(dc.round.floor)
    .renderHorizontalGridLines(true)
    .filterPrinter(filters => {
      const filter = filters[0];
      let s = '';
      s += `${numberFormat(filter[0])}% -> ${numberFormat(filter[1])}%`;
      return s;
    });

  fluctuationChart.xAxis().tickFormat(v => {
    return `${v}%`;
  });
  fluctuationChart.yAxis().ticks(5);

  return fluctuationChart;
};

export const FluctuationChart = () => (
  <ChartTemplate
    chartFunction={fluctuationChartFunc}
    title="Return Distribution"
  />
);
