import { Dispatch, useCallback, useEffect } from 'react';

import { useMutation } from '@apollo/client';

import { fileClient as client } from '../graphql/fileGraphql';
import { UPLOAD_FILE } from '../graphql/fileQuery';

import { UploadedFile, IFile, ActionType, IPost } from '../utils/types';

import { alertFeedback } from '../reducers/global.actions';
import {
  initializeQuill as initializeQuillAction,
  setPostForEditing as setPostForEditingAction,
  setPostForReplying as setPostForReplyingAction,
  saveQuillStates as saveQuillStatesAction,
  recoverQuillStates as recoverQuillStatesAction,
  addAttachment,
  cancelAttachment as cancelAttachmentAction,
  changeQuill as changeQuillAction,
} from '../reducers/quill.actions';

type UseQuillProps = {
  dispatch: Dispatch<ActionType<unknown>>;
};

// This hook take care every chagnes of discussion's state via connecting graphql servers
export function useQuill({ dispatch }: UseQuillProps) {
  const [uploadFile, { data, loading, error }] = useMutation<UploadedFile>(
    UPLOAD_FILE,
    {
      client,
    },
  );

  // Upload is successful then trigger onAddAttachment
  useEffect(() => {
    if (error) {
      dispatch(alertFeedback('error', `Cannot upload file to server!`));
      return;
    }

    if (!data) {
      return;
    }

    dispatch(addAttachment(data.uploadFile));
  }, [data, error, dispatch]);

  const initializeQuill = useCallback(() => {
    dispatch(initializeQuillAction());
  }, [dispatch]);

  const setPostForEditing = useCallback(
    (post: IPost) => {
      dispatch(setPostForEditingAction(post));
    },
    [dispatch],
  );

  const setPostForReplying = useCallback(
    (post: IPost) => {
      dispatch(setPostForReplyingAction(post));
    },
    [dispatch],
  );

  const saveQuillStates = useCallback(
    ({
      quill,
      plain,
      attachments,
    }: {
      quill?: string;
      plain: string;
      attachments: IFile[];
    }) => {
      dispatch(saveQuillStatesAction({ quill, plain, attachments }));
    },
    [dispatch],
  );

  const recoverQuillStates = useCallback(() => {
    dispatch(recoverQuillStatesAction());
  }, [dispatch]);

  const cancelAttachment = useCallback(
    (file: IFile) => {
      dispatch(cancelAttachmentAction(file));
    },
    [dispatch],
  );

  const changeQuill = useCallback(
    (quill: string | undefined, plain: string) => {
      dispatch(changeQuillAction(quill, plain));
    },
    [dispatch],
  );

  return {
    initializeQuill,
    setPostForEditing,
    setPostForReplying,
    saveQuillStates,
    recoverQuillStates,
    cancelAttachment,
    uploadFile,
    uploading: loading,
    changeQuill,
  };
}
