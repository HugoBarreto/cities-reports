import React, { useState, useContext, useRef, useEffect } from 'react';
import * as dc from 'dc';
import styled from 'styled-components';

import DataContext from './DataContext';

const Span = styled.span`
  padding: 4px;
  display: inline;
  cursor: pointer;
  float: right;
  &:hover: {
    background: '#ddd';
  }
`;

const Div = styled.div`
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 10px,
    & label: {
      textTransform: 'capitalize',
      textDecoration: 'underline',
    }
`;

const ResetButton = ({ chart }) => {
  return (
    <Span
      onClick={() => {
        chart.filterAll();
        dc.redrawAll();
      }}
    >
      reset
    </Span>
  );
};

export const ChartTemplate = ({ chartFunction, title, className }) => {
  /*
    We render the dc chart using an effect. We want to pass the chart as a prop
    after the dc call, but there is nothing by default to trigger a re-render and
    the prop, by default would be undefined.
    To solve this, we hold a state key and increment it after the effect ran.
    By passing the key to the parent div, we get a rerender once the chart is defined.
    */
  const [chart, updateChart] = useState(null);
  const { data } = useContext(DataContext);
  const div = useRef(null);

  useEffect(() => {
    // chartfunction takes the ref and does something with it
    const newChart = chartFunction(div.current, data);

    newChart.render();
    updateChart(newChart);
  }, 1);

  return (
    <Div ref={div} className={className}>
      <ResetButton chart={chart} />
      <label>{title}</label>
    </Div>
  );
};
