import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { Box, ButtonGroup, Button, useMediaQuery } from '@mui/material';
import React from 'react';

export type SortControlState<K> = {field: K; ascending: boolean;};

export function SortControls<K extends string>(props: {
  options: {key: K; label: string;}[];
  mode: SortControlState<K>;
  onChange: (state: SortControlState<K>) => void;
  disabled?: boolean;
}): JSX.Element {

  const smallWidth = useMediaQuery('(max-width: 800px)');
  const buttonSize = smallWidth ? 'small' : undefined;


  function getSortIcon(field: K): JSX.Element | undefined {
    if (field !== props.mode.field) {
      return undefined;
    }
    return props.mode.ascending ? <ArrowDownward/> : <ArrowUpward/>;
  }

  function changeSort(field: K): void {
    if (field === props.mode.field) {
      props.onChange({ field, ascending: !props.mode.ascending });
    } else {
      props.onChange({ field, ascending: true });
    }
  }

  return <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', paddingBottom: '10px' }}>
    <ButtonGroup size="large">
      {
        props.options.map(opt => <Button key={opt.key} disabled={props.disabled ?? false} size={buttonSize}
          endIcon={getSortIcon(opt.key)} onClick={() => changeSort(opt.key)}>{opt.label}
        </Button>)
      }
    </ButtonGroup>
  </Box>;
}
