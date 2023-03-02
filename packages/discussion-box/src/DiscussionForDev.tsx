import React from 'react';

import { ThemeProvider } from '@eten-lab/ui-kit';
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
  height: string;
};

export function DiscussionForDev({
  tableName,
  rowId,
  userEmail,
  orgName = 'dev org',
  appName = 'dev app',
  height,
}: DiscussionForDevProps) {
  const { userId } = useGettingUserId({ userEmail });
  const { appId } = useGettingAppId({ appName });
  const { orgId } = useGettingOrgId({ orgName });

  if (!userId || !appId || !orgId) {
    return <div>loading...</div>;
  }

  return (
    <ThemeProvider>
      <DiscussionProvider>
        <DiscussionPure
          userId={userId}
          appId={appId}
          orgId={orgId}
          tableName={tableName}
          rowId={rowId}
          height={height}
        />
      </DiscussionProvider>
    </ThemeProvider>
  );
}
