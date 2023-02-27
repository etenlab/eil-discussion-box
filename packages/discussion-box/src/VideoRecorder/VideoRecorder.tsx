import React, { useRef, useState, useEffect, useCallback } from 'react';

import { IconButton } from '@mui/material';

import StopCircleIcon from '@mui/icons-material/StopCircle';
import CircleIcon from '@mui/icons-material/Circle';
import FlipCameraIosOutlinedIcon from '@mui/icons-material/FlipCameraIosOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import PlayCircleIcon from '@mui/icons-material/PlayCircle';

import { RecorderControls } from '../common/RecorderControls';
import { CustomIconButton } from './styled';

import { useDiscussionContext } from '../hooks/useDiscussionContext';
import { RecorderStatus } from '../utils/types';

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

export function VideoRecorder() {
  const {
    states: {
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

  const [recorderStatus, setRecorderStatus] = useState<RecorderStatus>('new');
  const [facingMode, setFacingMode] = useState<"user" | "environment">("environment");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);
  const videoRef = useRef<HTMLVideoElement>(null);

  const getVideoStream = useCallback(async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: {
        facingMode
      },
    });

    if (videoRef.current !== null) {
      videoRef.current.srcObject = stream;
    }

    streamRef.current = stream;
  }, [facingMode]);

  const refreshRecorder = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
    }
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];
    setRecorderStatus('new');
    getVideoStream();
  }, [getVideoStream]);

  useEffect(() => {
    refreshRecorder();

    return () => {
      if (streamRef.current !== null) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    }
  }, [refreshRecorder]);

  useEffect(() => {
    if (recorderStatus !== 'ended') {
      return;
    }

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
      initializeQuill();
      refreshRecorder();
    }
  }, [
    attachments,
    recorderStatus,
    discussion,
    replyingPost,
    userId,
    createPost,
    changeEditorKind,
    initializeQuill,
    refreshRecorder
  ]);

  const handleStart = async () => {
    if (streamRef.current === null) {
      alertFeedback('error', 'Cannot found media stream!');
      return;
    }

    const options = { mimeType: 'video/webm' };
    const mediaRecorder = new MediaRecorder(streamRef.current, options);

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    });

    mediaRecorder.addEventListener('stop', function () {
      streamRef.current!.getTracks().forEach((track) => track.stop());
    });

    mediaRecorderRef.current = mediaRecorder;
    mediaRecorderRef.current.start(1000);
    setRecorderStatus('recording');
  };

  const handlePause = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alertFeedback('error', 'cannot pause because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.pause();
    setRecorderStatus('paused');
  };

  const handleResume = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alertFeedback('error', 'cannot resume because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.resume();
    setRecorderStatus('recording');
  };

  const handleCancel = () => {
    refreshRecorder();
    changeEditorKind(null);
  };

  const handleSave = () => {
    if (recordedChunksRef.current.length > 0) {
      const file = new File(recordedChunksRef.current, `record_${userId}.webm`);

      if (file.size > maxFileSize) {
        alertFeedback(
          'warning',
          `Exceed max file size ( > ${process.env.REACT_APP_MAX_FILE_SIZE})!`,
        );
        return;
      }

      uploadFile({
        variables: { file, file_size: file.size, file_type: 'video/webm' },
      });

      setRecorderStatus('ended');
    } else {
      refreshRecorder();
    }
  };

  const switchFacingMode = () => {
    setFacingMode((mode) => (mode === 'user') ? 'environment' : 'user');
  }

  if (recorderStatus === 'ended') {
    return null;
  }

  return (
    <div
      style={{
        position: 'fixed',
        width: '100vw',
        height: '100vh',
        transform: 'translate(-20px, -20px)',
        background: '#000',
      }}
    >
      <video height="100%" ref={videoRef} autoPlay muted style={{ transform: "translateX(-50%)", margin: "0 50%" }} />
      <div
        style={{
          position: 'absolute',
          top: 24,
          right: 24,
          display: 'flex',
          gap: 24,
          flexDirection: 'row',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <IconButton sx={{ backgroundColor: '#00000080' }}>
          <AccessTimeIcon sx={{ color: '#fff' }} />
        </IconButton>
        <IconButton sx={{ backgroundColor: '#00000080' }} onClick={switchFacingMode}>
          <FlipCameraIosOutlinedIcon sx={{ color: '#fff' }} />
        </IconButton>
      </div>
      <div
        style={{
          position: 'absolute',
          width: '100%',
          bottom: 24,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <RecorderControls
          onCancel={handleCancel}
          onSave={handleSave}
          recorderStatus={recorderStatus}
          color="#fff"
          startButton={
            <CustomIconButton sx={{ background: '#000' }} onClick={handleStart}>
              <PlayCircleIcon sx={{ fontSize: 96, color: '#fff' }} />
            </CustomIconButton>
          }
          pauseButton={
            <CustomIconButton sx={{ background: '#000' }} onClick={handlePause}>
              <StopCircleIcon sx={{ fontSize: 96, color: '#fff' }} />
            </CustomIconButton>
          }
          resumeButton={
            <CustomIconButton
              onClick={handleResume}
              sx={{ background: '#fff' }}
            >
              <CircleIcon sx={{ color: '#ff0000', fontSize: 44 }} />
            </CustomIconButton>
          }
        />
      </div>
    </div>
  );
}
