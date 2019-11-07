import React, { Component } from 'react';
import * as crossfilter from 'crossfilter2';
import { csv, timeMonth, utcHour } from 'd3';
import 'dc/dc.css';

import { dateUTCFormatParser, dateFormatParser } from './utils';
import DataContext from './DataContext';

export default class DataProvider extends Component {
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
    csv('./MirafloresAlertsTest.csv').then(data => {
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
        entry.hours = utcHour.range(
          utcHour(d.start_time),
          utcHour.offset(utcHour(d.end_time), 1)
        );
        /* entry.dd = dateFormatParser(entry.date);
        entry.month = timeMonth(entry.dd); // pre-calculate month for better performance
        entry.close = +entry.close; // coerce to number
        entry.open = +entry.open; */
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
