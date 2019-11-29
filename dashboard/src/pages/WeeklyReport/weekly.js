import React from 'react';
import PropTypes from 'prop-types';
import { connect, useDispatch } from 'react-redux';
import { forwardTo } from 'kepler.gl/actions';
import { Container, Row } from 'shards-react';

import REDUX_ENUMS from '../../store/constants';
import {
  keplerMountAddData,
  dcChartFilterKeplerData,
  smallStatsFilterKeplerData,
} from '../../store/actions';

// import { Container } from './styles';
import PageTitle from '../../components/PageTitle';
import SmallStats from '../../components/SmallStats';
import DcCharts from '../../components/DcCharts';

const WeeklyReport = ({ city }) => {
  const keplerId = `${city}-map`;
  const dispatch = useDispatch();
  const mapDispatch = forwardTo(keplerId, dispatch);

  function reduxHandler(type, data) {
    switch (type) {
      case REDUX_ENUMS.KEPLER_MOUNT_ADD_DATA_TO_MAP:
        keplerMountAddData({ mapDispatch, dispatch, data });
        break;
      case REDUX_ENUMS.DC_CHART_FILTER_KEPLER_DATA:
        dcChartFilterKeplerData({ mapDispatch, dispatch, data });
        break;
      case REDUX_ENUMS.SMALL_STATS_FILTER_KEPLER_DATA:
        smallStatsFilterKeplerData({ mapDispatch, dispatch, data });
        break;
      default:
        break;
    }
  }

  return (
    <Container fluid className="main-content-container px-4">
      {/* Page Header */}
      <Row noGutters className="page-header py-2">
        <PageTitle
          title={city}
          subtitle="Weekly Report"
          className="text-sm-left mb-3"
        />
      </Row>

      {/* Small Stats Blocks */}
      <SmallStats reduxHandler={reduxHandler} />

      <DcCharts keplerId={keplerId} reduxHandler={reduxHandler} />
    </Container>
  );
};

WeeklyReport.propTypes = {
  city: PropTypes.string.isRequired,
};

export default connect()(WeeklyReport);
