import React, { ReactElement } from "react";

import { IconButton, Stack } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { AttachmentContainer } from "./styled";
import { FileGeneral } from "./FileGeneral";
import { FileImage } from "./FileImage";
import { FileVideo } from "./FileVideo";
import { FileAudio } from "./FileAudio";

import { IFile } from "../utils/types";
import { getMimeType } from "../utils/helpers";

type WrapperProps = {
  onRemove(): void;
  children: JSX.Element;
};

export function Wrapper({ onRemove, children }: WrapperProps) {
  return (
    <Stack direction="row" alignItems="flex-start">
      <AttachmentContainer>{children}</AttachmentContainer>
      <IconButton onClick={onRemove}>
        <CloseIcon />
      </IconButton>
    </Stack>
  );
}

type AttachmentProps = {
  file: IFile;
  onRemove(): void;
};

export function Attachment({ file, onRemove }: AttachmentProps) {
  const mime = getMimeType(file.file_type);

  let content: ReactElement;
  switch (mime) {
    case "video": {
      content = (
        <FileVideo
          src={file.file_url}
          file_type={file.file_type || ""}
          mode="view"
        />
      );
      break;
    }
    case "audio": {
      content = (
        <FileAudio
          src={file.file_url}
          file_type={file.file_type || ""}
          mode="view"
        />
      );
      break;
    }
    case "image": {
      content = (
        <FileImage src={file.file_url} file_name={file.file_name} mode="view" />
      );
      break;
    }
    default: {
      content = <FileGeneral file={file} mode="view" />;
      break;
    }
  }

  return <Wrapper onRemove={onRemove}>{content}</Wrapper>;
}
