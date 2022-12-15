import React, { useState, useEffect, useRef, useCallback } from "react";

import {
  Stack,
  Snackbar,
  Alert,
  Popover,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import { QuillContainer, DiscussionContainer } from "./styled";

import { ReactQuill } from "./ReactQuill";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiClickData } from "emoji-picker-react";

import {
  IPost,
  IFileDB,
  EmojiPopoverState,
  SnackbarState,
} from "./utils/types";

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
      quillAttachments,
      setQuillAttachments,
      setPrevAttachments,
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

  const handleAddAttachment = (file: IFileDB) => {
    setQuillAttachments((attachments) => [...attachments, file]);
  };

  const handleCancelAttachment = (file: IFileDB) => {
    setQuillAttachments((attachments) =>
      attachments.filter((attachment) => attachment.id !== file.id)
    );
  };

  const sendToServer = () => {
    if (
      (quillText.length === 0 || quillText === "<p><br></p>") &&
      quillAttachments.length === 0
    ) {
      return;
    }

    createPost({
      variables: {
        post: {
          discussion_id: discussion!.id,
          plain_text: quillPlain,
          postgres_language: "simple",
          quill_text: quillText,
          user_id: userId,
        },
        files: quillAttachments.map((file) => file.id),
      },
    });

    setPrevQuillText(quillText);
    setPrevAttachments(quillAttachments);
    setQuillText("");
    setQuillAttachments([]);
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
        sx={{ height: "calc(100vh - 200px)", padding: "0px 20px" }}
      >
        {discussion ? (
          <DiscussionContainer ref={discussionRef}>
            {discussion!.posts!.map((post: IPost) => (
              <Post
                key={post.id}
                {...post}
                deleteReaction={handleDeleteReaction}
                deletePost={handleDeletePost}
                openEmojiPicker={handleOpenEmojiPicker}
              />
            ))}
          </DiscussionContainer>
        ) : null}

        <QuillContainer>
          <ReactQuill
            attachments={quillAttachments}
            onAddAttachment={handleAddAttachment}
            onCancelAttachment={handleCancelAttachment}
            value={quillText}
            sendToServer={sendToServer}
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
