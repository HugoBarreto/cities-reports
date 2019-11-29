import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';
import PropTypes from 'prop-types';
import { Card, CardBody } from 'shards-react';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

const KeplerMap = ({ id }) => {
  return (
    <Card>
      <CardBody style={{ minHeight: '600px' }}>
        <AutoSizer>
          {({ height, width }) => (
            <KeplerGl
              mapboxApiAccessToken={MAPBOX_TOKEN}
              id={id}
              width={width}
              height={height}
            />
          )}
        </AutoSizer>
      </CardBody>
    </Card>
  );
};

KeplerMap.propTypes = {
  id: PropTypes.oneOf([PropTypes.string, PropTypes.number]).isRequired,
};

export default KeplerMap;
