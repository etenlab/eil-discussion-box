import React from 'react';

import { ThemeProvider } from '@eten-lab/ui-kit';

import { DiscussionProvider } from './context';

import { DiscussionPure, DiscussionPureProps } from './DiscussionPure';

export function Discussion(props: DiscussionPureProps) {
  return (
    <ThemeProvider>
      <DiscussionProvider>
        <DiscussionPure {...props} />
      </DiscussionProvider>
    </ThemeProvider>
  );
}
