import React, { Component } from 'react';
import crossfilter from 'crossfilter2';
import { csv, utcHour } from 'd3';
import 'dc/dc.css';

import { dateUTCFormatParser } from '../../utils';

export const DataContext = React.createContext({ data: {} });

export class DataProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, hasData: false };
  }

  componentDidMount() {
    const { loading, hasData } = this.state;
    if (hasData || loading) {
      return;
    }
    this.setState({ loading: true });
    // Generalizar isso aqui
    csv('./MirafloresAlerts.csv').then(data => {
      // csv('./ndx.csv').then(data => {
      data.forEach(d => {
        const entry = d;
        entry.interactions = +d.interactions;
        entry.longitude = +d.longitude;
        entry.latitude = +d.latitude;
        entry.startTime = dateUTCFormatParser(d.start_time);
        entry.endTime = dateUTCFormatParser(d.end_time);
        entry.reliability = +d.reliability;
        entry.confidence = +d.confidence;
        entry.magvar = +d.magvar;
        entry.duration_min = +d.duration_min;
        entry.kepler = Object.values(entry);
        entry.hours = utcHour.range(
          utcHour(d.startTime),
          utcHour.offset(utcHour(d.endTime), 1)
        );
      });

      this.data = crossfilter(data); // TODO possibly need to update this
      this.setState({ loading: false, hasData: true });
    });
  }

  render() {
    const { hasData } = this.state;
    const { children } = this.props;

    if (!hasData) {
      return null;
    }
    return (
      <DataContext.Provider value={{ data: this.data }}>
        <div ref={this.parent}>{children}</div>
      </DataContext.Provider>
    );
  }
}
