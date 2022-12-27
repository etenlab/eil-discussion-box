import { IDiscussion, IPost, IReaction } from "./types";

export function recalcDiscusionWithNewPost(
  discussion: IDiscussion,
  newPost: IPost
): IDiscussion {
  if (discussion.posts.find((post: IPost) => post.id === newPost.id)) {
    return discussion;
  } else {
    return {
      ...discussion,
      posts: [...discussion.posts, newPost],
    };
  }
}

export function recalcDiscusionWithUpdatedPost(
  discussion: IDiscussion,
  updatedPost: IPost
): IDiscussion {
  const index = discussion.posts.findIndex(
    (post) => post.id === updatedPost.id
  );

  if (index === -1) {
    return {
      ...discussion,
      posts: [...discussion.posts, updatedPost],
    };
  } else {
    const newPosts = [...discussion.posts];
    newPosts[index] = updatedPost;
    return {
      ...discussion,
      posts: [...newPosts],
    };
  }
}

export function recalcDiscussionWithDeletedPostId(
  discussion: IDiscussion,
  postId: number
): IDiscussion {
  return {
    ...discussion,
    posts: discussion.posts.filter((post: IPost) => post.id !== postId),
  };
}

export function recalcDiscussionWithNewReation(
  discussion: IDiscussion,
  newReaction: IReaction
): IDiscussion {
  // const discussion_id = newReaction.post.discussion.id;
  const post_id = newReaction.post_id;
  const reaction_id = newReaction.id;

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

type MapContentToReactions = {
  [index: string]: {
    content: string;
    reactions: IReaction[];
  };
};

export function sortByContent(reactions: IReaction[]) {
  const mapContentToReactions: MapContentToReactions = {};

  reactions.forEach((reaction) => {
    if (mapContentToReactions[reaction.content]) {
      mapContentToReactions[reaction.content].reactions.push(reaction);
    } else {
      mapContentToReactions[reaction.content] = {
        content: reaction.content,
        reactions: [reaction],
      };
    }
  });

  return Object.values(mapContentToReactions).sort((A, B) => {
    if (A.content > B.content) return 1;
    if (A.content < B.content) return -1;
    return 0;
  });
}

export const getMimeType = (fileType: string | null): string => {
  if (fileType === null || fileType.trim().length === 0) {
    return "normal";
  }

  const classic = fileType.trim().split("/");

  if (classic.length < 2) return "normal";

  switch (classic[0]) {
    case "video": {
      return "video";
    }
    case "audio": {
      return "audio";
    }
    case "image": {
      return "image";
    }
    default: {
      return "normal";
    }
  }
};
