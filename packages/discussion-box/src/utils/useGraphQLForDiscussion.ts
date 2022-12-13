import { useEffect, useState, Dispatch, SetStateAction } from "react";
import { useSubscription, useMutation, useLazyQuery } from "@apollo/client";

import { client } from "src/graphql/discussionGraphql";
import {
  POST_CREATED_SUBSCRIPTION,
  POST_DELETED_SUBSCRIPTION,
  REACTION_CREATED_SUBSCRIPTION,
  REACTION_DELETED_SUBSCRIPTION,
  DISCUSSION_CREAETD_SUBSCRIPTION,
  CREATE_DISCUSSION,
  CREATE_POST,
  DELETE_POST,
  CREATE_REACTION,
  DELETE_REACTION,
  GET_DISCUSSIONS_BY_TABLE_NAME_AND_ROW,
} from "src/graphql/discussionQuery";

import type {
  IDiscussion,
  IFileDB,
  DiscussionCreatedData,
  PostCreatedData,
  PostDeletedData,
  ReactionCreatedData,
  ReactionDeletedData,
} from "./types";

import {
  recalcDiscusionWithNewPost,
  recalcDiscussionWithDeletedPostId,
  recalcDiscussionWithNewReation,
  recalcDiscusionWithDeletedReactionId,
} from "./helpers";

interface UseGraphQLForDiscussion {
  error: boolean;
  loading: boolean;
  discussion: IDiscussion | null;
  reactQuill: {
    quillText: string;
    setQuillText: Dispatch<SetStateAction<string>>;
    quillAttachment: IFileDB[];
    setQuillAttachment: Dispatch<SetStateAction<IFileDB[]>>;
    quillPlain: string;
    setQuillPlain: Dispatch<SetStateAction<string>>;
    setPrevQuillText: Dispatch<SetStateAction<string | null>>;
  };
  graphQLAPIs: {
    createPost: any;
    deletePost: any;
    createReaction: any;
    deleteReaction: any;
  };
}

type UseGraphQLForDiscussionProps = {
  table_name: string;
  row: number;
};

export function useGraphQLForDiscussion({
  table_name,
  row,
}: UseGraphQLForDiscussionProps): UseGraphQLForDiscussion {
  const [error, setError] = useState<boolean>(false);

  const [discussion, setDiscussion] = useState<IDiscussion | null>(null);
  const [quillText, setQuillText] = useState<string>("");
  const [quillPlain, setQuillPlain] = useState<string>("");
  const [quillAttachment, setQuillAttachment] = useState<IFileDB[]>([]);
  const [prevQuillText, setPrevQuillText] = useState<string | null>(null);

  const { data: discussionCreatedData, error: discussionCreatedError } =
    useSubscription<DiscussionCreatedData>(DISCUSSION_CREAETD_SUBSCRIPTION, {
      client,
    });
  const { data: postCreatedData, error: postCreatedError } =
    useSubscription<PostCreatedData>(POST_CREATED_SUBSCRIPTION, {
      variables: {
        discussionId: discussion ? discussion.id : -1,
      },
      client,
    });
  const { data: postDeletedData, error: postDeletedError } =
    useSubscription<PostDeletedData>(POST_DELETED_SUBSCRIPTION, {
      client,
    });
  const { data: reactionCreatedData, error: reactionCreatedError } =
    useSubscription<ReactionCreatedData>(REACTION_CREATED_SUBSCRIPTION, {
      client,
    });
  const { data: reactionDeletedData, error: reactionDeletedError } =
    useSubscription<ReactionDeletedData>(REACTION_DELETED_SUBSCRIPTION, {
      client,
    });
  const [
    createDiscussion,
    { error: createDiscussionError, data: newDiscusionData },
  ] = useMutation(CREATE_DISCUSSION, { client });
  const [createPost, { error: createPostError, loading: createPostLoading }] =
    useMutation(CREATE_POST, {
      client,
    });
  const [deletePost, { error: deletePostError }] = useMutation(DELETE_POST, {
    client,
  });
  const [createReaction, { error: createReactionError }] = useMutation(
    CREATE_REACTION,
    { client }
  );
  const [deleteReaction, { error: deleteReactionError }] = useMutation(
    DELETE_REACTION,
    { client }
  );
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
        row: +row,
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

    if (table_name && row) {
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
    if (newDiscussion.table_name === table_name && newDiscussion.row === +row) {
      setDiscussion(newDiscussion);
    }
  }, [discussionCreatedData, discussionCreatedError, table_name, row]);

  useEffect(() => {
    if (newDiscusionData) {
      setDiscussion(newDiscusionData.createDiscussion);
    }
  }, [newDiscusionData]);

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
  }, [postCreatedData, postCreatedError]);

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
  }, [postDeletedData, postDeletedError]);

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

  // Detect failling of creating operation of a new post
  // and restore previous quill text.
  useEffect(() => {
    if (!!createPostError && createPostLoading === false && !!prevQuillText) {
      setQuillText(prevQuillText);
      setPrevQuillText(null);
    }
  }, [createPostError, createPostLoading, prevQuillText]);

  // Catch the errors and reflect them to error state.
  useEffect(() => {
    const errors = [
      postCreatedError,
      postDeletedError,
      reactionCreatedError,
      reactionDeletedError,
      deletePostError,
      deleteReactionError,
      createPostError,
      createReactionError,
      createDiscussionError,
      discussionError,
    ];
    const findError = errors.reduce(
      (isExistError, err) => !!err || isExistError,
      false
    );
    if (findError) {
      setError(true);
    } else {
      setError(false);
    }
  }, [
    postCreatedError,
    postDeletedError,
    reactionCreatedError,
    reactionDeletedError,
    deletePostError,
    deleteReactionError,
    createPostError,
    createReactionError,
    createDiscussionError,
    discussionError,
  ]);

  return {
    error,
    loading: (discussionLoading && discussionCalled) || discussion === null,
    discussion,
    reactQuill: {
      quillText,
      setQuillText,
      quillPlain,
      setQuillPlain,
      quillAttachment,
      setQuillAttachment,
      setPrevQuillText,
    },
    graphQLAPIs: {
      createPost,
      deletePost,
      createReaction,
      deleteReaction,
    },
  };
}
