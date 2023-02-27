import { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import { discussionClient } from '../graphql/discussionGraphql';
import { GET_APP_ID } from '../graphql/discussionQuery';

export function useGettingAppId({ appName }: { appName: string }) {
  const [appId, setAppId] = useState<number | null>(null);

  const [getAppId, { error, data }] = useLazyQuery(GET_APP_ID, {
    fetchPolicy: 'no-cache',
    client: discussionClient,
  });

  useEffect(() => {
    getAppId({
      variables: {
        app_name: appName,
      },
    });
  }, [appName, getAppId]);

  useEffect(() => {
    if (error) {
      alert('Failed in getting user id operation!');
      return;
    }

    if (data === undefined) {
      return;
    }

    setAppId(data.getApp.id);
  }, [error, data]);

  return {
    appId,
  };
}
