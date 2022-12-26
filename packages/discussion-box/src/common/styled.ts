import { styled } from "@mui/material/styles";

export const AddButtonWrapper = styled("span")({
  display: "inline-flex",
  border: "1px solid #000",
  borderRadius: "4px",
  padding: "4px",
  background: "#fff",
  color: "#000",
  "&: hover": {
    background: "#eee",
    borderColor: "#222",
  },
  "& svg": {
    fontSize: "16px",
  },
  fontFamily: "Inter",
  fontStyle: "normal",
  fontWeight: "600",
});
