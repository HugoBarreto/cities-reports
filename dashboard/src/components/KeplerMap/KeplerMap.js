import React, { Component } from 'react';
import { connect } from 'react-redux';
import AutoSizer from 'react-virtualized/dist/commonjs/AutoSizer';
import { addDataToMap, wrapTo } from 'kepler.gl/actions';
import KeplerGl from 'kepler.gl';

import sampleData from '../../data/sample-data';

const MAPBOX_TOKEN = process.env.MapboxAccessToken; // eslint-disable-line

class KeplerMap extends Component {
  componentDidMount() {
    this.props.dispatch(
      wrapTo(
        // this.props.id,
        'map',
        addDataToMap({
          datasets: sampleData,
          options: {
            centerMap: true,
          },
        })
      )
    );
  }

  render() {
    return (
      <AutoSizer>
        {({ height, width }) => (
          <KeplerGl
            mapboxApiAccessToken={MAPBOX_TOKEN}
            id="map"
            width={width}
            height={height}
          />
        )}
      </AutoSizer>
    );
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  dispatchToProps
)(KeplerMap);
