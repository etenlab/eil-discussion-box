import { useEffect, useCallback, Dispatch, useRef } from "react";

import { useMutation, useLazyQuery } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { aggregationClient } from "../graphql/aggregationGraphql";
import {
  GET_DISCUSSIONS_BY_TABLE_NAME_AND_ROW,
  CREATE_DISCUSSION,
} from "../graphql/discussionQuery";

import { IDiscussion, ActionType } from "../utils/types";

import { loadDiscussion } from "../reducers/discussion.actions";
import { alertFeedback } from "../reducers/global.actions";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UseDiscussionProps = {
  discussion: IDiscussion | null;
  dispatch: Dispatch<ActionType<unknown>>;
};

export function useDiscussion({ discussion, dispatch }: UseDiscussionProps) {
  const tableNameAndRow = useRef<{ table_name: string; row: number } | null>(
    null
  );

  const [
    createDiscussion,
    {
      data: newDiscussionData,
      error: createDiscussionError,
      loading: newDiscussionLoading,
    },
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

  const changeDiscussionByTableNameAndRow = useCallback(
    (table_name: string, row: number) => {
      if (table_name.length === 0 || row < 0) {
        alert("Error at table_name or row");
        return;
      }

      if (table_name === discussion?.table_name || row === discussion?.row) {
        return;
      }

      tableNameAndRow.current = {
        table_name,
        row,
      };

      getDiscussionsByTableNameAndRow({
        variables: {
          table_name,
          row,
        },
      });
    },
    [getDiscussionsByTableNameAndRow, discussion]
  );

  // Substitute 'discussionData' came from server to 'discussion'
  useEffect(() => {
    // check load successness
    if (discussionCalled && !!discussionError) {
      dispatch(
        alertFeedback(
          "error",
          `Failed in loading discussion! Check your network connectivity`
        )
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
    if (tableNameAndRow.current) {
      createDiscussion({
        variables: {
          discussion: {
            app: 0,
            org: 0,
            row: tableNameAndRow.current.row,
            table_name: tableNameAndRow.current.table_name,
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
          "error",
          `Failed in creating new discussion with #table_name: ${tableNameAndRow.current?.table_name}, #row: ${tableNameAndRow.current?.row}!`
        )
      );
      return;
    }

    if (newDiscussionData === undefined) {
      return;
    }

    const newDiscussion = newDiscussionData.createDiscussion;

    if (
      newDiscussion.table_name !== tableNameAndRow.current?.table_name ||
      newDiscussion.row !== tableNameAndRow.current?.row
    ) {
      dispatch(alertFeedback("warning", `Received not required discussion!`));
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
    changeDiscussionByTableNameAndRow,
  };
}
