import { useContext } from "react";

import { DiscussionContext } from "../context";

export function useDiscussionContext() {
  const context = useContext(DiscussionContext);

  if (context === undefined) {
    throw new Error("useDiscussionContext must be within DiscussionProvider");
  }

  return context;
}
