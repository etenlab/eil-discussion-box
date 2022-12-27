import { useEffect, useState, Dispatch, SetStateAction } from "react";

import { IDiscussion, IFile } from "../utils/types";

import { useGraphQLDiscussion } from "./useGraphQLDiscussion";
import { useGraphQLPost } from "./useGraphQLPost";
import { useGraphQLReaction } from "./useGraphQLReaction";
import { IPost } from "../utils/types";

interface UseGraphQL {
  error: boolean;
  loading: boolean;
  discussion: IDiscussion | null;
  reactQuill: {
    editor: IPost | null;
    setEditor: Dispatch<SetStateAction<IPost | null>>;
    quillText: string | undefined;
    setQuillText: Dispatch<SetStateAction<string | undefined>>;
    quillAttachments: IFile[];
    setQuillAttachments: Dispatch<SetStateAction<IFile[]>>;
    setPrevAttachments: Dispatch<SetStateAction<IFile[]>>;
    quillPlain: string;
    setQuillPlain: Dispatch<SetStateAction<string>>;
    setPrevQuillText: Dispatch<SetStateAction<string | undefined>>;
  };
  graphQLAPIs: {
    createPost: any;
    updatePost: any;
    deletePost: any;
    deleteAttachment: any;
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
  const [editor, setEditor] = useState<IPost | null>(null);
  const [quillText, setQuillText] = useState<string | undefined>();
  const [quillPlain, setQuillPlain] = useState<string>("");
  const [quillAttachments, setQuillAttachments] = useState<IFile[]>([]);
  const [prevQuillText, setPrevQuillText] = useState<string | undefined>();
  const [prevAttachments, setPrevAttachments] = useState<IFile[]>([]);

  const { loading: discussionLoading, error: discussionError } =
    useGraphQLDiscussion({ table_name, row, discussion, setDiscussion });

  const {
    createPostLoading,
    createPostError,
    error: postError,
    graphQLAPIs: { createPost, updatePost, deletePost, deleteAttachment },
  } = useGraphQLPost({ discussion, setDiscussion });

  const {
    error: reactionError,
    graphQLAPIs: { createReaction, deleteReaction },
  } = useGraphQLReaction({ discussion, setDiscussion });

  // Detect failling of creating operation of a new post
  // and restore previous quill text.
  useEffect(() => {
    if (!!createPostError && createPostLoading === false && !!prevQuillText) {
      setQuillText(prevQuillText);
      setQuillAttachments(prevAttachments);
      setPrevQuillText(undefined);
      setPrevAttachments([]);
    }
  }, [createPostError, createPostLoading, prevQuillText, prevAttachments]);

  useEffect(() => {
    if (editor === null || discussion === null) {
      return;
    }

    const post = discussion.posts.find((post) => post.id === editor.id);

    if (!post) {
      return;
    }

    setQuillText(post.quill_text === "" ? undefined : post.quill_text);
    setPrevQuillText(undefined);
  }, [editor, discussion]);

  return {
    error: !!discussionError || !!postError || !!reactionError,
    loading: discussionLoading,
    discussion,
    reactQuill: {
      editor,
      setEditor,
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
      updatePost,
      deletePost,
      deleteAttachment,
      createReaction,
      deleteReaction,
    },
  };
}
