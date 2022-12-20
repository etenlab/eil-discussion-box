import { useEffect, Dispatch, SetStateAction } from "react";
import { useSubscription, useMutation } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { CREATE_POST, DELETE_POST } from "../graphql/discussionQuery";
import { discussionSubscriptionClient } from "../graphql/discussionSubscriptionGraphql";
import {
  POST_CREATED_SUBSCRIPTION,
  POST_DELETED_SUBSCRIPTION,
} from "../graphql/discussionSubscriptionQuery";

import { IDiscussion, PostCreatedData, PostDeletedData } from "../utils/types";

import {
  recalcDiscusionWithNewPost,
  recalcDiscussionWithDeletedPostId,
} from "../utils/helpers";

type UseGraphQLPostProps = {
  discussion: IDiscussion | null;
  setDiscussion: Dispatch<SetStateAction<IDiscussion | null>>;
};

export function useGraphQLPost({
  discussion,
  setDiscussion,
}: UseGraphQLPostProps) {
  const { data: postCreatedData, error: postCreatedError } = useSubscription<
    PostCreatedData
  >(POST_CREATED_SUBSCRIPTION, {
    variables: {
      discussionId: discussion !== null ? discussion.id : -1,
    },
    skip: discussion === null,
    client: discussionSubscriptionClient,
  });

  const { data: postDeletedData, error: postDeletedError } = useSubscription<
    PostDeletedData
  >(POST_DELETED_SUBSCRIPTION, {
    variables: {
      discussionId: discussion !== null ? discussion.id : -1,
    },
    skip: discussion === null,
    client: discussionSubscriptionClient,
  });

  const [
    createPost,
    { error: createPostError, loading: createPostLoading },
  ] = useMutation(CREATE_POST, {
    client: discussionClient,
  });

  const [deletePost, { error: deletePostError }] = useMutation(DELETE_POST, {
    client: discussionClient,
  });

  // Sync 'discussion' with 'postCreated' subscription
  useEffect(() => {
    if (postCreatedData === undefined || postCreatedError) {
      return;
    }

    console.log("postCreatedData", postCreatedData);

    setDiscussion(
      (discussion) =>
        discussion &&
        recalcDiscusionWithNewPost(discussion, postCreatedData.postCreated)
    );
  }, [postCreatedData, postCreatedError]);

  // Sync 'discussion' with 'postDeleted' subscription
  useEffect(() => {
    if (postDeletedData === undefined || postDeletedError) {
      return;
    }

    console.log("postDeletedData", postDeletedData);
    setDiscussion(
      (discussion) =>
        discussion &&
        recalcDiscussionWithDeletedPostId(
          discussion,
          postDeletedData.postDeleted
        )
    );
  }, [postDeletedData, postDeletedError]);

  return {
    error:
      !!postCreatedError ||
      !!postDeletedError ||
      !!createPostError ||
      !!deletePostError,
    createPostError: !!createPostError,
    loading: createPostLoading,
    graphQLAPIs: {
      createPost,
      deletePost,
    },
  };
}
