import React, { useState } from "react";

import { Modal, styled, Box } from "@mui/material";

const style = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "auto",
  height: "70%",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const DownloadText = styled("span")({
  display: "block",
  color: "#0069B9",
  textDecoration: "underline",
  cursor: "pointer",
});

const handleDownload = (file_name: string, file_url: string) => {
  let hiddenElement = document.createElement("a");
  hiddenElement.href = encodeURI(file_url);
  hiddenElement.download = file_name;
  hiddenElement.click();
};

export function FileImage({
  src,
  file_name,
  mode,
}: {
  src: string;
  file_name: string;
  mode: "view" | "quill";
}) {
  const [open, setOpen] = useState<boolean>(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const attr =
    mode === "quill"
      ? { width: "70px", height: "70px" }
      : {
        width: "100%",
        height: "100%",
        style: {
          cursor: "zoom-in",
        },
      };

  return (
    <>
      <img
        src={src}
        {...attr}
        loading="lazy"
        alt={file_name}
        onClick={handleOpen}
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={src} height="100%" loading="lazy" alt="fee" />
          <DownloadText
            onClick={() => {
              handleDownload(file_name, src);
            }}
          >
            Click And Download
          </DownloadText>
        </Box>
      </Modal>
    </>
  );
}
