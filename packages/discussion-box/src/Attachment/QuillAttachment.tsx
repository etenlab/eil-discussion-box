import React, { ReactElement } from "react";

import CloseIcon from "@mui/icons-material/Close";

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
      <button
        onClick={onCancel}
        style={{
          position: "absolute",
          top: "-15px",
          borderRadius: "50%",
          padding: "2px 3px",
          right: "-15px",
          width: "25px",
          height: "25px",
          background: "#000",
          color: "#fff",
        }}
      >
        <CloseIcon sx={{ fontSize: "17px", fontWeight: "bold" }} />
      </button>
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

