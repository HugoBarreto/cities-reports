import React from 'react';
import * as dc from 'dc';
import { Button } from 'shards-react';

export const ResetButton = ({ chart, text, theme = 'warning', size = '' }) => {
  return (
    <Button
      theme={theme}
      size={size}
      onClick={() => {
        chart.filterAll();
        dc.redrawAll();
      }}
    >
      {text}
    </Button>
  );
};
