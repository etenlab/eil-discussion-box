import { useEffect, Dispatch, SetStateAction } from "react";
import { useSubscription, useMutation, useLazyQuery } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { aggregationClient } from "../graphql/aggregationGraphql";
import {
  GET_DISCUSSIONS_BY_TABLE_NAME_AND_ROW,
  CREATE_DISCUSSION,
} from "../graphql/discussionQuery";
import { discussionSubscriptionClient } from "../graphql/discussionSubscriptionGraphql";
import { DISCUSSION_CREAETD_SUBSCRIPTION } from "../graphql/discussionSubscriptionQuery";

import { IDiscussion, DiscussionCreatedData } from "../utils/types";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UseGraphQLDiscussionProps = {
  table_name: string;
  row: number;
  discussion: IDiscussion | null;
  setDiscussion: Dispatch<SetStateAction<IDiscussion | null>>;
};

export function useGraphQLDiscussion({
  table_name,
  row,
  discussion,
  setDiscussion,
}: UseGraphQLDiscussionProps) {
  const {
    data: discussionCreatedData,
    error: discussionCreatedError,
  } = useSubscription<DiscussionCreatedData>(DISCUSSION_CREAETD_SUBSCRIPTION, {
    variables: {
      table_name,
      row,
    },
    client: discussionSubscriptionClient,
  });

  const [
    createDiscussion,
    { error: createDiscussionError, data: newDiscussionData },
  ] = useMutation(CREATE_DISCUSSION, { client });

  const [
    getDiscussionsByTableNameAndRow,
    {
      called: discussionCalled,
      loading: discussionLoading,
      error: discussionError,
      data: discussionData,
    },
  ] = useLazyQuery(GET_DISCUSSIONS_BY_TABLE_NAME_AND_ROW, {
    fetchPolicy: "no-cache",
    client,
  });

  // Query for fetching Discussion data from server
  useEffect(() => {
    setDiscussion(null);
    getDiscussionsByTableNameAndRow({
      variables: {
        table_name,
        row,
      },
    });
  }, [table_name, row, getDiscussionsByTableNameAndRow]);

  // Substitute 'discussionData' came from server to 'discussion'
  useEffect(() => {
    if (
      discussionError ||
      discussionLoading ||
      discussionCalled === false ||
      discussionData === undefined
    ) {
      return;
    }

    if (discussionData.discussions.length > 0) {
      setDiscussion(discussionData.discussions[0]);
      return;
    }

    if (table_name.length > 0 && row >= 0) {
      createDiscussion({
        variables: {
          discussion: {
            app: 0,
            org: 0,
            row: +row,
            table_name,
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
    table_name,
    row,
  ]);

  // Sync 'discussion' with 'createdDiscussion' subscription
  useEffect(() => {
    if (discussionCreatedData === undefined || discussionCreatedError) {
      return;
    }

    const newDiscussion = discussionCreatedData.discussionCreated;

    if (
      newDiscussion.table_name === discussion?.table_name &&
      newDiscussion.row === discussion?.row
    ) {
      return;
    }

    if (newDiscussion.table_name === table_name && newDiscussion.row === +row) {
      setDiscussion(newDiscussion);
    }
  }, [discussionCreatedData, discussionCreatedError, table_name, row]);

  useEffect(() => {
    if (newDiscussionData) {
      setDiscussion(newDiscussionData.createDiscussion);
    }
  }, [newDiscussionData]);

  return {
    error:
      !!discussionCreatedError || !!createDiscussionError || !!discussionError,
    loading: discussionLoading,
  };
}
