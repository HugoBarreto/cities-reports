import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

import DefaultLayout from './layouts';
import WeeklyReport from './pages/WeeklyReport';
import { DataProvider } from './components/DataContext';
import { getLastSunday, getSundayBefore} from './utils';

const baseUrl = 'https://hugo-data.s3.us-east-2.amazonaws.com';

export default function Routes({ cities }) {
  var lastSunday = getLastSunday();

  if (new Date() < lastSunday){
    lastSunday = getSundayBefore(lastSunday);
  }

  const prefix = `${baseUrl}/${lastSunday.toJSON().slice(0,10).replace(/-/g,'/')}/`;

  return (
    <Switch>
      <Redirect exact from="/" to="/miraflores" />
      {cities.map(city => (
        <Route key={city.id} path={city.path}>
          <DataProvider url={prefix + city.fileName} aggFile={city.aggFile}>
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
      fileName: PropTypes.string,
      aggFile: PropTypes.string,
    })
  ),
};

Routes.defaultProps = {
  cities: [
    {
      id: 1,
      path: '/miraflores',
      name: 'Miraflores',
      fileName: 'Miraflores/ALERTS.csv',
      aggFile: 'MirafloresAgg.json',
    },
    {
      id: 2,
      path: '/montevideo',
      name: 'Montevideo',
      fileName: 'Montevideo/ALERTS.csv',
      aggFile: 'MontevideoAgg.json',
    },
    { id: 3, path: '/quito', name: 'Quito', fileName: 'Quito/ALERTS.csv', aggFile: 'QuitoAgg.json', },
    {
      id: 4,
      path: '/sao-paulo',
      name: 'São Paulo',
      fileName: 'SaoPaulo/ALERTS.csv',
      aggFile: 'SaoPauloAgg.json',
    },
    {
      id: 5,
      path: '/xalapa',
      name: 'Xalapa',
      fileName: 'Xalapa/ALERTS.csv',
      aggFile: 'XalapaAgg.json',
    },
  ],
};
