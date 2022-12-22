import React, { useState, useEffect } from "react";

import { Avatar } from "@mui/material";

function stringToColor(string: string) {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string) {
  const nameFactors = name.split(" ");
  const shrinkName =
    nameFactors.length > 1
      ? `${nameFactors[0][0]}${nameFactors[1][0]}`
      : `${nameFactors[0][0]}`;

  return {
    sx: {
      bgcolor: stringToColor(shrinkName),
      height: 34,
      width: 34,
      fontSize: 12,
      fontWeight: 700
    },
    children: shrinkName
  };
}

type CustomAvatarProps = {
  /**
   * This is user's name of avatar
   */
  username: string;
  /**
   * This is avatar url
   */
  url: string;
};

/**
 * Primary UI for Avatar, if you don't have avatar, then output Text Avatar
 */
export function CustomAvatar({ username, url }: CustomAvatarProps) {
  const [existImage, setExistImage] = useState<boolean>(false);

  useEffect(() => {
    let img = new Image();
    img.onload = function () {
      setExistImage(true);
    };
    img.onerror = function () {
      setExistImage(false);
    };
    img.src = url;
  }, [url]);

  return existImage ? (
    <Avatar alt={username} src={url} sx={{ width: 34, height: 34 }} />
  ) : (
    <Avatar {...stringAvatar(username)} />
  );
}
