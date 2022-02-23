import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, ButtonGroup, Button } from '@mui/material';
import React from 'react';

export type SortControlState<K> = {field: K; ascending: boolean;};

export function SortControls<K extends string>(props: {
  options: {key: K; label: string;}[];
  mode: SortControlState<K>;
  onChange: (state: SortControlState<K>) => void;
  disabled?: boolean
}): JSX.Element {

  console.log('sort controller props mode', props.mode);

  function getSortIcon(field: K): JSX.Element | undefined {
    if (field !== props.mode.field) {
      return undefined;
    }
    return props.mode.ascending ? <ArrowDownward/> : <ArrowUpward/>;
  }

  function changeSort(field: K): void {
    console.log(`clicked ${field}`);
    if (field === props.mode.field) {
      console.log('flip');
      props.onChange({ field, ascending: !props.mode.ascending });
    } else {
      console.log('switch');
      props.onChange({ field, ascending: true });
    }
  }

  return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '10px' }}>
    <ButtonGroup size="large">
      {
        props.options.map(opt => <Button key={opt.key} disabled={props.disabled ?? false}
          endIcon={getSortIcon(opt.key)} onClick={() => changeSort(opt.key)}>{opt.label}
        </Button>)
      }
    </ButtonGroup>
  </Box>;
}
