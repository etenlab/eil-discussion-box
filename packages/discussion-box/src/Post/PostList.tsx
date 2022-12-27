import React, { ForwardedRef, forwardRef, Fragment } from "react";

import { Divider, Stack } from "@mui/material";

import { IPost } from "../utils/types";

import { Post } from "./Post";

type PostListProps = {
  posts: IPost[];
  openEmojiPicker(anchorEl: HTMLButtonElement, post: IPost): void;
  onClickReaction(post: IPost, content: string): void;
  editPost(post: IPost): void;
  replyPost(post_id: number): void;
  deletePost(post_id: number): void;
  removeAttachmentById(id: number, post: IPost): void;
};

function PostListPure(
  {
    posts,
    onClickReaction,
    openEmojiPicker,
    editPost,
    replyPost,
    deletePost,
    removeAttachmentById
  }: PostListProps,
  ref: ForwardedRef<HTMLElement>
) {
  return (
    <Stack
      gap="10px"
      ref={ref}
      sx={{
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
    </Stack>
  );
}

export const PostList = forwardRef(PostListPure);
