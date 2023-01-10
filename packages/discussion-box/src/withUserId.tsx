import React, { useState, useEffect, ComponentType, FC } from 'react';

import { useLazyQuery } from '@apollo/client';
import { discussionClient } from './graphql/discussionGraphql';
import {
  GET_USER_ID_FROM_EMAIL,
  GET_USER_ID_FROM_NAME,
} from './graphql/discussionQuery';

type WithUserIdProps = {
  userInfo: unknown;
  userInfoType: 'email' | 'name' | 'user_id';
};

export const withUserId =
  <P extends object>(
    WrappedComponent: ComponentType<P>,
  ): FC<Omit<P, 'userId'> & WithUserIdProps> =>
    ({
      userInfo,
      userInfoType,
      ...props
    }: WithUserIdProps): JSX.Element | null => {
      const [userId, setUserId] = useState<number | null>(null);

      const [
        getUserIdFromEmail,
        { error: errorFromEmail, data: userIdFromEmail },
      ] = useLazyQuery(GET_USER_ID_FROM_EMAIL, {
        fetchPolicy: 'no-cache',
        client: discussionClient,
      });

      const [getUserIdFromName, { error: errorFromName, data: userIdFromName }] =
        useLazyQuery(GET_USER_ID_FROM_NAME, {
          fetchPolicy: 'no-cache',
          client: discussionClient,
        });

      useEffect(() => {
        if (errorFromEmail) {
          alert('Failed in getting user id operation!');
          return;
        }

        if (userIdFromEmail === undefined) {
          return;
        }

        setUserId(userIdFromEmail.getUserIdFromEmail.user_id);
      }, [errorFromEmail, userIdFromEmail]);

      useEffect(() => {
        if (errorFromName) {
          alert('Failed in getting user id operation!');
          return;
        }

        if (userIdFromName === undefined) {
          return;
        }

        setUserId(userIdFromName.getUserIdFromName.user_id);
      }, [errorFromName, userIdFromName]);

      useEffect(() => {
        switch (userInfoType) {
          case 'email': {
            getUserIdFromEmail({
              variables: {
                email: userInfo as string,
              },
            });
            break;
          }
          case 'name': {
            getUserIdFromName({
              variables: {
                name: userInfo as string,
              },
            });
            break;
          }
          case 'user_id': {
            setUserId(userInfo as number);
            break;
          }
          default: {
            break;
          }
        }
      }, [userInfo, userInfoType, getUserIdFromEmail, getUserIdFromName]);

      if (!userId) {
        return null;
      }

      return <WrappedComponent userId={userId} {...(props as P)} />;
    };
