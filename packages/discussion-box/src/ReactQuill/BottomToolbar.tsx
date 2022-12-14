import React, { ChangeEventHandler, useEffect } from "react";

import { Stack, IconButton } from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import AddIcon from "@mui/icons-material/Add";

import { useMutation } from "@apollo/client";
import { client } from "../graphql/fileGraphql";
import { UPLOAD_FILE } from "../graphql/fileQuery";

import { IFileDB, UploadedFile } from "../utils/types";

type BottomToolbarType = {
  onSend: () => void;
  onAddAttachment: (file: IFileDB) => void;
};

export function BottomToolbar({ onSend, onAddAttachment }: BottomToolbarType) {
  const [uploadFile, { data, loading, error }] = useMutation<UploadedFile>(
    UPLOAD_FILE,
    {
      client,
    }
  );

  // Upload is successful then trigger onAddAttachment
  useEffect(() => {
    if (!!data && !error && !loading) {
      onAddAttachment(data.uploadFile);
    }
  }, [data, error, loading]);

  // Get a file then upload
  const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    const files = event.target.files;

    if (files && files.length > 0) {
      uploadFile({ variables: { file: files[0] } });
    }
  };

  const disabled = loading;

  return (
    <Stack
      direction="row"
      justifyContent="space-between"
      sx={{
        border: "1px solid #CCCCCA",
        borderTop: "none",
        padding: "4px",
      }}
    >
      <IconButton color="primary" component="label" disabled={disabled}>
        <input
          hidden
          type="file"
          onChange={handleFileChange}
          disabled={disabled}
        />
        <AddIcon />
      </IconButton>
      <IconButton onClick={onSend} color="success">
        <SendIcon />
      </IconButton>
    </Stack>
  );
}
