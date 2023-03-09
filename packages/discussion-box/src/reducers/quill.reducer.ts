import { actions } from './quill.actions';

import { IPost, IFile, ActionType } from '../utils/types';

export type StateType = {
  editingPost: IPost | null;
  replyingPost: IPost | null;
  quill: string | undefined;
  prevQuill: string | undefined;
  plain: string;
  prevPlain: string;
  attachments: IFile[];
  prevAttachments: IFile[];
};

export const initialState = {
  editingPost: null,
  replyingPost: null,
  quill: undefined,
  plain: '',
  attachments: [],
  prevQuill: undefined,
  prevPlain: '',
  prevAttachments: [],
};

export function reducer(
  state: StateType = initialState,
  action: ActionType<unknown>,
): StateType {
  const prevState: StateType = JSON.parse(JSON.stringify(state));
  const { type } = action;

  switch (type) {
    case actions.INITIALIZE_QUILL: {
      return initialState;
    }
    case actions.SET_POST_FOR_EDITING: {
      const editingPost = action.payload as IPost;
      return {
        ...prevState,
        editingPost,
        replyingPost: null,
        quill: editingPost.quill_text,
        plain: editingPost.plain_text,
        attachments: [],
      };
    }
    case actions.SET_POST_FOR_REPLYING: {
      const replyingPost = action.payload as IPost;
      return {
        ...prevState,
        replyingPost,
        editingPost: null,
        quill: undefined,
        plain: '',
        attachments: [],
      };
    }
    case actions.SAVE_QUILL_STATES: {
      return {
        ...prevState,
        editingPost: null,
        replyingPost: null,
        quill: undefined,
        plain: '',
        attachments: [],
        prevQuill: prevState.quill,
        prevPlain: prevState.plain,
        prevAttachments: prevState.attachments,
      };
    }
    case actions.RECOVER_QUILL_STATES: {
      return {
        ...prevState,
        quill: prevState.prevQuill,
        plain: prevState.prevPlain,
        attachments: prevState.prevAttachments,
        prevQuill: undefined,
        prevPlain: '',
        prevAttachments: [],
      };
    }
    case actions.ADD_ATTACHMENT: {
      const addedFile = action.payload as IFile;
      return {
        ...prevState,
        attachments: [...prevState.attachments, addedFile],
      };
    }
    case actions.CANCEL_ATTACHMENT: {
      const canceledFile = action.payload as IFile;
      return {
        ...prevState,
        attachments: prevState.attachments.filter(
          (file) => file.id !== canceledFile.id,
        ),
      };
    }
    case actions.CHANGE_QUILL: {
      const { quill, plain } = action.payload as {
        quill: string | undefined;
        plain: string;
      };
      return {
        ...prevState,
        quill,
        plain,
      };
    }
    default: {
      return prevState;
    }
  }
}
