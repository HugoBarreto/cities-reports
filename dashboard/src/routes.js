import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import DefaultLayout from './layouts';
import WeeklyReport from './pages/WeeklyReport';

export default function Routes({ cities }) {
  return (
    <Switch>
      <Redirect exact from="/" to="/miraflores" />
      {cities.map(city => (
        <Route key={city.id} path={city.path}>
          <DefaultLayout>
            <WeeklyReport city={city.name} />
          </DefaultLayout>
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
    { id: 1, path: '/miraflores', name: 'Miraflores' },
    { id: 2, path: '/montevideo', name: 'Montevideo' },
    { id: 3, path: '/quito', name: 'Quito' },
    { id: 4, path: '/sao-paulo', name: 'São Paulo' },
    { id: 5, path: '/xalapa', name: 'Xalapa' },
  ],
};
