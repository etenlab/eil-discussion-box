import { useState, KeyboardEvent, useEffect, useRef, useCallback } from "react";
import { useHistory } from "react-router";

import { IonContent } from "@ionic/react";

import {
  Stack,
  Button,
  Snackbar,
  Alert,
  Popover,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import {
  QuillContainer,
  DiscussionHeader,
  DiscussionContainer,
} from "./styled";

import { ReactQuill } from "src/common/ReactQuill";
import { EmojiClickData } from "emoji-picker-react";
import { EmojiPicker } from "src/common/EmojiPicker";

import type { IPost, EmojiPopoverState, SnackbarState } from "./utils/types";

import { useGraphQLForDiscussion } from "./utils/useGraphQLForDiscussion";
import { Post } from "./Post";
import { MockLoginForm } from "./MockLoginForm";

import { Notification } from "src/components/notification";

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
export function Discussion() {
  const history = useHistory();
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
  } = useGraphQLForDiscussion();
  const [popoverState, setPopoverState] = useState<EmojiPopoverState>({
    anchorEl: null,
    postId: 0,
  });
  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "This is a success message!",
    severity: "success",
  });
  const [mockUserId, setMockUserId] = useState<number | null>(null);
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

  const handleKeyEvent = async (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !event.shiftKey && mockUserId) {
      createPost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: quillPlain,
            postgres_language: "simple",
            quill_text: quillText,
            user_id: mockUserId,
          },
        },
      });
      setPrevQuillText(quillText);
      setQuillText("");
    }
  };

  const handleDeletePost = async (post_id: number): Promise<void> => {
    if (!mockUserId) {
      return;
    }

    deletePost({
      variables: {
        id: post_id,
        userId: mockUserId
      },
    });
  };

  const handleAddReaction = useCallback(
    async (
      post_id: number,
      user_id: number,
      content: string
    ): Promise<void> => {
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

  const handleDeleteReaction = async (reaction_id: number): Promise<void> => {
    if (!mockUserId) {
      return;
    }
    
    deleteReaction({
      variables: {
        id: reaction_id,
        userId: mockUserId,
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
      if (popoverState && mockUserId) {
        handleCloseEmojiPicker();
        handleAddReaction(popoverState.postId, mockUserId, emojiData.unified);
      }
    },
    [popoverState, handleCloseEmojiPicker, handleAddReaction, mockUserId]
  );

  const openEmojiPicker = Boolean(popoverState?.anchorEl);

  return (
    <IonContent>
      <Stack
        justifyContent="space-between"
        sx={{ height: "calc(100vh - 75px)", padding: "0px 20px" }}
      >
        <DiscussionHeader>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Discussion</span>
            <Stack direction="row" alignItems="center" spacing={2}>
              {mockUserId && <Notification userId={mockUserId} />}
              <Button
                onClick={() => {
                  history.goBack();
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </DiscussionHeader>

        <MockLoginForm
          mockUserId={mockUserId}
          setMockUserId={(userId: number) => setMockUserId(userId)}
        />

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
    </IonContent>
  );
}
