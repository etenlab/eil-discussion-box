import React from "react";

export function FileAudio({
  src,
  file_type,
  mode,
}: {
  src: string;
  file_type: string;
  mode: "view" | "quill";
}) {
  return (
    <audio controls>
      <source src={src} type={file_type} />
      Your browser does not support the audio element.
    </audio>
  );
}
