import React, { useRef, useState, useEffect } from 'react';

import { Stack, Button, IconButton } from '@mui/material';

import MicNoneOutlinedIcon from '@mui/icons-material/MicNoneOutlined';
import PauseOutlinedIcon from '@mui/icons-material/PauseOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import CircleIcon from '@mui/icons-material/Circle';

import { AudioElement, Wave } from '@foobar404/wave';

const HOUR_TO_SECONDS = 60 * 60;
const MIN_TO_SECONDS = 60;

function fillZero(num: number): string {
  return num > 9 ? num + '' : '0' + num;
}

function TimeShower({ totalSeconds }: { totalSeconds: number }) {
  const hours = Math.floor(totalSeconds / HOUR_TO_SECONDS);
  const mins = Math.floor((totalSeconds - hours * HOUR_TO_SECONDS) / MIN_TO_SECONDS);
  const seconds =
    totalSeconds - hours * HOUR_TO_SECONDS - mins * MIN_TO_SECONDS;

  return (
    <span
      style={{
        fontFamily: 'Inter',
        fontStyle: 'normal',
        fontWeight: 700,
        fontSize: '28px',
        lineHeight: '34px',
      }}
    >
      {`${fillZero(hours)} : ${fillZero(mins)} : ${fillZero(seconds)}`}
    </span>
  );
}

function RecorderTimer({
  recorderState,
}: {
  recorderState: 'new' | 'paused' | 'recording';
}) {
  const [time, setTime] = useState<number>(0);
  const timerRef = useRef<NodeJS.Timer | null>(null);

  useEffect(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }

    switch (recorderState) {
      case 'new': {
        setTime(0);
        break;
      }
      case 'recording': {
        timerRef.current = setInterval(() => {
          setTime((time) => time + 1);
        }, 1000);
        break;
      }
      case 'paused': {
        break;
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [recorderState]);

  return <TimeShower totalSeconds={time} />;
}

type RecorderControlsProps = {
  onCancel(): void;
  onSave(): void;
  recorderState: 'new' | 'paused' | 'recording';
  startButton: JSX.Element;
  pauseButton: JSX.Element;
  resumeButton: JSX.Element;
};

function RecorderControls({
  onCancel,
  onSave,
  recorderState,
  startButton,
  pauseButton,
  resumeButton,
}: RecorderControlsProps) {
  let mainButton;

  switch (recorderState) {
    case 'new': {
      mainButton = startButton;
      break;
    }
    case 'paused': {
      mainButton = resumeButton;
      break;
    }
    case 'recording': {
      mainButton = pauseButton;
      break;
    }
  }

  const disabled = recorderState === 'new';

  return (
    <Stack direction="row" alignItems="center" gap="30px">
      <IconButton onClick={onCancel} disabled={disabled}>
        <CloseOutlinedIcon
          sx={{ fontSize: 24, color: '#000', fontWeight: 700 }}
        />
      </IconButton>
      {mainButton}
      <IconButton onClick={onSave} disabled={disabled}>
        <CheckOutlinedIcon
          sx={{ fontSize: 24, color: '#000', fontWeight: 700 }}
        />
      </IconButton>
    </Stack>
  );
}

type AudioRecorderProps = {
  onSavedFile(file: File): void;
};

export function AudioRecorder({ onSavedFile }: AudioRecorderProps) {
  const [recorderState, setRecorderState] = useState<
    'new' | 'paused' | 'recording'
  >('new');

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioElementRef = useRef<AudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const recordedChunksRef = useRef<Blob[]>([]);

  const refreshRecorder = () => {
    mediaRecorderRef.current?.stop();
    mediaRecorderRef.current = null;
    recordedChunksRef.current = [];
    setRecorderState('new');
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
    setRecorderState('recording');
  };

  const handlePause = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alert('cannot pause because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.pause();
    setRecorderState('paused');
  };

  const handleResume = () => {
    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder === null) {
      alert('cannot resume because mediaRecorder not exist!');
      return;
    }

    mediaRecorder.resume();
    setRecorderState('recording');
  };

  const handleCancel = () => {
    refreshRecorder();
  };

  const handleSave = () => {
    if (recordedChunksRef.current.length > 0) {
      onSavedFile(new File(recordedChunksRef.current, 'record.wav'));
    }

    refreshRecorder();
  };

  return (
    <Stack justifyContent="space-between" alignItems="center" gap="20px">
      <RecorderTimer recorderState={recorderState} />
      <canvas
        ref={canvasRef}
        width={1200}
        height={30}
        style={{ width: '100%', height: '30px' }}
      />
      <RecorderControls
        onCancel={handleCancel}
        onSave={handleSave}
        recorderState={recorderState}
        startButton={
          <Button
            variant="contained"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
            onClick={handleStart}
          >
            <MicNoneOutlinedIcon sx={{ fontSize: 44 }} />
          </Button>
        }
        pauseButton={
          <Button
            onClick={handlePause}
            variant="contained"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
          >
            <PauseOutlinedIcon sx={{ fontSize: 44 }} />
          </Button>
        }
        resumeButton={
          <Button
            onClick={handleResume}
            variant="contained"
            sx={{ width: 80, height: 80, boxShadow: 'none' }}
          >
            <CircleIcon sx={{ color: '#ff0000', fontSize: 44 }} />
          </Button>
        }
      />
    </Stack>
  );
}
