import React, { Component, useContext } from 'react';
import { connect } from 'react-redux';
import { addDataToMap, wrapTo } from 'kepler.gl/actions';
// import styled from 'styled-components';

import { DataContext } from '../DataContext';
import dataTemplate from '../../data/kepler-data-template';
import KeplerMap from '../KeplerMap';

class KeplerAlerts extends Component {
  static contextType = DataContext;

  componentDidMount() {
    const { id, dispatch } = this.props;
    const { data } = this.context;

    dataTemplate.data.rows = data.all().map(d => d.kepler);

    dispatch(
      wrapTo(
        // this.props.id,
        id,
        addDataToMap({
          datasets: dataTemplate,
          options: {
            centerMap: true,
          },
        })
      )
    );
  }

  render() {
    const { id } = this.props;
    return <KeplerMap id={id} />;
  }
}

const mapStateToProps = state => state;
const dispatchToProps = dispatch => ({ dispatch });

export default connect(
  mapStateToProps,
  dispatchToProps
)(KeplerAlerts);
