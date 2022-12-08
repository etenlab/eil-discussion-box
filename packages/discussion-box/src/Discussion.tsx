import React, {
  useState,
  KeyboardEvent,
  useEffect,
  useRef,
  useCallback,
} from "react";

import {
  Stack,
  Snackbar,
  Alert,
  Popover,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import { QuillContainer, DiscussionContainer } from "./styled";

import { ReactQuill } from "src/ReactQuill";
import { EmojiClickData } from "emoji-picker-react";
import { EmojiPicker } from "src/EmojiPicker";

import { IPost, EmojiPopoverState, SnackbarState } from "./utils/types";

import { useGraphQLForDiscussion } from "./utils/useGraphQLForDiscussion";
import { Post } from "./Post";

type DiscussionProps = {
  userId: number;
  tableName: string;
  rowId: number;
};

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
export function Discussion({ userId, tableName, rowId }: DiscussionProps) {
  const {
    error,
    loading,
    discussion,
    reactQuill: {
      quillText,
      setQuillText,
      quillPlain,
      setQuillPlain,
      setPrevQuillText,
    },
    graphQLAPIs: { createPost, deletePost, createReaction, deleteReaction },
  } = useGraphQLForDiscussion({ table_name: tableName, row: rowId });
  const [popoverState, setPopoverState] = useState<EmojiPopoverState>({
    anchorEl: null,
    postId: 0,
  });
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "This is a success message!",
    severity: "success",
  });
  const discussionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (error) {
      setSnackbarState({
        open: true,
        message: `Oops, Something went to wrong, Check your network connection`,
        severity: "error",
      });
    }
  }, [error]);

  const handleQuillChange = (quill: string, plain: string) => {
    setQuillText(quill);
    setQuillPlain(plain);
  };

  const handleKeyEvent = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      createPost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: quillPlain,
            postgres_language: "simple",
            quill_text: quillText,
            user_id: userId,
          },
        },
      });
      setPrevQuillText(quillText);
      setQuillText("");
    }
  };

  const handleDeletePost = (post_id: number) => {
    deletePost({
      variables: {
        id: post_id,
        userId: userId,
      },
    });
  };

  const handleAddReaction = useCallback(
    (post_id: number, user_id: number, content: string) => {
      createReaction({
        variables: {
          reaction: {
            post_id,
            content,
            user_id,
          },
        },
      });
    },
    [createReaction]
  );

  const handleDeleteReaction = (reaction_id: number) => {
    deleteReaction({
      variables: {
        id: reaction_id,
        userId,
      },
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbarState((state) => ({ ...state, open: false }));
  };

  const handleOpenEmojiPicker = (
    anchorEl: HTMLButtonElement,
    postId: number
  ) => {
    setPopoverState({
      anchorEl,
      postId,
    });
  };

  const handleCloseEmojiPicker = useCallback(() => {
    setPopoverState({
      anchorEl: null,
      postId: 0,
    });
  }, []);

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      if (popoverState) {
        handleCloseEmojiPicker();
        handleAddReaction(popoverState.postId, userId, emojiData.unified);
      }
    },
    [popoverState, handleCloseEmojiPicker, handleAddReaction, userId]
  );

  const openEmojiPicker = Boolean(popoverState?.anchorEl);

  return (
    <>
      <Stack
        justifyContent="space-between"
        sx={{ height: "calc(100vh - 75px)", padding: "0px 20px" }}
      >
        <DiscussionContainer ref={discussionRef}>
          {discussion?.posts?.map((post: IPost) => (
            <Post
              key={post.id}
              {...post}
              deleteReaction={handleDeleteReaction}
              deletePost={handleDeletePost}
              openEmojiPicker={handleOpenEmojiPicker}
            />
          ))}
        </DiscussionContainer>

        <QuillContainer>
          <ReactQuill
            value={quillText}
            onKeyUp={handleKeyEvent}
            onChange={handleQuillChange}
          />
        </QuillContainer>
      </Stack>

      <Popover
        open={discussionRef.current !== null}
        anchorEl={
          popoverState.anchorEl === null
            ? discussionRef.current
            : popoverState.anchorEl
        }
        onClose={handleCloseEmojiPicker}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        sx={{
          display: openEmojiPicker ? "inherit" : "none",
        }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>

      <Snackbar
        open={snackbarState.open}
        autoHideDuration={2000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        key="bottom-right"
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbarState.severity}
          sx={{ width: "100%" }}
        >
          {snackbarState.message}
        </Alert>
      </Snackbar>

      <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
        <Stack justifyContent="center">
          <div style={{ margin: "auto" }}>
            <CircularProgress color="inherit" />
          </div>
          <div>LOADING</div>
        </Stack>
      </Backdrop>
    </>
  );
}
