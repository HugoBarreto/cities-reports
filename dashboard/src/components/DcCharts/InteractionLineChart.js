import React from 'react';
import * as dc from 'dc';
import PropTypes from 'prop-types';
import { scaleTime, utcHour, utcHours } from 'd3';

import ChartTemplate from './ChartTemplate';

const moveChartFunc = ({ div, data }) => {
  const lineChart = dc.lineChart(div);
  const dimension = data.dimension(d => d.hours, true);
  const interactionsGroup = dimension.group().reduceSum(d => d.interactions);

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

const InteractionLineChart = ({ reduxHandler }) => (
  <ChartTemplate
    chartFunction={moveChartFunc}
    title="Hourly Alert Interactions"
    reduxHandler={reduxHandler}
  />
);

InteractionLineChart.propTypes = {
  reduxHandler: PropTypes.func.isRequired,
};

export default InteractionLineChart;
