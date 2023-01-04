import React from "react";

import { Stack } from "@mui/material";

import { Attachment } from "./Attachment";
import { IFile, IPost } from "../utils/types";
import { useDiscussionContext } from "../hooks/useDiscussionContext";

type RelationshipFile = {
  id: number;
  file: IFile;
};

type AttachmentListProps = {
  files: RelationshipFile[];
  post: IPost;
};

export function AttachmentList({ files, post }: AttachmentListProps) {
  const {
    states: {
      global: { userId },
    },
    actions: { deleteAttachment, alertFeedback },
  } = useDiscussionContext();

  const removeAttachmentById = (id: number) => {
    if (post.user_id !== userId) {
      alertFeedback("warning", "You are not owner of this post");
      return;
    }
    if (
      post.quill_text === "" &&
      post.plain_text === "" &&
      post.files.length === 1
    ) {
      const result = window.confirm("Are you sure to delete this post?");
      if (!result) {
        return;
      }
    }

    deleteAttachment({
      variables: {
        attachmentId: id,
        post_id: post.id,
      },
    });
  };

  return (
    <Stack gap={2}>
      {files.map((file) => (
        <Attachment
          key={file.id}
          file={file.file}
          onRemove={() => {
            removeAttachmentById(file.id);
          }}
        />
      ))}
    </Stack>
  );
}
