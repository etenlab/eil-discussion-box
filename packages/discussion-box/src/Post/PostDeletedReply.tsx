import React from "react";

import { Stack, Avatar } from "@mui/material";

import ReplyOutlinedIcon from "@mui/icons-material/ReplyOutlined";

export function PostDeletedReply() {
  return (
    <Stack
      direction="row"
      gap="10px"
      justifyContent="flex-start"
      alignItems="center"
      sx={{
        position: "relative",
        top: "10px",
        paddingLeft: "45px",
      }}
    >
      <Avatar sx={{ bgcolor: "#000", color: "#fff", height: 25, width: 25 }}>
        <ReplyOutlinedIcon sx={{ fontSize: "17px" }} />
      </Avatar>
      <i>Original message was deleted.</i>
      <svg
        height="30px"
        width="50px"
        style={{ position: "absolute", top: "10px", left: "16px" }}
      >
        <path d="M 0 5 l 0 10" stroke="#2f2f2f" strokeWidth="1" fill="none" />
        <path d="M 5 0 l 22 0" stroke="#2f2f2f" strokeWidth="1" fill="none" />
        <path
          d="M 0 5 q 0 -5 5 -5"
          stroke="#2f2f2f"
          strokeWidth="1"
          fill="none"
        />
      </svg>
    </Stack>
  );
}
