import React, { Fragment, useEffect, useRef, useCallback } from "react";

import { Divider, Stack, IconButton } from "@mui/material";

import KeyboardDoubleArrowDownIcon from "@mui/icons-material/KeyboardDoubleArrowDown";

import { IPost } from "../utils/types";

import { Post } from "./Post";

type PostListProps = {
  posts: IPost[];
  openEmojiPicker(anchorEl: HTMLButtonElement, post: IPost): void;
  onClickReaction(post: IPost, content: string): void;
  editPost(post: IPost): void;
  replyPost(post: IPost): void;
  deletePost(post_id: number): void;
  removeAttachmentById(id: number, post: IPost): void;
};

export function PostList({
  posts,
  onClickReaction,
  openEmojiPicker,
  editPost,
  replyPost,
  deletePost,
  removeAttachmentById,
}: PostListProps) {
  const ref = useRef<HTMLElement>();

  const moveScrollDown = useCallback(() => {
    const element = ref.current;
    element?.scrollTo(0, element.scrollHeight);
  }, []);

  useEffect(() => {
    moveScrollDown();
  }, [moveScrollDown]);

  return (
    <Stack
      gap="10px"
      ref={ref}
      sx={{
        position: "relative",
        flexGrow: 1,
        fontFamily: "Inter",
        fontStyle: "normal",
        overflowY: "auto",
      }}
    >
      {posts.map((post, index) => (
        <Fragment key={post.id}>
          <Post
            key={post.id}
            post={post}
            onClickReaction={onClickReaction}
            openEmojiPicker={openEmojiPicker}
            editPost={editPost}
            replyPost={replyPost}
            deletePost={deletePost}
            removeAttachmentById={removeAttachmentById}
          />
          {index !== posts.length - 1 && (
            <Divider sx={{ borderColor: "#000", marginTop: "10px" }} />
          )}
        </Fragment>
      ))}
      <IconButton
        onClick={moveScrollDown}
        sx={{
          position: "sticky",
          left: "93%",
          bottom: 30,
          width: "30px",
          height: "30px",
          border: "1px solid #000",
          background: "#fff",
        }}
      >
        <KeyboardDoubleArrowDownIcon />
      </IconButton>
    </Stack>
  );
}
