import React, { useContext, useState, useEffect } from 'react';
import { redrawAll } from 'dc';
import PropTypes from 'prop-types';
import { Row, Col, Button } from 'shards-react';

import { DataContext } from '../DataContext';
import SmallStat from './SmallStat';
import dataTemplate from '../../data/kepler-data-template';
import REDUX_ENUMS from '../../store/constants';
import { getPercentage, getStatLabel } from '../../utils';

function statsDataKey(type) {
  switch (type) {
    case 'ACCIDENT':
      return 'accident';
    case 'JAM':
      return 'jam';
    case 'HAZARD_ON_ROAD_POT_HOLE':
      return 'potHole';
    case 'HAZARD_WEATHER_FLOOD':
      return 'flood';
    case 'HAZARD_ON_ROAD_TRAFFIC_LIGHT_FAULT':
      return 'trafficLight';
    default:
      return 'others';
  }
}

const SmallStats = ({ smallStats, reduxHandler }) => {
  const [filters, setFilters] = useState([]);
  const [dimension, setDimension] = useState(null);
  const [alertTypes, setAlertTypes] = useState([]);
  const [statsData, setStatsData] = useState({});
  const { data, aggWeeks } = useContext(DataContext);

  useEffect(() => {
    const dsets = {};
    const sData = {};
    if (Array.isArray(aggWeeks) && aggWeeks.length) {
      aggWeeks.slice(-6).map(week => {
        if (week.query === 'ALERTS') {
          Object.keys(week.agg)
            .filter(type => REDUX_ENUMS.ALLOWED_ALERT_TYPES.includes(type))
            .map(type => {
              if (type in dsets) {
                dsets[type].push(week.agg[type]);
              } else {
                dsets[type] = [week.agg[type]];
              }
              return type;
            });
        }
        return week;
      });
      Object.keys(dsets).map(type => {
        const key = statsDataKey(type);
        sData[key] = {};
        sData[key].label = getStatLabel(type);
        sData[key].datasets =
          dsets[type].length < 6
            ? new Array(6 - dsets[type].length).fill(0).concat(dsets[type])
            : dsets[type];
        [sData[key].value] = sData[key].datasets.slice(-1);
        sData[key].percentage = getPercentage(
          sData[key].datasets.slice(-1)[0],
          sData[key].datasets.slice(-2)[0]
        );
        sData[key].increase =
          sData[key].datasets.slice(-1)[0] >= sData[key].datasets.slice(-2)[0];
        return type;
      });
    }
    setStatsData(sData);
  }, [aggWeeks]);

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
      reduxHandler(REDUX_ENUMS.SMALL_STATS_FILTER_KEPLER_DATA, {
        datasets: dataTemplate,
        options: {
          centerMap: true,
        },
      });
      redrawAll();
      return () => {
        dimension.filterAll();
      };
    }
    return () => {};
  }, [filters]);

  return (
    <>
      <Row>
        {alertTypes
          .filter(a => a.key !== 'others')
          .sort((a, b) => b.value - a.value)
          .map(({ key: alert, value }, idx) => {
            const stats = smallStats[idx];
            stats.label = statsData[alert].label;
            stats.value = statsData[alert].value;
            stats.datasets[0].data = statsData[alert].datasets;
            stats.percentage = statsData[alert].percentage;
            stats.increase = statsData[alert].increase;
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
  smallStats: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string,
      value: PropTypes.string,
      percentage: PropTypes.string,
      increase: PropTypes.bool,
      decrease: PropTypes.bool,
      chartLabels: PropTypes.arrayOf(PropTypes.string),
      attrs: PropTypes.objectOf(PropTypes.string),
      datasets: PropTypes.arrayOf(
        PropTypes.shape({
          label: PropTypes.string,
          fill: PropTypes.string,
          borderWidth: PropTypes.number,
          backgroundColor: PropTypes.string,
          borderColor: PropTypes.string,
          data: PropTypes.arrayOf(PropTypes.number),
        })
      ),
    })
  ),
  reduxHandler: PropTypes.func.isRequired,
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
