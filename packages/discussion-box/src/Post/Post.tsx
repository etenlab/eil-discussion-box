import React, { useState, useRef, useLayoutEffect, MouseEvent } from "react";

import { Stack, Popover } from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import ReplyIcon from "@mui/icons-material/Reply";
import DeleteIcon from "@mui/icons-material/Delete";

import { PostText } from "./styled";
import { ReactionList } from "../Reaction";
import { IPost } from "../utils/types";
import { AttachmentList } from "../Attachment";
import { PostHeader } from "./PostHeader";
import { ActionList } from "./ActionList";

interface PostProps {
  post: IPost;
  openEmojiPicker(anchorEl: HTMLButtonElement, post: IPost): void;
  onClickReaction(post: IPost, content: string): void;
  editPost(post: IPost): void;
  replyPost(post_id: number): void;
  deletePost(post_id: number): void;
  removeAttachmentById(id: number, post: IPost): void;
}

/**
 * This component basically renders Post, ReactionList.
 */
export function Post({
  post,
  onClickReaction,
  openEmojiPicker,
  editPost,
  replyPost,
  deletePost,
  removeAttachmentById
}: PostProps) {
  const { id, user_id, quill_text, created_at, reactions, files } = post;
  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);
  const postElement = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (postElement.current) {
      postElement.current.innerHTML = quill_text;
    }
  }, [quill_text]);

  const handleOpenEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
    openEmojiPicker(event.currentTarget, post);
  };

  const handleClickReaction = (content: string) => {
    onClickReaction(post, content);
  };

  const handlePopoverOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleEditPost = () => {
    editPost(post);
    handlePopoverClose()
  };

  const handleDeletePost = () => {
    deletePost(id);
    handlePopoverClose();
  };

  const handleDeleteAttachment = (attachmentId: number) => {
    removeAttachmentById(attachmentId, post);
  }

  const handleReplyPost = () => {
    replyPost(id);
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
      <PostHeader
        username={`${user_id}`}
        avatar=""
        date={created_at_date}
        openActionList={handlePopoverOpen}
      />

      <Stack gap="10px">
        <PostText ref={postElement} />

        <AttachmentList files={files} onRemove={handleDeleteAttachment} />

        <ReactionList
          reactions={reactions}
          openEmojiPicker={handleOpenEmojiPicker}
          onClickReaction={handleClickReaction}
        />
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
