import React from "react";

import { Stack } from "@mui/material";

import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

import { CustomAvatar as Avatar } from "./Avatar";
import { Username } from "./Username";
import { ReplyText } from "./styled";

type PostReplyProps = {
  url: string;
  username: string;
  plainText: string;
  files: [
    {
      id: number;
    }
  ];
  edited: boolean;
};

export function PostReply({
  url,
  username,
  plainText,
  files,
  edited,
}: PostReplyProps) {
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
      <Avatar username={username} url={url} mini={true} />
      <Username username={username} />
      <ReplyText>{plainText}</ReplyText>
      {edited ? <span style={{ fontSize: '12px' }}>(edited)</span> : null}
      {files.length > 0 ? <CollectionsOutlinedIcon /> : null}
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
