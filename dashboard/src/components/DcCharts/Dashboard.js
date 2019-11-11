import React from 'react';
import { Row, Col, Card, CardBody } from 'shards-react';
import styled from 'styled-components';

import DataProvider from './DataProvider';
import { BubbleChart } from './BubbleChart';
import { GainOrLossChart } from './GainOrLessChart';
import { DirectionChart } from './DirectionChart';
import { DayOfWeekChart } from './DayOfWeekChart';
import { HourOfDayChart } from './HourOfDayChart';
import { InteractionLineChart } from './InteractionLineChart';
import { FluctuationChart } from './FluctuationChart';
import { MoveChart } from './MoveChart';
import { DataTable } from './NasdaqTable';

// const Div = styled.div`
//   padding: 1rem;
//   margin-top: 2rem;
// `;

export default () => {
  return (
    <DataProvider>
      <Row className="mb-3">
        <Col sm={8}>
          <Card>
            <CardBody>
              <InteractionLineChart />
            </CardBody>
          </Card>
        </Col>
        <Col md={4} sm={6}>
          <Card>
            <CardBody>
              <DayOfWeekChart />
            </CardBody>
          </Card>
        </Col>
      </Row>
      <Row className="mb-3">
        <Col sm={6}>
          <Card>
            <CardBody>
              <HourOfDayChart />
            </CardBody>
          </Card>
        </Col>
      </Row>
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
    </DataProvider>
  );
};
