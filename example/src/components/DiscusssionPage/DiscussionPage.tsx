import React, { useState } from "react";
import { useHistory, useParams } from "react-router";

import { Stack, Button } from "@mui/material";

import {
  Discussion,
  DiscussionHeader,
  MockLoginForm,
  DiscussionRouteQuizParams,
} from "@eten-lab/discussion-box";

function existsAll(
  userId: number | null,
  tableName: string | null,
  rowId: number | null
) {
  if (userId !== null && tableName !== null && rowId !== null) {
    return true;
  }
  return false;
}

/**
 * This component will mount once users route to '/tab1/discussion/:table_name/:row'.
 * The responsibility is to control Discussion Page and interact with server such as fetching, saving, deleting discussion data.
 */
export function DiscussionPage() {
  const history = useHistory();
  const { table_name, row } = useParams<DiscussionRouteQuizParams>();

  const [mockUserId, setMockUserId] = useState<number | null>(null);

  const tableName = table_name || null;
  const rowId = (row && row.length > 0) ? +row : null;

  return (
    <>
      <Stack
        justifyContent="space-between"
        sx={{ height: "calc(100vh - 75px)", padding: "0px 20px" }}
      >
        <DiscussionHeader>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <span>Discussion</span>
            <Stack direction="row" alignItems="center" spacing={2}>
              <Button
                onClick={() => {
                  history.goBack();
                }}
              >
                Go Back
              </Button>
            </Stack>
          </Stack>
        </DiscussionHeader>

        <MockLoginForm
          mockUserId={mockUserId}
          setMockUserId={(userId: number) => setMockUserId(userId)}
        />

        {existsAll(mockUserId, tableName, rowId) && (
          <Discussion userId={mockUserId!} tableName={tableName!} rowId={rowId!} />
        )}
      </Stack>
    </>
  );
}
