import React from 'react';
import * as dc from 'dc';
import PropTypes from 'prop-types';
import { scaleTime, utcHour, utcHours } from 'd3';

import LinkedChartsTemplate from './LinkedChartsTemplate';

const lineAndBarChartsFunc = ({ div1, div2, data }) => {
  const dimension = data.dimension(d => d.hours, true);
  const alertsGroup = dimension.group();
  const interactionsGroup = dimension.group().reduceSum(d => d.interactions);

  const volumeChart = dc.barChart(div1);

  volumeChart
    .height(80)
    .margins({ top: 0, right: 50, bottom: 20, left: 40 })
    .dimension(dimension)
    .group(alertsGroup, 'Total Alerts')
    .centerBar(true)
    .gap(1)
    .x(scaleTime().domain([new Date(2019, 11, 24), new Date(2019, 11, 30)]))
    .round(utcHour.round)
    .alwaysUseRounding(true)
    .xUnits(utcHour);

  const lineChart = dc.lineChart(div2);

  lineChart
    .dimension(dimension)
    .mouseZoomable(false)
    .rangeChart(volumeChart)
    .transitionDuration(1000)
    .x(scaleTime().domain([new Date(2019, 11, 24), new Date(2019, 11, 30)]))
    .round(utcHour.round)
    .xUnits(utcHours)
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
    .group(interactionsGroup, 'Hourly Interactions');
  /* .title(d => {
      let value = d.value ? d.value.avg : d.value;
      if (isNaN(value)) {
        value = 0;
      }
      return `${dateFormat(d.key)}\n${numberFormat(value)}`;
    }); */
  return [volumeChart, lineChart];
};

const InteractionLineChart = ({ reduxHandler }) => (
  <LinkedChartsTemplate
    chartFunction={lineAndBarChartsFunc}
    title="Hourly Alert Interactions"
    reduxHandler={reduxHandler}
  />
);

InteractionLineChart.propTypes = {
  reduxHandler: PropTypes.func.isRequired,
};

export default InteractionLineChart;
