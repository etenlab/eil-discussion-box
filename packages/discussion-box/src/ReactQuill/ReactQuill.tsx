import React from 'react';

import { DiscussionBoxUI } from '@eten-lab/ui-kit';

import { useDiscussionContext } from '../hooks/useDiscussionContext';
import { IFile } from '../utils/types';

const { Quill } = DiscussionBoxUI;

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

export function ReactQuill() {
  const {
    states: {
      quillRef,
      quill: { quill, plain, attachments, editingPost, replyingPost },
      discussion,
      global: { userId },
      uploading,
    },
    actions: {
      initializeQuill,
      cancelAttachment,
      saveQuillStates,
      uploadFile,
      openEmojiPicker,
      updatePost,
      createPost,
      alertFeedback,
      changeEditorKind,
    },
  } = useDiscussionContext();

  const handleSend = ({ plain, quill }: { plain: string; quill?: string }) => {
    if (editingPost) {
      if (plain.trim() === '' && editingPost.files.length === 0) {
        alertFeedback('warning', 'Cannot save without any data');
        initializeQuill();
        return;
      }

      if (userId !== editingPost.user_id) {
        alertFeedback('warning', 'You are not owner of this post!');
        initializeQuill();
        return;
      }

      updatePost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: plain,
            postgres_language: 'simple',
            quill_text: quill || '',
            user_id: userId,
          },
          id: editingPost.id,
        },
      });
    } else {
      if (plain.trim() === '' && attachments.length === 0) {
        alertFeedback('warning', 'Cannot save without any data');
        initializeQuill();
        return;
      }

      createPost({
        variables: {
          post: {
            discussion_id: discussion!.id,
            plain_text: plain,
            postgres_language: 'simple',
            quill_text: quill || '',
            user_id: userId,
            reply_id: replyingPost ? replyingPost.id : null,
          },
          files: attachments.map((file) => file.id),
        },
      });
    }

    saveQuillStates({ quill, plain, attachments });
  };

  const handleInitializeQuill = () => {
    initializeQuill();
  };

  const handleClickOpenEmoji = (anchor: Element) => {
    openEmojiPicker(anchor, null, 'quill');
  };

  // Get a file then upload
  const handleAddAttachment = (file: File) => {
    if (file.size > maxFileSize) {
      alertFeedback(
        'warning',
        `Exceed max file size ( > ${process.env.REACT_APP_MAX_FILE_SIZE})!`,
      );
      return;
    }

    uploadFile({
      variables: { file, file_size: file.size, file_type: file.type },
    });
  };

  const handleCancelAttachment = (file: IFile) => {
    cancelAttachment(file);
  };

  const handleClose = () => {
    // if (plain.trim() !== '' || attachments.length > 0) {
    //   const result = window.confirm(
    //     'Are you sure to cancel this post? You have unsaved inputs',
    //   );
    //   if (!result) {
    //     return;
    //   }
    // }

    initializeQuill();
    changeEditorKind(null);
  };

  let quillTitle = '';
  let mode: 'standard' | 'editing' | 'replying' = 'standard';

  if (editingPost || replyingPost) {
    if (editingPost) {
      quillTitle = 'Editing';
      mode = 'editing';
    }
    if (replyingPost) {
      quillTitle = `Replying to @${replyingPost.user.username}`;
      mode = 'replying';
    }
  }

  return (
    <Quill
      ref={quillRef}
      emojiMode="out"
      onClickOpenButton={handleClickOpenEmoji}
      mode={mode}
      onInitializeQuill={handleInitializeQuill}
      quillTitle={quillTitle}
      initQuill={quill}
      initPlain={plain}
      uploading={uploading}
      attachments={attachments}
      onAttach={handleAddAttachment}
      onCancelAttachment={handleCancelAttachment}
      onSend={handleSend}
      onClose={handleClose}
    />
  );
}
