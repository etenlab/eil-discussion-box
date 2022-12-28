import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  CSSProperties,
} from "react";

import {
  Stack,
  Snackbar,
  Alert,
  Popover,
  CircularProgress,
  Backdrop,
} from "@mui/material";

import { ReactQuill } from "./ReactQuill";
import { EmojiPicker } from "./EmojiPicker";
import { EmojiClickData } from "emoji-picker-react";

import { IPost, IFile, EmojiPopoverState, SnackbarState } from "./utils/types";

import { useGraphQL } from "./hooks/useGraphQL";
import { PostList } from "./Post";

type DiscussionProps = {
  userId: number;
  tableName: string;
  rowId: number;
  style: CSSProperties | undefined;
};

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
export function Discussion({
  userId,
  tableName,
  rowId,
  style,
}: DiscussionProps) {
  const {
    error,
    loading,
    discussion,
    reactQuill: {
      editor,
      setEditor,
      reply,
      setReply,
      quillText,
      setQuillText,
      quillAttachments,
      setQuillAttachments,
      setPrevAttachments,
      quillPlain,
      setQuillPlain,
      setPrevQuillText,
      initQuill,
    },
    graphQLAPIs: {
      createPost,
      updatePost,
      deletePost,
      deleteAttachment,
      createReaction,
      deleteReaction,
    },
  } = useGraphQL({ table_name: tableName, row: rowId });

  const [popoverState, setPopoverState] = useState<EmojiPopoverState>({
    anchorEl: null,
    post: null,
    mode: null,
  });

  const [snackbarState, setSnackbarState] = useState<SnackbarState>({
    open: false,
    message: "This is a success message!",
    severity: "success",
  });

  const discussionRef = useRef<HTMLElement>(null);
  const quillRef = useRef<{ focus(): void }>(null);

  useEffect(() => {
    if (error) {
      setSnackbarState({
        open: true,
        message: `Oops, Something went to wrong, Check your network connection`,
        severity: "error",
      });
    }
  }, [error]);

  const handleQuillChange = useCallback(
    (quill: string, plain: string) => {
      setQuillText(quill);
      setQuillPlain(plain);
    },
    [setQuillText, setQuillPlain]
  );

  const handleAddAttachment = useCallback(
    (file: IFile) => {
      setQuillAttachments((attachments) => [...attachments, file]);
    },
    [setQuillAttachments]
  );

  const handleCancelAttachment = useCallback(
    (file: IFile) => {
      setQuillAttachments((attachments) =>
        attachments.filter((attachment) => attachment.id !== file.id)
      );
    },
    [setQuillAttachments]
  );

  const handleRemoveAttachmentById = useCallback(
    (id: number, post: IPost) => {
      if (post.user_id !== userId) {
        alert("You are not owner of this post");
        return;
      }
      if (
        post.quill_text === "" &&
        post.plain_text === "" &&
        post.files.length === 1
      ) {
        const result = window.confirm("Are you sure to delete this post?");
        if (!result) {
          return;
        }
      }

      deleteAttachment({
        variables: {
          attachmentId: id,
          post_id: post.id,
        },
      });
    },
    [deleteAttachment, userId]
  );

  const sendToServer = () => {
    if (editor) {
      if (quillPlain.trim() === "" && editor.files.length === 0) {
        alert("Cannot save without any data");
        initQuill();
        return;
      }
      if (userId !== editor.user_id) {
        alert("You are not owner of this post!");
        initQuill();
        return;
      }
      updatePost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: quillPlain,
            postgres_language: "simple",
            quill_text: quillText || "",
            user_id: userId,
          },
          id: editor.id,
        },
      });
    } else {
      if (quillPlain.trim() === "" && quillAttachments.length === 0) {
        alert("Cannot save without any data!");
        setQuillText(undefined);
        return;
      }
      createPost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: quillPlain,
            postgres_language: "simple",
            quill_text: quillText || "",
            user_id: userId,
            reply_id: reply ? reply.id : null,
          },
          files: quillAttachments.map((file) => file.id),
        },
      });
    }

    setEditor(null);
    setPrevQuillText(quillText);
    setPrevAttachments(quillAttachments);
    setQuillText(undefined);
    setQuillAttachments([]);
  };

  const handleDeletePost = useCallback(
    (post_id: number) => {
      const result = window.confirm("Are you sure to delete this post?");
      if (!result) {
        return;
      }

      deletePost({
        variables: {
          id: post_id,
          userId: userId,
        },
      });
    },
    [userId, deletePost]
  );

  const handleEditPost = useCallback(
    (post: IPost) => {
      setEditor(post);
      quillRef.current?.focus();
    },
    [setEditor]
  );

  const handleReplyPost = useCallback(
    (post: IPost) => {
      setReply(post);
      quillRef.current?.focus();
    },
    [setReply]
  );

  const handleAddReaction = useCallback(
    (post_id: number, content: string) => {
      createReaction({
        variables: {
          reaction: {
            post_id,
            content,
            user_id: userId,
          },
        },
      });
    },
    [userId, createReaction]
  );

  const handleDeleteReaction = useCallback(
    (reaction_id: number) => {
      deleteReaction({
        variables: {
          id: reaction_id,
          userId,
        },
      });
    },
    [userId, deleteReaction]
  );

  const handleCloseSnackbar = useCallback(() => {
    setSnackbarState((state) => ({ ...state, open: false }));
  }, []);

  const handleOpenEmojiPickerByReact = useCallback(
    (anchorEl: HTMLButtonElement, post: IPost) => {
      setPopoverState({
        anchorEl,
        post,
        mode: "react",
      });
    },
    []
  );

  const handleOpenEmojiPickerByQuill = useCallback((anchorEl: Element) => {
    setPopoverState({
      anchorEl,
      post: null,
      mode: "quill",
    });
  }, []);

  const handleCloseEmojiPicker = useCallback(() => {
    setPopoverState({
      anchorEl: null,
      post: null,
      mode: null,
    });
  }, []);

  const handleEmojiClickByReact = useCallback(
    (post: IPost | null, emojiData: EmojiClickData) => {
      if (post) {
        const reaction = post.reactions.find(
          (reaction) =>
            reaction.content === emojiData.unified &&
            reaction.user_id === userId
        );

        if (reaction) {
          handleDeleteReaction(reaction.id);
        } else {
          handleAddReaction(post.id, emojiData.unified);
        }
      }
    },
    [handleDeleteReaction, handleAddReaction, userId]
  );

  const handleEmojiClickByQuill = useCallback(
    (emojiData: EmojiClickData) => {
      setQuillText((quillText) => `${quillText}${emojiData.emoji}`);
    },
    [setQuillText]
  );

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      if (popoverState.mode === "quill") {
        handleEmojiClickByQuill(emojiData);
      }

      if (popoverState.mode === "react") {
        handleEmojiClickByReact(popoverState.post, emojiData);
      }

      handleCloseEmojiPicker();
    },
    [
      popoverState,
      handleEmojiClickByQuill,
      handleEmojiClickByReact,
      handleCloseEmojiPicker,
    ]
  );

  const handleClickReaction = useCallback(
    (post: IPost, content: string) => {
      const reaction = post.reactions.find(
        (reaction) =>
          reaction.content === content && reaction.user_id === userId
      );

      if (reaction) {
        handleDeleteReaction(reaction.id);
      } else {
        handleAddReaction(post.id, content);
      }
    },
    [handleDeleteReaction, handleAddReaction, userId]
  );

  const openEmojiPicker = Boolean(popoverState?.anchorEl);

  let quillTitle = "";

  if (editor || reply) {
    if (editor) {
      quillTitle = "Editing";
    }
    if (reply) {
      quillTitle = `Replying to @${reply.user.username}`;
    }
  }

  const special =
    quillTitle === ""
      ? undefined
      : {
        title: quillTitle,
        action: initQuill,
      };

  return (
    <>
      <Stack justifyContent="space-between" gap="20px" style={style} ref={discussionRef}>
        {discussion ? (
          <PostList
            posts={discussion.posts}
            onClickReaction={handleClickReaction}
            openEmojiPicker={handleOpenEmojiPickerByReact}
            editPost={handleEditPost}
            deletePost={handleDeletePost}
            replyPost={handleReplyPost}
            removeAttachmentById={handleRemoveAttachmentById}
          />
        ) : null}

        <ReactQuill
          ref={quillRef}
          special={special}
          attachments={quillAttachments}
          onAddAttachment={handleAddAttachment}
          onCancelAttachment={handleCancelAttachment}
          value={quillText}
          sendToServer={sendToServer}
          onChange={handleQuillChange}
          openEmojiPicker={handleOpenEmojiPickerByQuill}
        />
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
