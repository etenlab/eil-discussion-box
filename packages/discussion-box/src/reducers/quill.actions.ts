import { IFile, IPost } from '../utils/types';

export const actions = {
  INITIALIZE_QUILL: 'INITIALIZE_QUILL',
  SET_POST_FOR_EDITING: 'SET_POST_FOR_EDITING',
  SET_POST_FOR_REPLYING: 'SET_POST_FOR_REPLYING',
  SAVE_QUILL_STATES: 'SAVE_QUILL_STATES',
  RECOVER_QUILL_STATES: 'RECOVER_QUILL_STATES',
  ADD_ATTACHMENT: 'ADD_ATTACHMENT',
  CANCEL_ATTACHMENT: 'CANCEL_ATTACHMENT',
  CHANGE_QUILL: 'CHANGE_QUILL',
};

export function initializeQuill() {
  return {
    type: actions.INITIALIZE_QUILL,
    payload: null,
  };
}

export function setPostForEditing(post: IPost) {
  return {
    type: actions.SET_POST_FOR_EDITING,
    payload: post,
  };
}

export function setPostForReplying(post: IPost) {
  return {
    type: actions.SET_POST_FOR_REPLYING,
    payload: post,
  };
}

export function saveQuillStates({
  quill,
  plain,
  attachments,
}: {
  quill?: string;
  plain: string;
  attachments: IFile[];
}) {
  return {
    type: actions.SAVE_QUILL_STATES,
    payload: {
      quill,
      plain,
      attachments,
    },
  };
}

export function recoverQuillStates() {
  return {
    type: actions.RECOVER_QUILL_STATES,
    payload: null,
  };
}

export function addAttachment(file: IFile) {
  return {
    type: actions.ADD_ATTACHMENT,
    payload: file,
  };
}

export function cancelAttachment(file: IFile) {
  return {
    type: actions.CANCEL_ATTACHMENT,
    payload: file,
  };
}

export function changeQuill(quill: string | undefined, plain: string) {
  return {
    type: actions.CHANGE_QUILL,
    payload: {
      quill,
      plain,
    },
  };
}
