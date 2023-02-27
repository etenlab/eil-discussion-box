import { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import { discussionClient } from '../graphql/discussionGraphql';
import { GET_ORG_ID } from '../graphql/discussionQuery';

export function useGettingOrgId({ orgName }: { orgName: string }) {
  const [orgId, setOrgId] = useState<number | null>(null);

  const [getOrgId, { error, data }] = useLazyQuery(GET_ORG_ID, {
    fetchPolicy: 'no-cache',
    client: discussionClient,
  });

  useEffect(() => {
    getOrgId({
      variables: {
        name: orgName,
      },
    });
  }, [orgName, getOrgId]);

  useEffect(() => {
    if (error) {
      alert('Failed in getting user id operation!');
      return;
    }

    if (data === undefined) {
      return;
    }

    setOrgId(data.getOrg.id);
  }, [error, data]);

  return {
    orgId,
  };
}
