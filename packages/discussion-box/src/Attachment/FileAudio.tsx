import React, { useRef, useEffect } from 'react';
import { Stack } from '@mui/material';

import { Wave } from '@foobar404/wave';

export function FileAudio({
  src,
  file_type,
  mode,
}: {
  src: string;
  file_type: string;
  mode: 'view' | 'quill';
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const audioElement = audioRef.current;

    if (canvasElement === null || audioElement === null) {
      return;
    }

    audioElement.addEventListener('play', () => {
      canvasElement.style.display = 'inherit';
    });

    audioElement.addEventListener('pause', () => {
      canvasElement.style.display = 'none';
    });
  }, []);

  useEffect(() => {
    const canvasElement = canvasRef.current;
    const audioElement = audioRef.current;

    if (canvasElement === null || audioElement === null) {
      return;
    }

    const wave = new Wave(audioElement, canvasElement);
    wave.addAnimation(
      new wave.animations.Lines({
        count: 30,
        lineWidth: 5,
        rounded: true,
      }),
    );
  }, []);

  return (
    <Stack>
      <canvas
        ref={canvasRef}
        width={300}
        height={30}
        style={{ width: '95%', height: '30px', display: 'none' }}
      />
      <audio
        ref={audioRef}
        controls
        style={{ maxWidth: 290 }}
        crossOrigin="*"
      >
        <source src={src} type={file_type} />
        Your browser does not support the audio element.
        {mode}
      </audio>
    </Stack>
  );
}
