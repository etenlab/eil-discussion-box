import React from "react";

export function FileVideo({
  src,
  file_type,
  mode,
}: {
  src: string;
  file_type: string;
  mode: "view" | "quill";
}) {
  const attr =
    mode === "quill"
      ? { width: "70px", height: "70px" }
      : {
        width: "100%",
        height: "100%",
      };
  return (
    <video {...attr} controls>
      <source src={src} type={file_type} />
      Your browser does not support HTML video.
    </video>
  );
}
