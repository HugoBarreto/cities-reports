import React from 'react';
import * as dc from 'dc';
import 'dc/dc.css';
import styled from 'styled-components';
import { format as d3Format } from 'd3';

import { numberFormat } from './utils';
import { ChartTemplate } from './ChartTemplate';

const TableTemplate = styled(ChartTemplate)`
  & tr: {
    &:hover: {
      background: '#dddd';
    }
  };
  & td: {
    textAlign: left,
    borderTop: 1px solid '#ddd',
  }
`;

const tableFunc = (divRef, data) => {
  const nasdaqTable = dc.dataTable(divRef);
  const dimension = data.dimension(d => d.dd);

  nasdaqTable
    .dimension(dimension)
    .group(d => {
      const format = d3Format('02d');
      return `${d.dd.getFullYear()}/${format(d.dd.getMonth() + 1)}`;
    })
    .columns([
      'date',
      'open',
      'close',
      {
        label: 'Change',
        format(d) {
          return numberFormat(d.close - d.open);
        },
      },
      'volume',
    ])
    .sortBy(d => {
      return d.dd;
    })
    .on('renderlet', table => {
      table.selectAll('.dc-table-group').classed('info', true);
    });

  return nasdaqTable;
};

export const DataTable = () => (
  <TableTemplate chartFunction={tableFunc} title="Summary Table" />
);
