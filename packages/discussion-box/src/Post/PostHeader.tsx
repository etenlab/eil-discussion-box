import React, { MouseEvent } from "react";
import { Stack, IconButton } from "@mui/material";

import FiberManualRecordIcon from "@mui/icons-material/FiberManualRecord";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { CustomAvatar as Avatar } from "./Avatar";
import { Username } from "./Username";
import { DateViewer } from "./DateViewer";

type PostHeaderProps = {
  username: string;
  avatar: string;
  date: Date;
  openActionList(event: MouseEvent<HTMLElement>): void;
};

export function PostHeader({
  username,
  avatar = "",
  date,
  openActionList,
}: PostHeaderProps) {
  return (
    <Stack direction="row" justifyContent="space-between">
      <Stack direction="row" gap="10px" alignItems="center">
        <Avatar username={username} url={avatar} />
        <Username username={username} />
        <FiberManualRecordIcon sx={{ fontSize: "4px" }} />
        <DateViewer date={date} />
      </Stack>
      <IconButton onClick={openActionList}>
        <MoreHorizIcon />
      </IconButton>
    </Stack>
  );
}
