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

type FileGeneralProps = {
  file: IFile;
  mode: "quill" | "view";
};

export function FileGeneral({ file, mode }: FileGeneralProps) {
  return (
    <Stack direction="row" alignItems="center" sx={{ padding: "10px" }}>
      <FilePresentOutlinedIcon sx={{ fontSize: "70px", margin: "-10px" }} />
      <Stack alignItems="flex-start">
        <FileName>{file.file_name}</FileName>
        <FileSize fileSize={file.file_size} />
      </Stack>
      {mode === "view" ? (
        <IconButton
          onClick={() => {
            handleDownload(file.file_name, file.file_url);
          }}
        >
          <FileDownloadOutlinedIcon sx={{ fontSize: "30px", color: "#000" }} />
        </IconButton>
      ) : null}
    </Stack>
  );
}
