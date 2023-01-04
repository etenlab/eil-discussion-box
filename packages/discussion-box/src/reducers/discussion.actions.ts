import { IDiscussion, IPost, IReaction } from "../utils/types";

export const actions = {
  DISCUSSION_LOADED: "DISCUSSION_LOADED",
  POST_CREATED: "POST_CREATED",
  POST_UPDATED: "POST_UPDATED",
  POST_DELETED: "POST_DELETED",
  REACTION_CREATED: "REACTION_CREATED",
  REACTION_DELETED: "REACTION_DELETED",
};

export function loadDiscussion(discussion: IDiscussion) {
  return {
    type: actions.DISCUSSION_LOADED,
    payload: discussion,
  };
}

export function loadNewPost(post: IPost) {
  return {
    type: actions.POST_CREATED,
    payload: post,
  };
}

export function loadUpdatedPost(post: IPost) {
  return {
    type: actions.POST_UPDATED,
    payload: post,
  };
}

export function loadDeletedPostId(postId: number) {
  return {
    type: actions.POST_DELETED,
    payload: postId,
  };
}

export function loadNewReaction(reaction: IReaction) {
  return {
    type: actions.REACTION_CREATED,
    payload: reaction,
  };
}

export function loadDeletedReactionId(reactionId: number) {
  return {
    type: actions.REACTION_DELETED,
    payload: reactionId,
  };
}
