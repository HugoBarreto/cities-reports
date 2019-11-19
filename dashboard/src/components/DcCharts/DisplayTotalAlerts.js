import React, { useState, useContext, useRef, useEffect } from 'react';
import * as dc from 'dc';

import { ChartTemplate } from './ChartTemplate';

const displayTotalAlerts = (divRef, data) => {
  const all = data.groupAll();
  const totalAlerts = dc.numberDisplay(divRef);

  totalAlerts.group(all).valueAccessor(d => d);

  return totalAlerts; // .value();
};

export const DisplayTotalAlerts = () => (
  <ChartTemplate
    chartFunction={displayTotalAlerts}
    title="Total Alerts"
    titleClassName="text-center"
    resetClassName="d-flex mx-auto"
    resetText="Reset All Filter"
    // numberDisplay
  />
);
