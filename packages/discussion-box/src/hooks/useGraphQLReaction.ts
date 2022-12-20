import { useEffect, Dispatch, SetStateAction } from "react";
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
  IDiscussion,
  ReactionCreatedData,
  ReactionDeletedData,
} from "../utils/types";

import {
  recalcDiscussionWithNewReation,
  recalcDiscusionWithDeletedReactionId,
} from "../utils/helpers";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UseGraphQLReactionProps = {
  discussion: IDiscussion | null;
  setDiscussion: Dispatch<SetStateAction<IDiscussion | null>>;
};

export function useGraphQLReaction({
  discussion,
  setDiscussion,
}: UseGraphQLReactionProps) {
  const {
    data: reactionCreatedData,
    error: reactionCreatedError,
  } = useSubscription<ReactionCreatedData>(REACTION_CREATED_SUBSCRIPTION, {
    variables: {
      discussionId: discussion !== null ? discussion.id : -1,
    },
    skip: discussion === null,
    client: discussionSubscriptionClient,
  });

  const {
    data: reactionDeletedData,
    error: reactionDeletedError,
  } = useSubscription<ReactionDeletedData>(REACTION_DELETED_SUBSCRIPTION, {
    variables: {
      discussionId: discussion !== null ? discussion.id : -1,
    },
    skip: discussion === null,
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
    if (reactionCreatedData === undefined || reactionCreatedError) {
      return;
    }

    const newReaction = reactionCreatedData.reactionCreated;
    setDiscussion(
      (discussion) =>
        discussion && recalcDiscussionWithNewReation(discussion, newReaction)
    );
  }, [reactionCreatedData, reactionCreatedError, setDiscussion]);

  // Sync 'discussion' with 'reactionDeleted' subscription
  useEffect(() => {
    if (reactionDeletedData === undefined || reactionDeletedError) {
      return;
    }

    const reactionId = reactionDeletedData.reactionDeleted;
    setDiscussion(
      (discussion) =>
        discussion &&
        recalcDiscusionWithDeletedReactionId(discussion, reactionId)
    );
  }, [reactionDeletedData, reactionDeletedError]);

  return {
    error:
      !!reactionCreatedError ||
      !!reactionDeletedError ||
      !!createReactionError ||
      !!deleteReactionError,
    graphQLAPIs: {
      createReaction,
      deleteReaction,
    },
  };
}
