import React, { useState, useContext, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Row, Col, Card, CardHeader, CardBody, CardTitle } from 'shards-react';
import styled from 'styled-components';

import { DataContext } from '../DataContext';
import { ResetButton } from './ResetButton';
import dataTemplate from '../../data/kepler-data-template';
import REDUX_ENUMS from '../../store/constants';

const Div = styled.div`
    width: 100%;
    height: auto;
    box-sizing: border-box;
    padding: 5px;
    & label: {
      textTransform: 'capitalize',
      textDecoration: 'underline',
    }
`;

const ChartTemplate = ({
  chartFunction,
  title,
  reduxHandler,
  className,
  titleClassName,
  resetClassName,
  resetText,
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
  const div1 = useRef(null);
  const div2 = useRef(null);

  useEffect(() => {
    // chartfunction takes the ref and does something with it
    const [newChart, secondChart] = chartFunction({
      div1: div1.current,
      div2: div2.current,
      data,
    });

    newChart.on('filtered', () => {
      dataTemplate.data.rows = data.allFiltered().map(d => d.kepler);
      return reduxHandler(REDUX_ENUMS.DC_CHART_FILTER_KEPLER_DATA, {
        datasets: dataTemplate,
        options: {
          centerMap: true,
        },
      });
    });

    newChart.render();
    secondChart.render();

    updateChart(newChart);
  }, []);

  return (
    <Card>
      <CardHeader className="border-bottom">
        <Row className="align-items-center">
          <Col xs={8}>
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
      <CardBody className={className}>
        <Div ref={div2} />
        <Div ref={div1} />
      </CardBody>
    </Card>
  );
};

ChartTemplate.propTypes = {
  chartFunction: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  reduxHandler: PropTypes.func.isRequired,
  className: PropTypes.string,
  titleClassName: PropTypes.string,
  resetClassName: PropTypes.string,
  resetText: PropTypes.string,
};

ChartTemplate.defaultProps = {
  className: 'p-1',
  titleClassName: '',
  resetClassName: 'd-flex ml-auto',
  resetText: 'Reset',
};

export default ChartTemplate;
