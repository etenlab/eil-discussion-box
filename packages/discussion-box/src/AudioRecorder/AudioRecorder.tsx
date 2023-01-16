import React, { useRef, useState, useEffect } from 'react';

import { Stack, Button } from '@mui/material';

import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import CircleIcon from '@mui/icons-material/Circle';

import { RecorderTimer } from '../common/RecorderTimer';
import { RecorderControls } from '../common/RecorderControls';

import { AudioElement, Wave } from '@foobar404/wave';
import { useDiscussionContext } from '../hooks/useDiscussionContext';
import { RecorderStatus } from '../utils/types';

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

export function AudioRecorder() {
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

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioElementRef = useRef<AudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const refreshRecorder = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];
    setRecorderStatus('new');
  };

  const initWave = () => {
    const canvasElement = canvasRef.current;
    const audioElement = audioElementRef.current;
    if (canvasElement === null || audioElement === null) {
      return;
    }

    const wave = new Wave(audioElement, canvasElement, true);
    wave.addAnimation(
      new wave.animations.Lines({
        count: 42,
        lineWidth: 5,
        rounded: true,
      }),
    );
  };

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
    initializeQuill
  ]);

  const handleStart = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false,
    });

    const options = { mimeType: 'audio/webm' };
    const mediaRecorder = new MediaRecorder(stream, options);

    mediaRecorder.addEventListener('dataavailable', function (e) {
      if (e.data.size > 0) recordedChunksRef.current.push(e.data);
    });

    mediaRecorder.addEventListener('stop', function () {
      stream.getTracks().forEach((track) => track.stop());
    });

    const context = new AudioContext();
    const source = context.createMediaStreamSource(stream);
    audioElementRef.current = {
      context,
      source,
    };

    initWave();

    mediaRecorder.start();
    mediaRecorderRef.current = mediaRecorder;
    setRecorderStatus('recording');
  };

  const handlePause = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alert('cannot pause because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.pause();
    setRecorderStatus('paused');
  };

  const handleResume = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alert('cannot resume because mediaRecorder not exist!');
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
      const file = new File(recordedChunksRef.current, `record_${userId}.wav`);

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

      setRecorderStatus('ended');
    } else {
      refreshRecorder();
    }
  };

  return (
    <Stack justifyContent="space-between" alignItems="center" gap="20px">
      <RecorderTimer recorderStatus={recorderStatus} />
      <canvas
        ref={canvasRef}
        width={1200}
        height={30}
        style={{ width: '100%', height: '30px' }}
      />
      <RecorderControls
        onCancel={handleCancel}
        onSave={handleSave}
        color="#000"
        recorderStatus={recorderStatus}
        startButton={
          <Button
            variant="contained"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
            color="gray"
            onClick={handleStart}
          >
            <MicNoneOutlinedIcon sx={{ fontSize: 44 }} />
          </Button>
        }
        pauseButton={
          <Button
            onClick={handlePause}
            variant="contained"
            color="gray"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
          >
            <PauseOutlinedIcon sx={{ fontSize: 44 }} />
          </Button>
        }
        resumeButton={
          <Button
            onClick={handleResume}
            variant="contained"
            color="gray"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
          >
            <CircleIcon sx={{ color: '#ff0000', fontSize: 44 }} />
          </Button>
        }
      />
    </Stack>
  );
}
