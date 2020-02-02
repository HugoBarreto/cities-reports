import React, { Component } from 'react';
import crossfilter from 'crossfilter2';
import { csv, utcHour } from 'd3';
import 'dc/dc.css';

import api from '../../services/api';
import { dateUTCFormatParser, parseAlertTypeSubtype } from '../../utils';

export const DataContext = React.createContext({ data: {} });

export class DataProvider extends Component {
  constructor(props) {
    super(props);
    this.state = { loading: false, hasData: false };
  }

  async componentDidMount() {
    const { loading, hasData } = this.state;
    if (hasData || loading) {
      return;
    }
    this.setState({ loading: true });
    const { url, aggFile } = this.props;
    const { data: aggWeeks } = await api.get(aggFile);
    this.aggWeeks = aggWeeks.map(week => {
      week.date = new Date(week.date);
      return week;
    });
    // Generalizar isso aqui
    csv(url).then(data => {
      // csv('./ndx.csv').then(data => {
      data.forEach(d => {
        const entry = d;
        entry.alertType = parseAlertTypeSubtype(d.type, d.subtype);
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
      <DataContext.Provider
        value={{ data: this.data, aggWeeks: this.aggWeeks }}
      >
        <div ref={this.parent}>{children}</div>
      </DataContext.Provider>
    );
  }
}
