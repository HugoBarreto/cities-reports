import React from 'react';
import { Switch, Redirect, Route } from 'react-router-dom';

import WeeklyReport from './pages/WeeklyReport';

export default function Routes() {
  return (
    <Switch>
      <Redirect exact from="/" to="/weekly" />
      <Route path="/weekly" component={WeeklyReport} />
    </Switch>
  );
}
