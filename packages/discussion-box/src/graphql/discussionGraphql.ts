import { ApolloClient, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";

import { typeDefs } from "./discussionQuery";

export const discussionClient = new ApolloClient({
  link: createUploadLink({
    uri: process.env.REACT_APP_DISCUSSION_API,
  }),
  cache: new InMemoryCache(),

  // Provide some optional constructor fields
  name: "react-web-client",
  version: "1.3",
  queryDeduplication: false,
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
  typeDefs,
});
