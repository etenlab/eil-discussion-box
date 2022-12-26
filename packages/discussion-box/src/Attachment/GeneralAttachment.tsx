import React from "react";

import { Stack, IconButton } from "@mui/material";

import FilePresentOutlinedIcon from "@mui/icons-material/FilePresentOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

import { IFile } from "../utils/types";
import { FileName } from "./styled";
import { FileSize } from "../common/FileSize";

const handleDownload = (file_name: string, file_url: string) => {
  let hiddenElement = document.createElement("a");
  hiddenElement.href = encodeURI(file_url);
  hiddenElement.download = file_name;
  hiddenElement.click();
};

export function AttachmentGeneral({ file }: { file: IFile }) {
  return (
    <Stack direction="row" alignItems="center" sx={{ padding: "10px" }}>
      <FilePresentOutlinedIcon sx={{ fontSize: "70px", margin: "-10px" }} />
      <Stack alignItems="flex-start">
        <FileName>{file.file_name}</FileName>
        <FileSize fileSize={file.file_size} />
      </Stack>
      <IconButton
        onClick={() => {
          handleDownload(file.file_name, file.file_url);
        }}
      >
        <FileDownloadOutlinedIcon sx={{ fontSize: "30px" }} />
      </IconButton>
    </Stack>
  );
}
