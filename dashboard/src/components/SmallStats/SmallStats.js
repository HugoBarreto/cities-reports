import React, { useContext, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { addDataToMap, wrapTo } from 'kepler.gl/actions';
import { redrawAll } from 'dc';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'shards-react';

import { DataContext } from '../DataContext';
import SmallStat from './SmallStat';
import dataTemplate from '../../data/kepler-data-template';

const SmallStats = ({ smallStats }) => {
  const [filters, setFilters] = useState([]);
  const [dimension, setDimension] = useState(null);
  const [alertTypes, setAlertTypes] = useState([]);
  const { data } = useContext(DataContext);
  const dispatch = useDispatch();

  // We want to define dimesion only once, then keep it
  useEffect(() => {
    setDimension(data.dimension(d => d.alertType));
  }, [data]);

  // Get the alertTypes when dimesion is defined
  useEffect(() => {
    setAlertTypes(dimension ? dimension.group().all() : []);
  }, [dimension]);

  useEffect(() => {
    if (dimension) {
      if (Array.isArray(filters) && filters.length) {
        dimension.filter(alertType => filters.includes(alertType));
      } else {
        dimension.filterAll();
      }
      dataTemplate.data.rows = data.allFiltered().map(d => d.kepler);
      dispatch(
        wrapTo(
          // this.props.id,
          'map',
          addDataToMap({
            datasets: dataTemplate,
            options: {
              centerMap: true,
            },
          })
        )
      );
      redrawAll();
      return () => {
        dimension.filterAll();
      };
    }
    return () => {};
  });

  return (
    <>
      <Row>
        {alertTypes
          .filter(a => a.key !== 'others')
          .sort((a, b) => b.value - a.value)
          .map(({ key: alert, value }, idx) => {
            const stats = smallStats[idx];
            stats.label = alert;
            stats.value = value;
            return (
              <Col className="col-lg mb-4" key={alert} {...stats.attrs}>
                <SmallStat
                  id={`small-stats-${idx}`}
                  variation="1"
                  chartData={stats.datasets}
                  chartLabels={stats.chartLabels}
                  label={stats.label}
                  value={stats.value}
                  percentage={stats.percentage}
                  increase={stats.increase}
                  decrease={stats.decrease}
                />
                <Button
                  key={alert}
                  theme="info"
                  // size="lg"
                  block
                  className="mt-2"
                  active={!!filters.includes(alert)}
                  onClick={() => {
                    if (filters.includes(alert)) {
                      setFilters(filters.filter(a => a !== alert));
                    } else {
                      setFilters([...filters, alert]);
                    }
                  }}
                >
                  <span style={{ 'font-size': 'larger' }}>Filter</span>
                </Button>
              </Col>
            );
          })}
      </Row>
    </>
  );
};

SmallStats.propTypes = {
  smallStats: PropTypes.array,
};

SmallStats.defaultProps = {
  smallStats: [
    {
      label: 'Posts',
      value: '2,390',
      percentage: '4.7%',
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '6', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(0, 184, 216, 0.1)',
          borderColor: 'rgb(0, 184, 216)',
          data: [1, 2, 1, 3, 5, 4, 7],
        },
      ],
    },
    {
      label: 'Pages',
      value: '182',
      percentage: '12.4',
      increase: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '6', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(23,198,113,0.1)',
          borderColor: 'rgb(23,198,113)',
          data: [1, 2, 3, 3, 3, 4, 4],
        },
      ],
    },
    {
      label: 'Comments',
      value: '8,147',
      percentage: '3.8%',
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,180,0,0.1)',
          borderColor: 'rgb(255,180,0)',
          data: [2, 3, 3, 3, 4, 3, 3],
        },
      ],
    },
    {
      label: 'New Customers',
      value: '29',
      percentage: '2.71%',
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgba(255,65,105,0.1)',
          borderColor: 'rgb(255,65,105)',
          data: [1, 7, 1, 3, 1, 4, 8],
        },
      ],
    },
    {
      label: 'Subscribers',
      value: '17,281',
      percentage: '2.4%',
      increase: false,
      decrease: true,
      chartLabels: [null, null, null, null, null, null, null],
      attrs: { md: '4', sm: '6' },
      datasets: [
        {
          label: 'Today',
          fill: 'start',
          borderWidth: 1.5,
          backgroundColor: 'rgb(0,123,255,0.1)',
          borderColor: 'rgb(0,123,255)',
          data: [3, 2, 3, 2, 4, 5, 4],
        },
      ],
    },
  ],
};

export default SmallStats;
