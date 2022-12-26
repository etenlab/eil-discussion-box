import { useEffect, Dispatch, SetStateAction } from "react";
import { useSubscription, useMutation } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { aggregationClient } from "../graphql/aggregationGraphql";
import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
} from "../graphql/discussionQuery";
import { discussionSubscriptionClient } from "../graphql/discussionSubscriptionGraphql";
import {
  POST_CREATED_SUBSCRIPTION,
  POST_DELETED_SUBSCRIPTION,
  // POST_UPDATED_SUBSCRIPTION,
} from "../graphql/discussionSubscriptionQuery";

import { IDiscussion, PostCreatedData, PostDeletedData } from "../utils/types";

import {
  recalcDiscusionWithNewPost,
  recalcDiscussionWithDeletedPostId,
} from "../utils/helpers";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UseGraphQLPostProps = {
  discussion: IDiscussion | null;
  setDiscussion: Dispatch<SetStateAction<IDiscussion | null>>;
};

export function useGraphQLPost({
  discussion,
  setDiscussion,
}: UseGraphQLPostProps) {
  const { data: postCreatedData, error: postCreatedError } =
    useSubscription<PostCreatedData>(POST_CREATED_SUBSCRIPTION, {
      variables: {
        discussionId: discussion !== null ? discussion.id : -1,
      },
      skip: discussion === null,
      client: discussionSubscriptionClient,
    });

  const { data: postDeletedData, error: postDeletedError } =
    useSubscription<PostDeletedData>(POST_DELETED_SUBSCRIPTION, {
      variables: {
        discussionId: discussion !== null ? discussion.id : -1,
      },
      skip: discussion === null,
      client: discussionSubscriptionClient,
    });

  const [createPost, { error: createPostError, loading: createPostLoading }] =
    useMutation(CREATE_POST, {
      client,
    });

  const [updatePost, { error: updatePostError, loading: updatePostLoading }] =
    useMutation(UPDATE_POST, {
      client,
    });

  const [deletePost, { error: deletePostError }] = useMutation(DELETE_POST, {
    client,
  });

  // Sync 'discussion' with 'postCreated' subscription
  useEffect(() => {
    if (postCreatedData === undefined || postCreatedError) {
      return;
    }

    setDiscussion(
      (discussion) =>
        discussion &&
        recalcDiscusionWithNewPost(discussion, postCreatedData.postCreated)
    );
  }, [postCreatedData, postCreatedError, setDiscussion]);

  // Sync 'discussion' with 'postUpdated' subscription
  // useEffect(() => {

  // }, [postU]);

  // Sync 'discussion' with 'postDeleted' subscription
  useEffect(() => {
    if (postDeletedData === undefined || postDeletedError) {
      return;
    }

    setDiscussion(
      (discussion) =>
        discussion &&
        recalcDiscussionWithDeletedPostId(
          discussion,
          postDeletedData.postDeleted
        )
    );
  }, [postDeletedData, postDeletedError, setDiscussion]);

  return {
    error:
      !!postCreatedError ||
      !!postDeletedError ||
      !!createPostError ||
      !!deletePostError ||
      !!updatePostError,
    createPostError: !!createPostError,
    updatePostError: !!updatePostError,
    createPostLoading: !!createPostLoading,
    updatePostLoading: !!updatePostLoading,
    graphQLAPIs: {
      createPost,
      updatePost,
      deletePost,
    },
  };
}
