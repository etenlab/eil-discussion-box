import { actions } from "./discussion.actions";

import { IDiscussion, ActionType, IPost, IReaction } from "../utils/types";
import {
  recalcDiscusionWithNewPost,
  recalcDiscusionWithUpdatedPost,
  recalcDiscussionWithDeletedPostId,
  recalcDiscussionWithNewReation,
  recalcDiscusionWithDeletedReactionId,
} from "../utils/helpers";

export type StateType = IDiscussion | null;
export const initialState = null;

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>
): StateType {
  const prevState = JSON.parse(JSON.stringify(state));
  const { type } = action;

  switch (type) {
    case actions.DISCUSSION_LOADED: {
      const newDiscussion = action.payload as IDiscussion;
      return newDiscussion;
    }
    case actions.POST_CREATED: {
      const newPost = action.payload as IPost;
      return recalcDiscusionWithNewPost(prevState, newPost);
    }
    case actions.POST_UPDATED: {
      const updatedPost = action.payload as IPost;
      return recalcDiscusionWithUpdatedPost(prevState, updatedPost);
    }
    case actions.POST_DELETED: {
      const postId = action.payload as number;
      return recalcDiscussionWithDeletedPostId(prevState, postId);
    }
    case actions.REACTION_CREATED: {
      const newReaction = action.payload as IReaction;
      return recalcDiscussionWithNewReation(prevState, newReaction);
    }
    case actions.REACTION_DELETED: {
      const reactionId = action.payload as number;
      return recalcDiscusionWithDeletedReactionId(prevState, reactionId);
    }
    default: {
      return prevState;
    }
  }
}
