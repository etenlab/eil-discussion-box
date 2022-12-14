import React from "react";

import { Stack } from "@mui/material";

import { AttachmentLabel } from "./AttachmentLabel";
import { IFileDB } from "../utils/types";

type AttachmentLabelListProps = {
  attachments: IFileDB[];
  onCancel: (attachment: IFileDB) => void;
};

export function AttachmentLabelList({
  attachments,
  onCancel,
}: AttachmentLabelListProps) {
  return (
    <Stack gap={2} direction="row" sx={{ display: "inline-flex" }}>
      {attachments.map((attachment) => (
        <AttachmentLabel
          key={attachment.id}
          file={attachment}
          onCancel={() => {
            onCancel(attachment);
          }}
        />
      ))}
    </Stack>
  );
}
