import React from 'react';
import * as dc from 'dc';
import { Button } from 'shards-react';

export const ResetButton = ({
  chart,
  text,
  className = '',
  theme = 'warning',
  size = '',
}) => {
  return (
    <Button
      theme={theme}
      size={size}
      className={className}
      onClick={() => {
        chart.filterAll();
        dc.redrawAll();
      }}
    >
      {text}
    </Button>
  );
};
