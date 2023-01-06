import { actions } from './global.actions';

import { ActionType, FeedbackType, EmojiModeType, IPost } from '../utils/types';

export type StateType = {
  userId: number | null;
  snack: {
    open: boolean;
    message: string;
    severity: FeedbackType;
  };
  emoji: {
    anchorEl: Element | null;
    post: IPost | null;
    mode: EmojiModeType;
  };
};
export const initialState: StateType = {
  userId: null,
  snack: {
    open: false,
    message: '',
    severity: 'success',
  },
  emoji: {
    anchorEl: null,
    post: null,
    mode: 'react',
  },
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState = { ...state };
  const { type } = action;

  switch (type) {
    case actions.SET_NEW_USER: {
      const userId = action.payload as number;
      return {
        ...prevState,
        userId,
      };
    }
    case actions.OPERATION_FEEDBACK: {
      const { feedbackType, message } = action.payload as {
        feedbackType: FeedbackType;
        message: string;
      };
      return {
        ...prevState,
        snack: {
          open: true,
          message,
          severity: feedbackType,
        },
      };
    }
    case actions.CLOSE_FEEDBACK: {
      return {
        ...prevState,
        snack: {
          ...prevState.snack,
          open: false,
        },
      };
    }
    case actions.OPEN_EMOJI_PICKER: {
      const emoji = action.payload as {
        anchorEl: Element | null;
        post: IPost | null;
        mode: EmojiModeType;
      };
      return {
        ...prevState,
        emoji,
      };
    }
    case actions.CLOSE_EMOJI_PICKER: {
      return {
        ...prevState,
        emoji: {
          anchorEl: null,
          post: null,
          mode: 'react',
        },
      };
    }
    default: {
      return prevState;
    }
  }
}
