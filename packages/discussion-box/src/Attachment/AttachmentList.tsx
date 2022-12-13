import React from "react";

import { Stack } from "@mui/material";

import { Attachment } from "./Attachment";
import { IFileDB } from "../utils/types";

type AttachmentListProps = {
  files: IFileDB[];
};

export function AttachmentList({ files }: AttachmentListProps) {
  return (
    <Stack gap={2}>
      {files.map((file) => (
        <Attachment key={file.id} file={file} />
      ))}
    </Stack>
  );
}
