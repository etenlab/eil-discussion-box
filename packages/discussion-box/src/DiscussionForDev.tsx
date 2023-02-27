import React, { CSSProperties } from 'react';

import { ThemeProvider } from '@mui/material';
import { theme } from './theme';
import { DiscussionProvider } from './context';
import { DiscussionPure } from './DiscussionPure';

import { useGettingAppId } from './hooks/useGettingAppId';
import { useGettingOrgId } from './hooks/useGettingOrgId';
import { useGettingUserId } from './hooks/useGettingUserId';

type DiscussionForDevProps = {
  tableName: string;
  rowId: number;
  userEmail: string;
  orgName?: string;
  appName?: string;
  style?: CSSProperties;
};

export function DiscussionForDev({
  tableName,
  rowId,
  userEmail,
  orgName = 'dev org',
  appName = 'dev app',
  style,
}: DiscussionForDevProps) {
  const { userId } = useGettingUserId({ userEmail });
  const { appId } = useGettingAppId({ appName });
  const { orgId } = useGettingOrgId({ orgName });

  if (!userId || !appId || !orgId) {
    return <div>loading...</div>;
  }

  return (
    <ThemeProvider theme={theme}>
      <DiscussionProvider>
        <DiscussionPure
          userId={userId}
          appId={appId}
          orgId={orgId}
          tableName={tableName}
          rowId={rowId}
          style={style}
        />
      </DiscussionProvider>
    </ThemeProvider>
  );
}
