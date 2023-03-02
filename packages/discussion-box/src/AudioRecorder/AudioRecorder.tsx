import React, { useState, useEffect } from 'react';

import { MuiMaterial, DiscussionBoxUI, colors } from '@eten-lab/ui-kit';

import { useDiscussionContext } from '../hooks/useDiscussionContext';

const { Backdrop, Box } = MuiMaterial;
const { AudioRecorder: AudioRecorderUI } = DiscussionBoxUI;

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

export function AudioRecorder() {
  const {
    states: {
      uploading,
      quill: { attachments, replyingPost },
      discussion,
      global: { userId },
    },
    actions: {
      uploadFile,
      createPost,
      alertFeedback,
      initializeQuill,
      changeEditorKind,
    },
  } = useDiscussionContext();
  const [status, setStatus] = useState<
    'init' | 'save' | 'uploading' | 'uploaded'
  >('init');

  useEffect(() => {
    if (!uploading && status === 'save') {
      return;
    }
    if (uploading && status === 'save') {
      setStatus('uploading');
    }
    if (uploading && status === 'uploading') {
      return;
    }
    if (!uploading && status === 'uploading') {
      setStatus('uploaded');
    }
  }, [uploading, status]);

  useEffect(() => {
    if (status === 'uploaded') {
      if (attachments.length > 0) {
        createPost({
          variables: {
            post: {
              discussion_id: discussion!.id,
              plain_text: '',
              postgres_language: 'simple',
              quill_text: '',
              user_id: userId,
              reply_id: replyingPost ? replyingPost.id : null,
            },
            files: attachments.map((file) => file.id),
          },
        });
      }
      initializeQuill();
      setStatus('init');
    }
  }, [
    status,
    attachments,
    createPost,
    initializeQuill,
    replyingPost,
    discussion,
    userId,
  ]);

  const handleSave = (blobs: Blob[]) => {
    const file = new File(blobs, `record_${userId}.wav`);

    if (file.size > maxFileSize) {
      alertFeedback(
        'warning',
        `Exceed max file size ( > ${process.env.REACT_APP_MAX_FILE_SIZE})!`,
      );
      return;
    }

    uploadFile({
      variables: { file, file_size: file.size, file_type: 'audio/x-wav' },
    });

    setStatus('save');
  };

  const handleCancel = () => {
    changeEditorKind(null);
  };

  return (
    <Backdrop
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        color: '#fff',
        zIndex: (theme) => theme.zIndex.drawer + 1,
      }}
      open
    >
      <Box
        sx={{
          backgroundColor: colors['white'],
          borderRadius: '20px 20px 0 0',
          padding: '30px',
          width: '100%',
        }}
      >
        <AudioRecorderUI onSave={handleSave} onCancel={handleCancel} />
      </Box>
    </Backdrop>
  );
}
