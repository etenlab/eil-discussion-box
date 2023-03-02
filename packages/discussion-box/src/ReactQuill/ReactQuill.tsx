import React, {
  useRef,
  useImperativeHandle,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ChangeEventHandler,
} from 'react';
import 'react-quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';

import { Skeleton, IconButton } from '@mui/material';

import HighlightOffOutlinedIcon from '@mui/icons-material/HighlightOffOutlined';
import CloseIcon from '@mui/icons-material/Close';

import { QuillAttachmentList } from '../AttachmentList';
import {
  AttachmentListContainer,
  QuillContainer,
  AttachmentButtonContainer,
  ReactionButtonContainer,
  ReplyButtonContainer,
  QuillTitleContainer,
} from './styled';

import { AddAttachmentButton } from '../common/AddAttachmentButton';
import { AddReactionButton } from '../common/AddReactionButton';
import { SendButton } from '../common/SendButton';
import { CircleCloseButton } from './styled';

import { modules, formats, Skeletons } from './utils';
import { getMimeType } from '../utils/helpers';
import { useDiscussionContext } from '../hooks/useDiscussionContext';

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

type SkeletonSize = {
  width: string;
  height: string;
};

export const CustomReactQuill = forwardRef<
  {
    focus(): void;
    write(str: string): void;
  } | null,
  unknown
>((_, ref) => {
  const {
    states: {
      quill: { quill, plain, attachments, editingPost, replyingPost },
      discussion,
      global: { userId },
      uploading,
    },
    actions: {
      initializeQuill,
      cancelAttachment,
      saveQuillStates,
      changeQuill,
      uploadFile,
      openEmojiPicker,
      updatePost,
      createPost,
      alertFeedback,
      changeEditorKind,
    },
  } = useDiscussionContext();

  const quillRef = useRef<ReactQuill | null>(null);
  const skeletonRef = useRef<SkeletonSize | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  useImperativeHandle(
    ref,
    () => ({
      focus: () => {
        quillRef.current?.focus();
      },
      write: (str: string) => {
        changeQuill(quill + str, plain + str);
      },
    }),
    [quill, plain, changeQuill],
  );

  const createOrUpdatePost = () => {
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

    saveQuillStates(quill, attachments);
  };

  const handleKeyEvent = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      createOrUpdatePost();
    }
  };

  const handleChange = (
    value: string,
    _delta: any,
    _source: any,
    editor: any,
  ) => {
    changeQuill(value, editor.getText(value));
  };

  const handleReactionClick = (event: MouseEvent<Element>) => {
    openEmojiPicker(event.currentTarget, null, 'quill');
  };

  // Get a file then upload
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    inputRef.current = event.target;
    const files = event.target.files;

    if (files && files.length > 0) {
      const file = files[0];

      if (file.size > maxFileSize) {
        alertFeedback(
          'warning',
          `Exceed max file size ( > ${process.env.REACT_APP_MAX_FILE_SIZE})!`,
        );
        return;
      }

      const mimeType = getMimeType(file.type) as keyof typeof Skeletons;
      skeletonRef.current = Skeletons[mimeType];

      uploadFile({
        variables: { file, file_size: file.size, file_type: file.type },
      });

      inputRef.current.value = '';
    }
  };

  const handleCloseQuill = () => {
    if (plain.trim() !== '' || attachments.length > 0) {
      const result = window.confirm(
        'Are you sure to cancel this post? You have unsaved inputs',
      );
      if (!result) {
        return;
      }
    }

    initializeQuill();
    changeEditorKind(null);
  };

  let quillTitle = '';

  if (editingPost || replyingPost) {
    if (editingPost) {
      quillTitle = 'Editing';
    }
    if (replyingPost) {
      quillTitle = `Replying to @${replyingPost.user.username}`;
    }
  }

  const disabled = uploading;

  return (
    <QuillContainer>
      {attachments.length > 0 || uploading ? (
        <AttachmentListContainer>
          <QuillAttachmentList
            attachments={attachments}
            onCancel={cancelAttachment}
          />
          {uploading ? (
            <Skeleton
              animation="wave"
              variant="rectangular"
              width={skeletonRef.current?.width}
              height={skeletonRef.current?.height}
              sx={{ borderRadius: '8px' }}
            />
          ) : null}
        </AttachmentListContainer>
      ) : null}

      {quillTitle !== '' ? (
        <QuillTitleContainer>
          <span style={{ fontSize: '14px' }}>{quillTitle}</span>
          <IconButton onClick={initializeQuill}>
            <HighlightOffOutlinedIcon />
          </IconButton>
        </QuillTitleContainer>
      ) : null}

      <div style={{ position: 'relative' }}>
        <ReactQuill
          ref={quillRef}
          theme="snow"
          value={quill}
          onKeyDown={handleKeyEvent}
          onChange={handleChange}
          modules={modules}
          formats={formats}
        />
        {quillTitle === 'Editing' ? null : (
          <AttachmentButtonContainer>
            <AddAttachmentButton
              onChange={handleFileChange}
              disabled={disabled}
            />
          </AttachmentButtonContainer>
        )}
        <ReactionButtonContainer>
          <AddReactionButton onClick={handleReactionClick} />
        </ReactionButtonContainer>
        <ReplyButtonContainer>
          <SendButton onClick={createOrUpdatePost} />
        </ReplyButtonContainer>
        <CircleCloseButton onClick={handleCloseQuill}>
          <CloseIcon />
        </CircleCloseButton>
      </div>
    </QuillContainer>
  );
});
