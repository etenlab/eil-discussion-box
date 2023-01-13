import React, { createContext, useReducer, useRef, RefObject } from 'react';

import { reducer, initialState as reducerInitialState } from './reducers';

import { StateType as DiscussionStateType } from './reducers/discussion.reducer';
import { StateType as QuillStateType } from './reducers/quill.reducer';
import { StateType as GlobalStateType } from './reducers/global.reducer';

import { useDiscussion } from './hooks/useDiscussion';
import { useReaction } from './hooks/useReaction';
import { usePost } from './hooks/usePost';
import { useQuill } from './hooks/useQuill';
import { useGlobal } from './hooks/useGlobal';
import {
  FeedbackType,
  IPost,
  IFile,
  EmojiModeType,
  EditorKinds,
} from './utils/types';

export interface ContextType {
  states: {
    loading: boolean;
    uploading: boolean;
    discussion: DiscussionStateType;
    quill: QuillStateType;
    global: GlobalStateType;
    quillRef: RefObject<{
      focus(): void;
      write(str: string): void;
    } | null>;
  };
  actions: {
    changeDiscussionByTableNameAndRow(table_name: string, row: number): void;
    createPost: any;
    updatePost: any;
    deletePost: any;
    deleteAttachment: any;
    createReaction: any;
    deleteReaction: any;
    initializeQuill: any;
    setPostForEditing: any;
    setPostForReplying: any;
    saveQuillStates: any;
    recoverQuillStates: any;
    cancelAttachment(file: IFile): void;
    changeQuill(quill: string | undefined, plain: string): void;
    uploadFile: any;
    setNewUser(userId: number): void;
    alertFeedback(feedbackType: FeedbackType, message: string): void;
    closeFeedback(): void;
    openEmojiPicker(
      anchorEl: Element | null,
      post: IPost | null,
      mode: EmojiModeType,
    ): void;
    closeEmojiPicker(): void;
    changeEditorKind(kind: EditorKinds | null): void;
  };
}

export const DiscussionContext = createContext<ContextType | undefined>(
  undefined,
);

type DiscussionProviderProps = {
  children?: React.ReactNode;
};

export function DiscussionProvider({ children }: DiscussionProviderProps) {
  const [state, dispatch] = useReducer(reducer, reducerInitialState);
  const quillRef = useRef<{ focus(): void; write(str: string): void } | null>(
    null,
  );

  const { loading: discussionLoading, changeDiscussionByTableNameAndRow } =
    useDiscussion({
      discussion: state.discussion,
      dispatch,
    });

  const { createPost, updatePost, deletePost, deleteAttachment } = usePost({
    discussionId: state.discussion ? state.discussion.id : null,
    dispatch,
  });

  const { createReaction, deleteReaction } = useReaction({
    discussionId: state.discussion ? state.discussion.id : null,
    dispatch,
  });

  const {
    initializeQuill,
    setPostForEditing,
    setPostForReplying,
    saveQuillStates,
    recoverQuillStates,
    cancelAttachment,
    changeQuill,
    uploadFile,
    uploading,
  } = useQuill({ dispatch });

  const {
    setNewUser,
    alertFeedback,
    closeFeedback,
    openEmojiPicker,
    closeEmojiPicker,
    changeEditorKind,
  } = useGlobal({ dispatch });

  const value = {
    states: {
      loading: discussionLoading,
      uploading,
      discussion: state.discussion,
      quill: state.quill,
      global: state.global,
      quillRef,
    },
    actions: {
      changeDiscussionByTableNameAndRow,
      createPost,
      updatePost,
      deletePost,
      deleteAttachment,
      createReaction,
      deleteReaction,
      initializeQuill,
      setPostForEditing,
      setPostForReplying,
      saveQuillStates,
      recoverQuillStates,
      cancelAttachment,
      changeQuill,
      uploadFile,
      setNewUser,
      alertFeedback,
      closeFeedback,
      openEmojiPicker,
      closeEmojiPicker,
      changeEditorKind
    },
  };

  return (
    <DiscussionContext.Provider value={value}>
      {children}
    </DiscussionContext.Provider>
  );
}
