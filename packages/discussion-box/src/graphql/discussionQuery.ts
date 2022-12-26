import { gql } from "@apollo/client";

export const typeDefs = gql`
  extend input NewDiscussionInput {
    app: Int
    org: Int
    row: Int!
    table_name: String!
  }

  extend input NewPostInput {
    discussion_id: Int!
    plain_text: String!
    postgres_language: String = "simple"
    quill_text: String!
    user_id: String!
  }

  input NewReactionInput {
    content: String!
    post_id: Int!
    user_id: String!
  }
`;

export const GET_DISCUSSIONS_BY_TABLE_NAME_AND_ROW = gql`
  query GetDiscussionByTableNameAndRow($table_name: String!, $row: Int!) {
    discussions(table_name: $table_name, row: $row) {
      id
      app
      org
      table_name
      row
      posts {
        id
        user_id
        discussion_id
        plain_text
        quill_text
        postgres_language
        created_at
        reactions {
          id
          user_id
          post_id
          content
        }
        files {
          id
          file {
            id
            file_name
            file_type
            file_size
            file_url
          }
        }
      }
    }
  }
`;

export const CREATE_DISCUSSION = gql`
  mutation CreateDiscussion($discussion: NewDiscussionInput!) {
    createDiscussion(newDiscussionData: $discussion) {
      id
      app
      org
      table_name
      row
      posts {
        id
        user_id
        discussion_id
        plain_text
        quill_text
        postgres_language
        created_at
        reactions {
          id
          user_id
          post_id
          content
        }
        files {
          id
          file {
            id
            file_name
            file_type
            file_size
            file_url
          }
        }
      }
    }
  }
`;

export const DELETE_DISCUSSION = gql`
  mutation DeleteDiscussion($id: Int!) {
    deleteDiscussion(id: $id)
  }
`;

export const GET_POSTS_BY_DISCUSSION_ID = gql`
  query GetPosts($discussionId: Int!) {
    postsByDiscussionId(discussionId: $discussionId) {
      id
      discussion_id
      user_id
      reactions {
        id
        user_id
        post_id
        content
      }
      files {
        id
        file {
          id
          file_name
          file_type
          file_size
          file_url
        }
      }
      quill_text
      plain_text
      postgres_language
      created_at
    }
  }
`;

export const CREATE_POST = gql`
  mutation CreatePost($post: NewPostInput!, $files: [Int]!) {
    createPost(newPostData: $post, files: $files) {
      id
      discussion_id
      user_id
      quill_text
      plain_text
      postgres_language
      reactions {
        id
        user_id
        post_id
        content
      }
      files {
        id
        file {
          id
          file_name
          file_type
          file_size
          file_url
        }
      }
      created_at
    }
  }
`;

export const UPDATE_POST = gql`
  mutation UpdatePost($post: NewPostInput!, $id: Int!) {
    updatePost(data: $post, id: $id) {
      id
      discussion_id
      user_id
      quill_text
      plain_text
      postgres_language
      reactions {
        id
        user_id
        post_id
        content
      }
      files {
        id
        file {
          id
          file_name
          file_type
          file_size
          file_url
        }
      }
      created_at
    }
  }
`;

export const DELETE_POST = gql`
  mutation DeletePost($id: Int!, $userId: Int!) {
    deletePost(id: $id, userId: $userId)
  }
`;

export const DELETE_POSTS_BY_DISCUSSION_ID = gql`
  mutation DeletePostsByDiscussionId($discussionId: Int!) {
    deletePostsByDiscussionId(discussionId: $discussionId)
  }
`;

export const GET_REACTION_BY_POST_ID = gql`
  query GetReactionsByPostId($postId: Int!) {
    reactionsByPostId(postId: $postId) {
      id
      post_id
      user_id
      content
    }
  }
`;

export const CREATE_REACTION = gql`
  mutation CreateReaction($reaction: NewReactionInput!) {
    createReaction(newReactionData: $reaction) {
      id
      post_id
      user_id
      content
    }
  }
`;

export const DELETE_REACTION = gql`
  mutation DeleteReaction($id: Int!, $userId: Int!) {
    deleteReaction(id: $id, userId: $userId)
  }
`;

export const CREATE_USER = gql`
  mutation CreateUser($email: String!) {
    createUser(email: $email) {
      user_id
    }
  }
`;
