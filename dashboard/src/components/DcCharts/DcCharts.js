import React from 'react';
import PropTypes from 'prop-types';
import { Row, Col } from 'shards-react';
// import styled from 'styled-components';

import DayOfWeekChart from './DayOfWeekChart';
import HourOfDayChart from './HourOfDayChart';
import InteractionLineChart from './InteractionLineChart';
import KeplerAlerts from './KeplerAlerts';

// const Div = styled.div`
//   padding: 1rem;
//   margin-top: 2rem;
// `;

const DcCharts = ({ keplerId, reduxHandler }) => {
  return (
    <>
      <Row className="mb-2 equal">
        <Col sm={12} md={8} className="px-2">
          <Row className="mb-3">
            <Col sm={12}>
              <KeplerAlerts id={keplerId} reduxHandler={reduxHandler} />
            </Col>
          </Row>
        </Col>
        <Col md={4} sm={12} className="px-2">
          <Row className="mb-3">
            <Col sm={12}>
              <DayOfWeekChart reduxHandler={reduxHandler} />
            </Col>
          </Row>
          <Row className="mb-3">
            <Col sm={12}>
              <HourOfDayChart reduxHandler={reduxHandler} />
            </Col>
          </Row>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={12}>
          <InteractionLineChart reduxHandler={reduxHandler} />
        </Col>
      </Row>
      <Row className="mb-3" />
      {/* <Row>
        <Col md={7}>
          <Row>
            <Col md={12}>
              <MoveChart />
            </Col>
          </Row>
          <Row>
            <Col md={6}>
              <GainOrLossChart />
            </Col>
            <Col md={6}>
              <FluctuationChart />
            </Col>

            <Col md={6}>
              <QuarterChart />
            </Col>
            <Col md={6} />
          </Row>
        </Col>
        <Col
          md={5}
          style={{ overflowY: 'scroll', maxHeight: '70vh', width: '100%' }}
        >
          <DataTable />
        </Col>
      </Row> */}
    </>
  );
};

DcCharts.propTypes = {
  keplerId: PropTypes.string.isRequired,
  reduxHandler: PropTypes.func.isRequired,
};

export default DcCharts;
