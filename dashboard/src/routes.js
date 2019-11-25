import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import DefaultLayout from './layouts';
import WeeklyReport from './pages/WeeklyReport';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/weekly" />
      <Route
        path="/weekly"
        component={
          <DefaultLayout noNavbar noFooter>
            <WeeklyReport />
          </DefaultLayout>
        }
      />
    </Switch>
  );
}
