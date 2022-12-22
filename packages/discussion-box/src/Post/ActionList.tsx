import React, { ReactNode } from "react";

import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";

interface Actions {
  /**
   * Action name ex: Edit, Delete
   */
  name: string;
  /**
   * Event Handler
   */
  action(): void;
  /**
   * Icon Element
   */
  icon: ReactNode;
}

type ActionListProps = {
  /**
   * Actions should render at this component
   */
  actions: Actions[];
};

/**
 * Primary UI for Actions of Post (Edit, Delete, Reply)
 */
export function ActionList({ actions }: ActionListProps) {
  return (
    <List dense sx={{ width: "100%", maxWidth: 160, bgColor: "#eee" }}>
      {actions.map(({ name, action, icon }) => {
        return (
          <ListItem key={name} secondaryAction={icon} disablePadding>
            <ListItemButton onClick={action}>
              <ListItemText primary={name} />
            </ListItemButton>
          </ListItem>
        );
      })}
    </List>
  );
}
