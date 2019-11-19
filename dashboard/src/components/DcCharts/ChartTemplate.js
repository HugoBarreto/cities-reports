import React, { useState, useContext, useRef, useEffect } from 'react';
import * as dc from 'dc';
import { Row, Col, Card, CardHeader, CardBody, CardTitle } from 'shards-react';
import styled from 'styled-components';

import { DataContext } from '../DataContext';
import { ResetButton } from './ResetButton';

const Div = styled.div`
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 5px,
    & label: {
      textTransform: 'capitalize',
      textDecoration: 'underline',
    }
`;

export const ChartTemplate = ({
  chartFunction,
  title,
  className = '',
  titleClassName = '',
  resetClassName = 'd-flex ml-auto',
  resetText = 'Reset',
}) => {
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

    newChart.on('filtered', () =>
      console.log(`filtered chart ${newChart.chartID()}`)
    );
    newChart.render();
    updateChart(newChart);
  }, 1);

  return (
    <Card>
      <CardHeader className="border-bottom">
        <Row className="align-items-center">
          <Col>
            <CardTitle className={titleClassName}>{title}</CardTitle>
          </Col>
          <Col>
            <ResetButton
              chart={chart}
              text={resetText}
              className={resetClassName}
            />
          </Col>
        </Row>
      </CardHeader>
      <CardBody className="">
        <Div ref={div} className={className} />
      </CardBody>
    </Card>
  );
};
