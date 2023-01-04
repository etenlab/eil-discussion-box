import { useContext } from "react";

import { DiscussionContext, ContextType } from "../context";

export function useDiscussionContext(): ContextType {
  const context = useContext(DiscussionContext);

  if (context === undefined) {
    throw new Error("useDiscussionContext must be within DiscussionProvider");
  }

  return context;
}
