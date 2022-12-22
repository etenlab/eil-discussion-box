import React, { ForwardedRef, forwardRef } from "react";

import { Stack } from "@mui/material";

import { IPost } from "../utils/types";

import { Post } from "./Post";

type PostListProps = {
  posts: IPost[];
  openEmojiPicker(anchorEl: HTMLButtonElement, post: IPost): void;
  onClickReaction(post: IPost, content: string): void;
  editPost(post_id: number): void;
  replyPost(post_id: number): void;
  deletePost(post_id: number): void;
};

function PostListPure(
  {
    posts,
    onClickReaction,
    openEmojiPicker,
    editPost,
    replyPost,
    deletePost,
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
      {posts.map((post) => (
        <>
          <Post
            key={post.id}
            post={post}
            onClickReaction={onClickReaction}
            openEmojiPicker={openEmojiPicker}
            editPost={editPost}
            replyPost={replyPost}
            deletePost={deletePost}
          />
          <hr />
        </>
      ))}
    </Stack>
  );
}

export const PostList = forwardRef(PostListPure);
