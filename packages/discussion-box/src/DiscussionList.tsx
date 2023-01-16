import React, { Fragment, useEffect } from "react";
import { useHistory } from "react-router-dom";

import {
  Backdrop,
  Stack,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";

import { useLazyQuery } from "@apollo/client";

import { discussionClient } from "./graphql/discussionGraphql";
import { GET_DISCUSSIONS_SUMMARY_BY_USER_ID } from "./graphql/discussionQuery";
import { withUserId } from "./withUserId";

export function DiscussionListPure({ userId }: { userId: number }) {
  const history = useHistory();

  const [
    getDiscussionsSummaryByUserId,
    { called, loading, error, data },
  ] = useLazyQuery(GET_DISCUSSIONS_SUMMARY_BY_USER_ID, {
    fetchPolicy: "no-cache",
    client: discussionClient,
  });

  useEffect(() => {
    if (userId) {
      getDiscussionsSummaryByUserId({
        variables: {
          userId,
        },
      });
    }
  }, [userId, getDiscussionsSummaryByUserId]);

  if (error) {
    <Snackbar
      open
      autoHideDuration={2000}
      anchorOrigin={{
        vertical: "bottom",
        horizontal: "right",
      }}
      key="bottom-right"
    >
      <Alert variant="filled" severity="error" sx={{ width: "100%" }}>
        Network Issue
      </Alert>
    </Snackbar>;
  }

  if (called && loading) {
    return (
      <Backdrop sx={{ color: "#fff", zIndex: 1000 }} open={loading}>
        <Stack justifyContent="center">
          <div style={{ margin: "auto" }}>
            <CircularProgress color="inherit" />
          </div>
          <div>LOADING</div>
        </Stack>
      </Backdrop>
    );
  }

  if (data === undefined) {
    return <div>No Discussions...</div>;
  }

  return (
    <List>
      {data.getDiscussionsSummaryByUserId.map(
        ({
          id,
          table_name,
          row,
          total_posts,
        }: {
          id: number;
          table_name: string;
          row: number;
          total_posts: number;
        }) => (
          <Fragment key={id}>
            <ListItem
              disablePadding
              onClick={() => {
                history.push({
                  pathname: `/translation-app/discussion/${table_name}/${row}`,
                });
              }}
            >
              <ListItemText
                primary={`${table_name} #${row}`}
                secondary={`Total discussions: ${total_posts}`}
              />
            </ListItem>
            <Divider />
          </Fragment>
        )
      )}
    </List>
  );
}

export const DiscussionList = withUserId(DiscussionListPure);
