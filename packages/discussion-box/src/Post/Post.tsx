import React, { useRef, useLayoutEffect, MouseEvent } from "react";

import { Button, IconButton, Stack } from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import { EmojiController, PostContainer, PostText, DateViewer } from "./styled";
import { ReactionList } from "../Reaction";
import { IPost } from "../utils/types";
import { AttachmentList } from "../Attachment";

interface PostProps {
  post: IPost;
  openEmojiPicker(anchorEl: HTMLButtonElement, post: IPost): void;
  onClickReaction(post: IPost, content: string): void;
  deletePost(post_id: number): void;
}

/**
 * This component basically renders Post, ReactionList.
 */
export function Post({
  post,
  onClickReaction,
  deletePost,
  openEmojiPicker,
}: PostProps) {
  const { id, user_id, quill_text, created_at, reactions, files } = post;

  const postElement = useRef<HTMLParagraphElement>(null);

  useLayoutEffect(() => {
    if (postElement.current) {
      postElement.current.innerHTML = quill_text;
    }
  }, [quill_text]);

  const handleDeletePostClick = () => {
    deletePost(id);
  };

  const handleOpenEmojiPicker = (event: MouseEvent<HTMLButtonElement>) => {
    openEmojiPicker(event.currentTarget, post);
  };

  const handleClickReaction = (content: string) => {
    onClickReaction(post, content);
  }

  const created_at_date =
    typeof created_at === "string" ? new Date(created_at) : created_at;

  const attachementListFiles = files.map((file) => file.file);

  return (
    <PostContainer>
      <h3>
        {user_id}
        <DateViewer>{created_at_date.toDateString()}</DateViewer>
      </h3>

      <Stack gap="10px">
        <PostText ref={postElement} />

        <AttachmentList files={attachementListFiles} />

        <ReactionList
          reactions={reactions}
          openEmojiPicker={handleOpenEmojiPicker}
          onClickReaction={handleClickReaction}
        />
      </Stack>

      <EmojiController className="emoji-controller">
        <Button
          onClick={handleOpenEmojiPicker}
          startIcon={<AddReactionOutlinedIcon />}
        >
          React
        </Button>
        <Button
          onClick={handleDeletePostClick}
          startIcon={<DeleteOutlineIcon />}
        >
          Delete
        </Button>
        <IconButton>
          <MoreVertOutlinedIcon />
        </IconButton>
      </EmojiController>
    </PostContainer>
  );
}
