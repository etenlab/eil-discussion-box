import React from "react";

export function FileImage({
  src,
  file_name,
  mode,
}: {
  src: string;
  file_name: string;
  mode: "view" | "quill";
}) {
  const attr =
    mode === "quill"
      ? { width: "70px", height: "70px" }
      : {
        width: "100%",
        height: "100%",
      };
  return <img src={src} {...attr} loading="lazy" alt={file_name} />;
}
