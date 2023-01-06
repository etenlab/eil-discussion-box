import { useEffect, Dispatch } from "react";
import { useSubscription, useMutation } from "@apollo/client";

import { discussionClient } from "../graphql/discussionGraphql";
import { aggregationClient } from "../graphql/aggregationGraphql";
import {
  CREATE_POST,
  UPDATE_POST,
  DELETE_POST,
  DELETE_ATTACHMENT,
} from "../graphql/discussionQuery";
import { discussionSubscriptionClient } from "../graphql/discussionSubscriptionGraphql";
import {
  POST_CREATED_SUBSCRIPTION,
  POST_DELETED_SUBSCRIPTION,
  POST_UPDATED_SUBSCRIPTION,
} from "../graphql/discussionSubscriptionQuery";

import {
  ActionType,
  PostCreatedData,
  PostUpdatedData,
  PostDeletedData,
} from "../utils/types";

import {
  loadNewPost,
  loadUpdatedPost,
  loadDeletedPostId,
} from "../reducers/discussion.actions";
import { recoverQuillStates } from "../reducers/quill.actions";
import { alertFeedback } from "../reducers/global.actions";

const client =
  process.env.REACT_APP_GRAPHQL_MODDE === "aggregation"
    ? aggregationClient
    : discussionClient;

type UsePostProps = {
  discussionId: number | null;
  dispatch: Dispatch<ActionType<unknown>>;
};

export function usePost({ discussionId, dispatch }: UsePostProps) {
  const { data: postCreatedData, error: postCreatedError } =
    useSubscription<PostCreatedData>(POST_CREATED_SUBSCRIPTION, {
      variables: {
        discussionId: discussionId !== null ? discussionId : -1,
      },
      skip: discussionId === null,
      client: discussionSubscriptionClient,
    });

  const { data: postUpdatedData, error: postUpdatedError } =
    useSubscription<PostUpdatedData>(POST_UPDATED_SUBSCRIPTION, {
      variables: {
        discussionId: discussionId !== null ? discussionId : -1,
      },
      skip: discussionId === null,
      client: discussionSubscriptionClient,
    });

  const { data: postDeletedData, error: postDeletedError } =
    useSubscription<PostDeletedData>(POST_DELETED_SUBSCRIPTION, {
      variables: {
        discussionId: discussionId !== null ? discussionId : -1,
      },
      skip: discussionId === null,
      client: discussionSubscriptionClient,
    });

  const [createPost, { error: createPostError }] = useMutation(CREATE_POST, {
    client,
  });

  const [updatePost, { error: updatePostError }] = useMutation(UPDATE_POST, {
    client,
  });

  const [deletePost, { error: deletePostError }] = useMutation(DELETE_POST, {
    client,
  });

  const [deleteAttachment, { error: deleteAttachmentError }] = useMutation(
    DELETE_ATTACHMENT,
    {
      client,
    }
  );

  // Sync 'discussion' with 'postCreated' subscription
  useEffect(() => {
    if (postCreatedError) {
      dispatch(
        alertFeedback("error", `Found error at created post subscription!`)
      );
      return;
    }

    if (postCreatedData === undefined) {
      return;
    }

    dispatch(loadNewPost(postCreatedData.postCreated));
  }, [postCreatedData, postCreatedError, dispatch]);

  // Sync 'discussion' with 'postUpdated' subscription
  useEffect(() => {
    if (postUpdatedError) {
      dispatch(
        alertFeedback("error", `Found error at updated post subscription!`)
      );
      return;
    }

    if (postUpdatedData === undefined) {
      return;
    }

    dispatch(loadUpdatedPost(postUpdatedData.postUpdated));
  }, [postUpdatedData, postUpdatedError, dispatch]);

  // Sync 'discussion' with 'postDeleted' subscription
  useEffect(() => {
    if (postDeletedError) {
      dispatch(
        alertFeedback("error", `Found error at deleted post subscription!`)
      );

      return;
    }

    if (postDeletedData === undefined) {
      return;
    }

    dispatch(loadDeletedPostId(postDeletedData.postDeleted));
  }, [postDeletedData, postDeletedError, dispatch]);

  // Detect failling of creating operation of a new post
  // and restore previous quill text.
  useEffect(() => {
    if (createPostError) {
      dispatch(recoverQuillStates());
      dispatch(alertFeedback("error", `Failed creating a new Post!`));
    }
  }, [createPostError, dispatch]);

  useEffect(() => {
    if (updatePostError) {
      dispatch(alertFeedback("error", `Failed updating a Post!`));
    }
  }, [updatePostError, dispatch]);

  useEffect(() => {
    if (deletePostError) {
      dispatch(alertFeedback("error", `Failed deleting a Post!`));
    }
  }, [deletePostError, dispatch]);

  useEffect(() => {
    if (deleteAttachmentError) {
      dispatch(alertFeedback("error", `Failed deleting an Attachment!`));
    }
  }, [deleteAttachmentError, dispatch]);

  return {
    createPost,
    updatePost,
    deletePost,
    deleteAttachment,
  };
}
