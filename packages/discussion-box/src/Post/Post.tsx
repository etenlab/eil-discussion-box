import React, { useState, useRef, useLayoutEffect } from "react";

import { Stack, Popover } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";

import { PostText } from "./styled";
import { ReactionList } from "../Reaction";
import { IPost } from "../utils/types";
import { AttachmentList } from "../Attachment";
import { PostHeader } from "./PostHeader";
import { PostReply } from "./PostReply";
import { PostDeletedReply } from "./PostDeletedReply";
import { ActionList } from "./ActionList";

import { useDiscussionContext } from "../hooks/useDiscussionContext";

interface PostProps {
  post: IPost;
}

/**
 * This component basically renders Post, ReactionList.
 */
export function Post({ post }: PostProps) {
  const {
    id,
    user,
    quill_text,
    created_at,
    reactions,
    files,
    reply_id,
    reply,
    is_edited,
  } = post;

  const {
    states: {
      global: { userId },
      quillRef,
    },
    actions: {
      deletePost,
      setPostForEditing,
      setPostForReplying,
      alertFeedback,
    },
  } = useDiscussionContext();

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const postElement = useRef<HTMLParagraphElement>(null);

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  useLayoutEffect(() => {
    if (postElement.current) {
      postElement.current.innerHTML =
        quill_text +
        (is_edited ? "<span style='font-size: 12px'>(edited)</span>" : "");
    }
  }, [quill_text, is_edited]);

  const handleEditPost = () => {
    if (user.user_id !== userId) {
      alertFeedback("warning", "You are not owner of this post!");
      return;
    }

    setPostForEditing(post);
    quillRef.current?.focus();
    handlePopoverClose();
  };

  const handleReplyPost = () => {
    setPostForReplying(post);
    quillRef.current?.focus();
    handlePopoverClose();
  };

  const handleDeletePost = () => {
    if (user.user_id !== userId) {
      alertFeedback("warning", "You are not owner of this post!");
      return;
    }

    const result = window.confirm("Are you sure to delete this post?");
    if (!result) {
      return;
    }

    deletePost({
      variables: {
        id,
        userId,
      },
    });

    handlePopoverClose();
  };

  const created_at_date =
    typeof created_at === "string" ? new Date(created_at) : created_at;

  const open = Boolean(anchorEl);

  const actions = [
    {
      name: "Edit Post",
      action: handleEditPost,
      icon: <EditIcon sx={{ fontSize: 16 }} />,
    },
    {
      name: "Reply",
      action: handleReplyPost,
      icon: <ReplyIcon sx={{ fontSize: 16 }} />,
    },
    {
      name: "Delete Post",
      action: handleDeletePost,
      icon: <DeleteIcon sx={{ fontSize: 16, color: "red" }} />,
    },
  ];

  return (
    <>
      {reply_id && reply ? (
        <PostReply
          username={reply.user.username}
          url=""
          plainText={reply.plain_text}
          files={reply.files}
          edited={reply.is_edited}
        />
      ) : null}

      {reply_id && !reply ? <PostDeletedReply /> : null}

      <PostHeader
        username={user.username}
        avatar=""
        date={created_at_date}
        openActionList={handlePopoverOpen}
      />

      <Stack gap="10px">
        <PostText ref={postElement} />

        <AttachmentList files={files} post={post} />

        <ReactionList reactions={reactions} post={post} />
      </Stack>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handlePopoverClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
      >
        <ActionList actions={actions} />
      </Popover>
    </>
  );
}
