import { ActionType } from "../utils/types";
import {
  StateType as DiscussionStateType,
  initialState as discussionInitialState,
  reducer as discussionReducer,
} from "./discussion.reducer";

import {
  StateType as QuillStateType,
  initialState as quillInitialState,
  reducer as quillReducer,
} from "./quill.reducer";

import {
  StateType as GlobalStateType,
  initialState as globalInitialState,
  reducer as globalReducer,
} from "./global.reducer";

export interface StateType {
  discussion: DiscussionStateType;
  quill: QuillStateType;
  global: GlobalStateType;
}

export const initialState = {
  discussion: discussionInitialState,
  quill: quillInitialState,
  global: globalInitialState,
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>
): StateType {
  return {
    discussion: discussionReducer(state.discussion, action),
    quill: quillReducer(state.quill, action),
    global: globalReducer(state.global, action),
  };
}
