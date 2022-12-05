import { styled } from "@mui/material/styles";

export const EmojiWrapper = styled("span")({
  padding: "0px 12px",
  border: "1px solid #fff",
  borderRadius: "12px",
  height: "24px",
  lineHeight: "27px",
  "&:hover": {
    borderColor: "#ccc",
  },
});

export const AddReactionIconButton = styled("span")({
  padding: "0px 12px",
  border: "1px solid #eee",
  borderRadius: "12px",
  background: "#eee",
  color: "#9d9d9d",
  height: "24px",
  lineHeight: "27px",
  "&: hover": {
    background: "#fff",
    borderColor: "#a9a9a9",
  },
  "& svg": {
    fontSize: "17px",
  },
});
