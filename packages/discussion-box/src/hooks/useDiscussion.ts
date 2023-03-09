import { useEffect, useCallback, Dispatch, useRef } from 'react';

import { useMutation, useLazyQuery } from '@apollo/client';

import { discussionClient } from '../graphql/discussionGraphql';
import { aggregationClient } from '../graphql/aggregationGraphql';
import { GET_DISCUSSIONS, CREATE_DISCUSSION } from '../graphql/discussionQuery';

import {
  IDiscussion,
  ActionType,
  ChangeDiscussionParams,
} from '../utils/types';

import { loadDiscussion } from '../reducers/discussion.actions';
import { alertFeedback } from '../reducers/global.actions';

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === 'aggregation'
    ? aggregationClient
    : discussionClient;

type UseDiscussionProps = {
  discussion: IDiscussion | null;
  dispatch: Dispatch<ActionType<unknown>>;
};

export function useDiscussion({ discussion, dispatch }: UseDiscussionProps) {
  const discussionRef = useRef<ChangeDiscussionParams | null>(null);

  const [
    createDiscussion,
    {
      data: newDiscussionData,
      error: createDiscussionError,
      loading: newDiscussionLoading,
    },
  ] = useMutation(CREATE_DISCUSSION, { client });

  const [
    getDiscussions,
    {
      called: discussionCalled,
      loading: discussionLoading,
      error: discussionError,
      data: discussionData,
    },
  ] = useLazyQuery(GET_DISCUSSIONS, {
    fetchPolicy: 'no-cache',
    client,
  });

  const changeDiscussion = useCallback(
    ({ table_name, row, orgId, appId }: ChangeDiscussionParams) => {
      if (table_name.length === 0 || row < 0) {
        alertFeedback('error', 'Error at table_name or row');
        return;
      }

      if (
        table_name === discussion?.table_name ||
        row === discussion?.row ||
        orgId === discussion?.appList.id ||
        orgId === discussion?.organization.id
      ) {
        return;
      }

      // Save params
      discussionRef.current = {
        table_name,
        row,
        orgId,
        appId,
      };

      getDiscussions({
        variables: {
          table_name,
          row,
          org_id: orgId,
          app_id: appId,
        },
      });
    },
    [getDiscussions, discussion],
  );

  // Substitute 'discussionData' came from server to 'discussion'
  useEffect(() => {
    // check load successness
    if (discussionCalled && !!discussionError) {
      dispatch(
        alertFeedback(
          'error',
          `Failed in loading discussion! Check your network connectivity`,
        ),
      );
      return;
    }

    if (discussionData === undefined) {
      return;
    }

    if (discussionData.discussions.length > 0) {
      dispatch(loadDiscussion(discussionData.discussions[0]));
      return;
    }

    // create a new Discussion with new table_name and row
    if (discussionRef.current) {
      createDiscussion({
        variables: {
          discussion: {
            app_id: discussionRef.current.appId,
            org_id: discussionRef.current.orgId,
            row: discussionRef.current.row,
            table_name: discussionRef.current.table_name,
          },
        },
      });
    }
  }, [
    discussionError,
    discussionLoading,
    discussionCalled,
    discussionData,
    createDiscussion,
    dispatch,
  ]);

  // Sync 'discussion' with 'createdDiscussion' data
  useEffect(() => {
    if (!!createDiscussionError) {
      dispatch(
        alertFeedback(
          'error',
          `Failed in creating new discussion with #table_name: ${discussionRef.current?.table_name}, #row: ${discussionRef.current?.row}!`,
        ),
      );
      return;
    }

    if (newDiscussionData === undefined) {
      return;
    }

    const newDiscussion = newDiscussionData.createDiscussion;

    if (
      newDiscussion.table_name !== discussionRef.current?.table_name ||
      newDiscussion.row !== discussionRef.current?.row ||
      newDiscussion.appList.id !== discussionRef.current?.appId ||
      newDiscussion.organization.id !== discussionRef.current?.orgId
    ) {
      dispatch(alertFeedback('warning', `Received not required discussion!`));
      return;
    }

    dispatch(loadDiscussion(newDiscussion));
  }, [
    newDiscussionData,
    createDiscussionError,
    newDiscussionLoading,
    dispatch,
  ]);

  return {
    loading: discussionLoading,
    changeDiscussion,
  };
}
