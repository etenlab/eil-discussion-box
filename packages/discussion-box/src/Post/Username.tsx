import React from "react";

import { Typography } from "@mui/material";

/**
 * Primary UI for username ex: '@username'
 */
export function Username({ username }: { username: string }) {
  const transformUsername = `@${username}`;

  return (
    <Typography
      variant="h3"
      component="h3"
      sx={{
        fontFamily: "Inter",
        fontStyle: "normal",
        fontWeight: 700,
        fontSize: "14px",
        lineHeight: "17px",
      }}
    >
      {transformUsername}
    </Typography>
  );
}
