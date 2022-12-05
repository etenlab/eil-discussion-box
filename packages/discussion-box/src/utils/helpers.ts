import { IDiscussion, IPost, IReaction } from "./types";

export function recalcDiscusionWithNewPost(
  discussion: IDiscussion,
  newPost: IPost
): IDiscussion {
  if (discussion.posts.find((post) => post.id === newPost.id)) {
    return discussion;
  } else {
    return {
      ...discussion,
      posts: [...discussion.posts, newPost],
    };
  }
}

export function recalcDiscussionWithDeletedPostId(
  discussion: IDiscussion,
  postId: number
): IDiscussion {
  return {
    ...discussion,
    posts: discussion.posts.filter((post) => post.id !== postId),
  };
}

export function recalcDiscussionWithNewReation(
  discussion: IDiscussion,
  newReaction: IReaction
): IDiscussion {
  const discussion_id = newReaction.post.discussion.id;
  const post_id = newReaction.post.id;
  const reaction_id = newReaction.id;

  if (discussion.id !== discussion_id) {
    return discussion;
  }

  return {
    ...discussion,
    posts: discussion.posts.map((post) => {
      if (post.id !== post_id) {
        return post;
      }

      if (post.reactions.find((reaction) => reaction.id === reaction_id)) {
        return post;
      }

      return {
        ...post,
        reactions: [...post.reactions, newReaction],
      };
    }),
  };
}

export function recalcDiscusionWithDeletedReactionId(
  discussion: IDiscussion,
  reactionId: number
): IDiscussion {
  return {
    ...discussion,
    posts: discussion.posts.map((post) => ({
      ...post,
      reactions: post.reactions.filter(
        (reaction) => reaction.id !== reactionId
      ),
    })),
  };
}
