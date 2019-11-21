import React from 'react';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import KeplerGl from 'kepler.gl';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

export default ({ id }) => {
  return (
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
  );
};
