import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import DefaultLayout from './layouts';
import WeeklyReport from './pages/WeeklyReport';
import { DataProvider } from './components/DataContext';

const baseUrl =
  'http://bd-fgv-public.s3.us-east-2.amazonaws.com/exports/IIEncontroRegional';

export default function Routes({ cities }) {
  return (
    <Switch>
      <Redirect exact from="/" to="/miraflores" />
      {cities.map(city => (
        <Route key={city.id} path={city.path}>
          <DataProvider url={city.url}>
            <DefaultLayout>
              <WeeklyReport city={city.name} />
            </DefaultLayout>
          </DataProvider>
        </Route>
      ))}
    </Switch>
  );
}

Routes.propTypes = {
  cities: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      path: PropTypes.string,
      name: PropTypes.string,
    })
  ),
};

Routes.defaultProps = {
  cities: [
    {
      id: 1,
      path: '/miraflores',
      name: 'Miraflores',
      url: `${baseUrl}/MirafloresAlerts.csv`,
    },
    {
      id: 2,
      path: '/montevideo',
      name: 'Montevideo',
      url: `${baseUrl}/MontevideoAlerts.csv`,
    },
    { id: 3, path: '/quito', name: 'Quito', url: `${baseUrl}/QuitoAlerts.csv` },
    {
      id: 4,
      path: '/sao-paulo',
      name: 'São Paulo',
      url: `${baseUrl}/SaoPauloAlerts.csv`,
    },
    {
      id: 5,
      path: '/xalapa',
      name: 'Xalapa',
      url: `${baseUrl}/XalapaAlerts.csv`,
    },
  ],
};
