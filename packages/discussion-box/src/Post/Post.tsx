import React, { useRef, useLayoutEffect, MouseEvent } from "react";

import { 
  Button,
  IconButton
} from "@mui/material";

import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import AddReactionOutlinedIcon from "@mui/icons-material/AddReactionOutlined";
import MoreVertOutlinedIcon from "@mui/icons-material/MoreVertOutlined";

import { EmojiController, PostContainer, DateViewer } from "./styled";
import { ReactionList } from "../Reaction";
import { IPost } from "../utils/types";
import { AttachmentList } from "../Attachment";

interface PostProps extends IPost {
  openEmojiPicker(anchorEl: HTMLButtonElement, postId: number): void;
  deleteReaction(reaction_id: number): void;
  deletePost(post_id: number): void;
}

/**
 * This component basically renders Post, ReactionList.
 */
export function Post({
  id,
  user_id,
  quill_text,
  created_at,
  reactions,
  files,
  deleteReaction,
  deletePost,
  openEmojiPicker,
}: PostProps) {
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
    openEmojiPicker(event.currentTarget, id);
  };

  const created_at_date =
    typeof created_at === "string" ? new Date(created_at) : created_at;

  const attachementListFiles = files.map(file => file.file);

  return (
    <PostContainer>
      <h3>
        {user_id}
        <DateViewer>{created_at_date.toDateString()}</DateViewer>
      </h3>

      <p ref={postElement}></p>

      <AttachmentList files={attachementListFiles} />

      <ReactionList
        reactions={reactions}
        openEmojiPicker={handleOpenEmojiPicker}
        deleteReaction={deleteReaction}
      />

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
