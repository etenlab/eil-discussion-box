import {
  EditorKinds,
  EmojiModeType,
  FeedbackType,
  IPost,
} from '../utils/types';

export const actions = {
  SET_NEW_USER: 'SET_NEW_USER',
  OPERATION_FEEDBACK: 'OPERATION_FEEDBACK',
  CLOSE_FEEDBACK: 'CLOSE_FEEDBACK',
  OPEN_EMOJI_PICKER: 'OPEN_EMOJI_PICKER',
  CLOSE_EMOJI_PICKER: 'CLOSE_EMOJI_PICKER',
  CHANGE_EDITOR_KIND: 'CHANGE_EDITOR_KIND',
};

export function setNewUser(userId: number) {
  return {
    type: actions.SET_NEW_USER,
    payload: userId,
  };
}

export function alertFeedback(feedbackType: FeedbackType, message: string) {
  return {
    type: actions.OPERATION_FEEDBACK,
    payload: {
      feedbackType,
      message,
    },
  };
}

export function closeFeedback() {
  return {
    type: actions.CLOSE_FEEDBACK,
    payload: null,
  };
}

export function openEmojiPicker(
  anchorEl: Element | null,
  post: IPost | null = null,
  mode: EmojiModeType = 'react',
) {
  return {
    type: actions.OPEN_EMOJI_PICKER,
    payload: {
      anchorEl,
      post,
      mode,
    },
  };
}

export function closeEmojiPicker() {
  return {
    type: actions.CLOSE_EMOJI_PICKER,
    payload: null,
  };
}

export function changeEditorKind(kind: EditorKinds | null) {
  return {
    type: actions.CHANGE_EDITOR_KIND,
    payload: kind,
  };
}
