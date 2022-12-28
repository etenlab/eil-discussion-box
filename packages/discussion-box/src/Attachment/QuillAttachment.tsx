import React, { ReactElement } from "react";

import { IconButton } from '@mui/material';
import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

import { QuillAttachmentContainer } from "./styled";
import { FileGeneral } from "./FileGeneral";
import { FileImage } from './FileImage';
import { FileVideo } from './FileVideo';
import { FileAudio } from './FileAudio';

import { IFile } from "../utils/types";
import { getMimeType } from "../utils/helpers";

type WrapperProps = {
  onCancel(): void;
  children: JSX.Element;
};

export function Wrapper({ onCancel, children }: WrapperProps) {
  return (
    <QuillAttachmentContainer>
      <IconButton
        onClick={onCancel}
        style={{
          position: "absolute",
          top: "-15px",
          right: "-15px",
          padding: 0,
          border: "none",
          background: "#000",
          color: "#fff",
        }}
      >
        <HighlightOffOutlinedIcon sx={{ fontSize: "25px", fontWeight: "bold" }} />
      </IconButton>
      {children}
    </QuillAttachmentContainer>
  );
}

type QuillAttachmentProps = {
  file: IFile;
  onCancel(): void;
};

export function QuillAttachment({ file, onCancel }: QuillAttachmentProps) {
  const mime = getMimeType(file.file_type);

  let content: ReactElement;

  switch (mime) {
    case "video": {
      content = <FileVideo src={file.file_url} file_type={file.file_type || ""} mode="quill" />;
      break;
    }
    case "audio": {
      content = <FileAudio src={file.file_url} file_type={file.file_type || ""} mode="quill" />;
      break;
    }
    case "image": {
      content = <FileImage src={file.file_url} file_name={file.file_name} mode="quill" />;
      break;
    }
    default: {
      content = <FileGeneral file={file} mode="quill" />;
      break;
    }
  }

  return (
    <Wrapper onCancel={onCancel}>
      {content}
    </Wrapper>
  )
}

