import React from 'react';

import { ThemeProvider } from '@mui/material';

import { theme } from './theme';

import { DiscussionProvider } from './context';

import { DiscussionPure, DiscussionPureProps } from './DiscussionPure';

export function Discussion(props: DiscussionPureProps) {
  return (
    <ThemeProvider theme={theme}>
      <DiscussionProvider>
        <DiscussionPure {...props} />
      </DiscussionProvider>
    </ThemeProvider>
  );
}
