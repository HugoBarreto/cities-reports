import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
// import styled from 'styled-components';

import { DataContext } from '../DataContext';
import dataTemplate from '../../data/kepler-data-template';
import KeplerMap from '../KeplerMap';
import REDUX_ENUMS from '../../store/constants';

function KeplerAlerts({ id, reduxHandler }) {
  const { data } = useContext(DataContext);

  useEffect(() => {
    dataTemplate.data.rows = data.all().map(d => d.kepler);
    reduxHandler(REDUX_ENUMS.KEPLER_MOUNT_ADD_DATA_TO_MAP, {
      datasets: dataTemplate,
      options: {
        centerMap: true,
      },
    });
  }, []);

  return <KeplerMap id={id} />;
}

KeplerAlerts.propTypes = {
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
  reduxHandler: PropTypes.func.isRequired,
};

export default KeplerAlerts;
export { REDUX_ENUMS };
