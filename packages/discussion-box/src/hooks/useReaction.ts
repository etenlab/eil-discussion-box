import { useEffect, Dispatch } from "react";
import { useSubscription, useMutation } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { aggregationClient } from "../graphql/aggregationGraphql";
import { CREATE_REACTION, DELETE_REACTION } from "../graphql/discussionQuery";
import { discussionSubscriptionClient } from "../graphql/discussionSubscriptionGraphql";
import {
  REACTION_CREATED_SUBSCRIPTION,
  REACTION_DELETED_SUBSCRIPTION,
} from "../graphql/discussionSubscriptionQuery";

import {
  ReactionCreatedData,
  ReactionDeletedData,
  ActionType,
} from "../utils/types";

import {
  loadNewReaction,
  loadDeletedReactionId,
} from "../reducers/discussion.actions";
import { alertFeedback } from "../reducers/global.actions";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UseReactProps = {
  discussionId: number | null;
  dispatch: Dispatch<ActionType<unknown>>;
};

export function useReaction({ discussionId, dispatch }: UseReactProps) {
  const {
    data: reactionCreatedData,
    error: reactionCreatedError,
  } = useSubscription<ReactionCreatedData>(REACTION_CREATED_SUBSCRIPTION, {
    variables: {
      discussionId: discussionId !== null ? discussionId : -1,
    },
    skip: discussionId === null,
    client: discussionSubscriptionClient,
  });

  const {
    data: reactionDeletedData,
    error: reactionDeletedError,
  } = useSubscription<ReactionDeletedData>(REACTION_DELETED_SUBSCRIPTION, {
    variables: {
      discussionId: discussionId !== null ? discussionId : -1,
    },
    skip: discussionId === null,
    client: discussionSubscriptionClient,
  });

  const [
    createReaction,
    { error: createReactionError },
  ] = useMutation(CREATE_REACTION, { client });

  const [
    deleteReaction,
    { error: deleteReactionError },
  ] = useMutation(DELETE_REACTION, { client });

  // Sync 'discussion' with 'reactionCreated' subscription
  useEffect(() => {
    if (reactionCreatedError) {
      dispatch(
        alertFeedback("error", `Found error at created reaction subscription!`)
      );
      return;
    }

    if (reactionCreatedData === undefined) {
      return;
    }

    dispatch(loadNewReaction(reactionCreatedData.reactionCreated));
  }, [reactionCreatedData, reactionCreatedError, dispatch]);

  // Sync 'discussion' with 'reactionDeleted' subscription
  useEffect(() => {
    if (reactionDeletedError) {
      dispatch(
        alertFeedback("error", `Found error at deleted reaction subscription!`)
      );
      return;
    }

    if (reactionDeletedData === undefined) {
      return;
    }

    dispatch(loadDeletedReactionId(reactionDeletedData.reactionDeleted));
  }, [reactionDeletedData, reactionDeletedError, dispatch]);

  useEffect(() => {
    if (!!createReactionError) {
      dispatch(alertFeedback("error", `Failed creating a new Reaction!`));
    }
  }, [createReactionError, dispatch]);

  useEffect(() => {
    if (!!deleteReactionError) {
      dispatch(alertFeedback("error", `Failed deleting a Reaction!`));
    }
  }, [deleteReactionError, dispatch]);

  return {
    createReaction,
    deleteReaction,
  };
}
