import { styled } from "@mui/material/styles";

export const AttachmentContainer = styled("div")({
  display: "flex",
  alignItems: "flex-start",
  margin: 0,
  border: "1px solid #000",
  borderRadius: "8px",
  padding: 0,
  maxHeight: "300px",
  maxWidth: "300px",
  "& img, & audio, & video": {
    borderRadius: "8px",
  },
});

export const QuillAttachmentContainer = styled("div")({
  position: "relative",
  borderRadius: "8px",
  border: "1px solid #000",
  "& img, & audio, & video": {
    borderRadius: "8px",
  },
});

export const FileName = styled("h3")({
  display: "block",
  fontFamily: "Infer",
  fontWeight: 300,
  fontSize: "17px",
  margin: 0,
  padding: "4px",
});
