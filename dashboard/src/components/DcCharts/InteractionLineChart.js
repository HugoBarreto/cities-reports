import React from 'react';
import * as dc from 'dc';
import { scaleTime, utcHour, utcHours } from 'd3';

import { dateFormat, numberFormat } from './utils';
import { ChartTemplate } from './ChartTemplate';

/* const reducerAdd = (point, v) => {
  const p = point;
  p.days += 1;
  p.total += (v.open + v.close) / 2;
  p.avg = Math.round(p.total / p.days);
  return p;
};

const reducerRemove = (point, v) => {
  const p = point;
  p.days -= 1;
  p.total -= (v.open + v.close) / 2;
  p.avg = p.days ? Math.round(p.total / p.days) : 0;
  return p;
};

const reducerInitial = () => ({ days: 0, total: 0, avg: 0 }); */

const moveChartFunc = (divRef, data) => {
  const lineChart = dc.lineChart(divRef);

  const dimension = data.dimension(d => d.hours, true);

  const interactionsGroup = dimension.group().reduceSum(d => d.interactions);
  const alertsGroup = dimension.group();
  // .reduce(reducerAdd, reducerRemove, reducerInitial);

  lineChart
    .dimension(dimension)
    .mouseZoomable(true)
    .transitionDuration(1000)
    .x(scaleTime().domain([new Date(2019, 9, 26), new Date(2019, 10, 3)]))
    .round(utcHour.round)
    .xUnits(utcHours)
    .elasticY(false)
    .renderHorizontalGridLines(true)
    .legend(
      dc
        .legend()
        .x(800)
        .y(10)
        .itemHeight(13)
        .gap(5)
    )
    .brushOn(false)
    .group(interactionsGroup, 'Hourly Interactions');
  /* .title(d => {
      let value = d.value ? d.value.avg : d.value;
      if (isNaN(value)) {
        value = 0;
      }
      return `${dateFormat(d.key)}\n${numberFormat(value)}`;
    }); */

  return lineChart;
};

export const InteractionLineChart = () => (
  <ChartTemplate
    chartFunction={moveChartFunc}
    title="Hourly Alert Interactions"
  />
);
