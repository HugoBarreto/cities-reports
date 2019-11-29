import React from 'react';
import * as dc from 'dc';
import { scaleOrdinal } from 'd3';
import PropTypes from 'prop-types';

import ChartTemplate from './ChartTemplate';

const hourOfDayFunc = ({ div, data }) => {
  const hourOfDayChart = dc.barChart(div);
  const dimension = data.dimension(
    d => d.hours.map(date => date.getHours()),
    true
  );
  const group = dimension.group();

  hourOfDayChart
    .dimension(dimension)
    .group(group)
    .gap(2)
    .x(scaleOrdinal())
    .xUnits(dc.units.ordinal)
    .height(250)
    .renderHorizontalGridLines(true)
    .elasticY(true)
    .yAxisLabel('Total Alerts')
    .xAxisLabel('Hour');

  const ticks = group.all().map((g, i) => (!(i % 2) ? g.key : null));

  hourOfDayChart
    .xAxis()
    .tickValues(ticks)
    .tickSizeOuter(0);

  hourOfDayChart.yAxis().ticks(5);

  return hourOfDayChart;
};

const HourOfDayChart = ({ reduxHandler }) => (
  <ChartTemplate
    chartFunction={hourOfDayFunc}
    chartName="HourOfDay"
    title="Active Alerts by Hour"
    reduxHandler={reduxHandler}
  />
);

HourOfDayChart.propTypes = {
  reduxHandler: PropTypes.func.isRequired,
};

export default HourOfDayChart;
