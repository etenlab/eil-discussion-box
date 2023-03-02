import React, { useEffect, useRef, useCallback } from 'react';

import {
  MuiMaterial,
  DiscussionBoxUI,
  colors,
  EmojiPicker,
  EmojiClickData,
} from '@eten-lab/ui-kit';

import { PostList } from './PostList';
import { ReactQuill } from './ReactQuill';
import { AudioRecorder } from './AudioRecorder';
import { VideoRecorder } from './VideoRecorder';

import { IPost, EditorKinds } from './utils/types';
import { useDiscussionContext } from './hooks/useDiscussionContext';

const { Stack, Snackbar, Alert, Popover, CircularProgress, Backdrop, Box } =
  MuiMaterial;
const { InputButtonGroup } = DiscussionBoxUI;

const InputComponents = {
  quill: <ReactQuill />,
  audio: <AudioRecorder />,
  video: <VideoRecorder />,
};

type InputComponentsKey = keyof typeof InputComponents;

export type DiscussionPureProps = {
  userId: number;
  tableName: string;
  rowId: number;
  appId: number;
  orgId: number;
  height: string;
};

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
export function DiscussionPure({
  userId,
  tableName,
  rowId,
  appId,
  orgId,
  height,
}: DiscussionPureProps) {
  const {
    states: { loading: discussionLoading, global, quillRef, uploading },
    actions: {
      changeDiscussion,
      changeEditorKind,
      setNewUser,
      closeFeedback,
      closeEmojiPicker,
      createReaction,
      deleteReaction,
    },
  } = useDiscussionContext();

  const { snack, emoji, editorKind } = global;

  useEffect(() => {
    if (global.userId !== userId) {
      setNewUser(userId);
    }
  }, [userId, setNewUser, global.userId]);

  useEffect(() => {
    changeDiscussion({ table_name: tableName, row: rowId, appId, orgId });
  }, [tableName, rowId, appId, orgId, changeDiscussion]);

  const discussionRef = useRef<HTMLElement>(null);

  const handleEmojiClickByReact = useCallback(
    (post: IPost | null, emojiData: EmojiClickData) => {
      if (post) {
        const reaction = post.reactions.find(
          (reaction) =>
            reaction.content === emojiData.unified &&
            reaction.user_id === userId,
        );

        if (reaction) {
          deleteReaction({
            variables: {
              id: reaction.id,
              userId,
            },
          });
        } else {
          createReaction({
            variables: {
              reaction: {
                content: emojiData.unified,
                post_id: post.id,
                user_id: userId,
              },
            },
          });
        }
      }
    },
    [deleteReaction, createReaction, userId],
  );

  const handleEmojiClickByQuill = useCallback(
    (emojiData: EmojiClickData) => {
      quillRef.current?.write(emojiData.emoji);
    },
    [quillRef],
  );

  const handleEmojiClick = useCallback(
    (emojiData: EmojiClickData) => {
      if (emoji.mode === 'quill') {
        handleEmojiClickByQuill(emojiData);
      }

      if (emoji.mode === 'react') {
        handleEmojiClickByReact(emoji.post, emojiData);
      }

      closeEmojiPicker();
    },
    [emoji, handleEmojiClickByQuill, handleEmojiClickByReact, closeEmojiPicker],
  );

  const handleChangeInput = (mode: EditorKinds) => {
    changeEditorKind(mode);
  };

  const openedEmojiPicker = Boolean(emoji.anchorEl);

  const InputComponent = editorKind
    ? InputComponents[editorKind as InputComponentsKey]
    : null;

  const InputPanel = editorKind ? (
    InputComponent
  ) : (
    <Box
      sx={{
        padding: '20px',
        borderRadius: '20px 20px 0 0',
        borderTop: `1px solid ${colors['middle-gray']}`,
      }}
    >
      <InputButtonGroup onClick={handleChangeInput} />
    </Box>
  );

  const loading = discussionLoading || (uploading && editorKind !== null);

  return (
    <>
      <Stack
        justifyContent="space-between"
        style={{
          height,
        }}
        ref={discussionRef}
      >
        <PostList />
        {InputPanel}
      </Stack>

      <Popover
        open={discussionRef.current !== null}
        anchorEl={
          emoji.anchorEl === null ? discussionRef.current : emoji.anchorEl
        }
        onClose={closeEmojiPicker}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        sx={{
          display: openedEmojiPicker ? 'inherit' : 'none',
        }}
      >
        <EmojiPicker onEmojiClick={handleEmojiClick} />
      </Popover>

      <Snackbar
        open={snack.open}
        autoHideDuration={2000}
        onClose={closeFeedback}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        key="bottom-right"
      >
        <Alert
          variant="filled"
          onClose={closeFeedback}
          severity={snack.severity}
          sx={{ width: '100%' }}
        >
          {snack.message}
        </Alert>
      </Snackbar>

      <Backdrop sx={{ color: '#fff', zIndex: 1000 }} open={loading}>
        <Stack justifyContent="center">
          <div style={{ margin: 'auto' }}>
            <CircularProgress color="inherit" />
          </div>
          <div>LOADING</div>
        </Stack>
      </Backdrop>
    </>
  );
}
