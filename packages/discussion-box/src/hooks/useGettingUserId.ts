import { useState, useEffect } from 'react';

import { useLazyQuery } from '@apollo/client';
import { discussionClient } from '../graphql/discussionGraphql';
import { GET_USER_ID_FROM_EMAIL } from '../graphql/discussionQuery';

export function useGettingUserId({ userEmail }: { userEmail: string }) {
  const [userId, setUserId] = useState<number | null>(null);

  const [getUserIdFromEmail, { error, data }] = useLazyQuery(
    GET_USER_ID_FROM_EMAIL,
    {
      fetchPolicy: 'no-cache',
      client: discussionClient,
    },
  );

  useEffect(() => {
    getUserIdFromEmail({
      variables: {
        email: userEmail,
      },
    });
  }, [userEmail, getUserIdFromEmail]);

  useEffect(() => {
    if (error) {
      alert('Failed in getting user id operation!');
      return;
    }

    if (data === undefined) {
      return;
    }

    setUserId(data.getUserIdFromEmail.user_id);
  }, [error, data]);

  return {
    userId,
  };
}
