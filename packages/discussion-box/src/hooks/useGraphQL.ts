import { useEffect, useState, Dispatch, SetStateAction } from "react";

import { IDiscussion, IFileDB } from "../utils/types";

import { useGraphQLDiscussion } from "./useGraphQLDiscussion";
import { useGraphQLPost } from "./useGraphQLPost";
import { useGraphQLReaction } from "./useGraphQLReaction";

interface UseGraphQL {
  error: boolean;
  loading: boolean;
  discussion: IDiscussion | null;
  reactQuill: {
    quillText: string;
    setQuillText: Dispatch<SetStateAction<string>>;
    quillAttachments: IFileDB[];
    setQuillAttachments: Dispatch<SetStateAction<IFileDB[]>>;
    setPrevAttachments: Dispatch<SetStateAction<IFileDB[]>>;
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

type UseGraphQLProps = {
  table_name: string;
  row: number;
};

// This hook take care every chagnes of discussion's state via connecting graphql servers
export function useGraphQL({ table_name, row }: UseGraphQLProps): UseGraphQL {
  const [discussion, setDiscussion] = useState<IDiscussion | null>(null);
  const [quillText, setQuillText] = useState<string>("");
  const [quillPlain, setQuillPlain] = useState<string>("");
  const [quillAttachments, setQuillAttachments] = useState<IFileDB[]>([]);
  const [prevQuillText, setPrevQuillText] = useState<string | null>(null);
  const [prevAttachments, setPrevAttachments] = useState<IFileDB[]>([]);

  const {
    loading: discussionLoading,
    error: discussionError,
  } = useGraphQLDiscussion({ table_name, row, discussion, setDiscussion });

  const {
    loading: postLoading,
    createPostError,
    error: postError,
    graphQLAPIs: { createPost, deletePost },
  } = useGraphQLPost({ discussion, setDiscussion });

  const {
    error: reactionError,
    graphQLAPIs: { createReaction, deleteReaction },
  } = useGraphQLReaction({ discussion, setDiscussion });

  // Detect failling of creating operation of a new post
  // and restore previous quill text.
  useEffect(() => {
    if (!!createPostError && postLoading === false && !!prevQuillText) {
      setQuillText(prevQuillText);
      setQuillAttachments(prevAttachments);
      setPrevQuillText(null);
      setPrevAttachments([]);
    }
  }, [createPostError, postLoading, prevQuillText]);

  return {
    error: !!discussionError || !!postError || !!reactionError,
    loading: discussionLoading,
    discussion,
    reactQuill: {
      quillText,
      setQuillText,
      quillPlain,
      setQuillPlain,
      quillAttachments,
      setQuillAttachments,
      setPrevQuillText,
      setPrevAttachments,
    },
    graphQLAPIs: {
      createPost,
      deletePost,
      createReaction,
      deleteReaction,
    },
  };
}
