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
    color += `${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
}

function stringAvatar(name: string, mini: boolean) {
  const nameFactors = name.split(" ");
  const shrinkName =
    nameFactors.length > 1
      ? `${nameFactors[0][0]}${nameFactors[1][0]}`.toUpperCase()
      : nameFactors[0].length > 0
        ? `${nameFactors[0][0]}${nameFactors[0][1]}`.toUpperCase()
        : `${nameFactors[0][0]}`.toUpperCase();

  const size = mini
    ? {
      width: 25,
      height: 25,
      fontSize: 9,
      fontWeight: 700,
    }
    : {
      width: 34,
      height: 34,
      fontSize: 12,
      fontWeight: 700,
    };

  return {
    sx: {
      bgcolor: stringToColor(name),
      ...size,
    },
    children: <p style={{ textShadow: "1px 1px 2px #000" }}>{shrinkName}</p>,
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
  mini: boolean;
};

/**
 * Primary UI for Avatar, if you don't have avatar, then output Text Avatar
 */
export function CustomAvatar({
  username,
  url,
  mini = false,
}: CustomAvatarProps) {
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

  const sxObj = mini ? { width: 25, height: 25 } : { width: 34, height: 34 };

  return existImage ? (
    <Avatar alt={username} src={url} sx={sxObj} />
  ) : (
    <Avatar {...stringAvatar(username, mini)} />
  );
}
