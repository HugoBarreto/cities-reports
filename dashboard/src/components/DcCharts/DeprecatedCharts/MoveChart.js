import React from 'react';
import * as dc from 'dc';
import { scaleTime, timeMonth, timeMonths } from 'd3';

import { dateFormat, numberFormat } from './utils';
import { ChartTemplate } from './ChartTemplate';

const reducerAdd = (point, v) => {
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

const reducerInitial = () => ({ days: 0, total: 0, avg: 0 });
const moveChartFunc = (divRef, data) => {
  const dimension = data.dimension(d => d.month);

  const moveChart = dc.lineChart(divRef);
  const monthlyMoveGroup = dimension
    .group()
    .reduceSum(d => Math.abs(d.close - d.open));
  const indexAvgByMonthGroup = dimension
    .group()
    .reduce(reducerAdd, reducerRemove, reducerInitial);

  moveChart
    .dimension(dimension)
    .mouseZoomable(true)
    .transitionDuration(1000)
    .x(scaleTime().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
    .round(timeMonth.round)
    .xUnits(timeMonths)
    .elasticY(true)
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
    .group(indexAvgByMonthGroup, 'Monthly Index Average')
    .valueAccessor(d => {
      return d.value.avg;
    })
    .stack(monthlyMoveGroup, 'Monthly Index Move', d => {
      return d.value;
    })
    .title(d => {
      let value = d.value.avg ? d.value.avg : d.value;
      if (isNaN(value)) {
        value = 0;
      }
      return `${dateFormat(d.key)}\n${numberFormat(value)}`;
    });

  return moveChart;
};

export const MoveChart = () => (
  <ChartTemplate chartFunction={moveChartFunc} title="Monthly Price Moves" />
);
