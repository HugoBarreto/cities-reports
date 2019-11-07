import React from 'react';
import { Row, Col } from 'shards-react';
import styled from 'styled-components';

import DataProvider from './DataProvider';
import { BubbleChart } from './BubbleChart';
import { GainOrLossChart } from './GainOrLessChart';
import { QuarterChart } from './QuarterChart';
import { DayOfWeekChart } from './DayOfWeekChart';
import { FluctuationChart } from './FluctuationChart';
import { MoveChart } from './MoveChart';
import { DataTable } from './NasdaqTable';

const Div = styled.div`
  padding: 1rem;
  margin-top: 2rem;
`;

export default () => {
  return (
    <Div>
      <DataProvider>
        <Row>
          <Col md={12}>
            <BubbleChart />
          </Col>
        </Row>
        <Row>
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
              <Col md={6}>
                <DayOfWeekChart />
              </Col>
            </Row>
          </Col>
          <Col
            md={5}
            style={{ overflowY: 'scroll', maxHeight: '70vh', width: '100%' }}
          >
            <DataTable />
          </Col>
        </Row>
      </DataProvider>
    </Div>
  );
};
