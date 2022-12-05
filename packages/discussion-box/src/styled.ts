import { styled } from "@mui/material/styles";

export const QuillContainer = styled("div")({
  width: "100%",
  background: "#fff",
});

export const DiscussionHeader = styled("h3")({
  width: "100%",
  margin: 0,
  padding: "16px",
  borderBottom: "1px solid #888",
  background: "#fff",
});

export const DiscussionContainer = styled("div")({
  display: "flex",
  flexGrow: 1,
  flexDirection: "column",
  paddingTop: "30px",
  overflowY: "auto",
});
