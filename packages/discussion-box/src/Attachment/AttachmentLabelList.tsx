import React from "react";

import { Stack } from "@mui/material";

import { AttachmentLabel } from "./AttachmentLabel";
import { IFileDB } from "../utils/types";

type AttachmentLabelListProps = {
  attachments: IFileDB[];
  onCancel: (id: number) => void;
};

export function AttachmentLabelList({
  attachments,
  onCancel,
}: AttachmentLabelListProps) {
  return (
    <Stack gap={2} sx={{ display: "inline-flex" }}>
      {attachments.map((attachment, index) => (
        <AttachmentLabel
          key={attachment.id}
          file={attachment}
          onCancel={() => {
            onCancel(attachment.id);
          }}
        />
      ))}
    </Stack>
  );
}
