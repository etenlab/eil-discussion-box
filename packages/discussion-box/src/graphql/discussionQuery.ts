import { gql } from '@apollo/client';

export const typeDefs = gql`
  extend input DiscussionInput {
    app_id: Int!
    org_id: Int!
    row: Int!
    table_name: String!
  }

  extend input NewPostInput {
    discussion_id: Int!
    plain_text: String!
    postgres_language: String = "simple"
    quill_text: String!
    user_id: String!
    reply_id: Int!
  }

  input NewReactionInput {
    content: String!
    post_id: Int!
    user_id: String!
  }
`;

export const GET_DISCUSSIONS = gql`
  query GetDiscussions(
    $app_id: Int!
    $org_id: Int!
    $row: Int!
    $table_name: String!
  ) {
    discussions(
      app_id: $app_id
      org_id: $org_id
      row: $row
      table_name: $table_name
    ) {
      id
      appList {
        id
        app_name
      }
      organization {
        id
        name
      }
      table_name
      row
      posts {
        id
        user_id
        user {
          user_id
          active
          email
          username
          is_email_verified
          created_at
        }
        discussion_id
        plain_text
        quill_text
        postgres_language
        is_edited
        reply_id
        reply {
          is_edited
          user {
            username
          }
          plain_text
          files {
            id
          }
        }
        created_at
        reactions {
          id
          user_id
          user {
            user_id
            active
            email
            username
            is_email_verified
            created_at
          }
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
  mutation CreateDiscussion($discussion: DiscussionInput!) {
    createDiscussion(newDiscussionData: $discussion) {
      id
      appList {
        id
        app_name
      }
      organization {
        id
        name
      }
      table_name
      row
      posts {
        id
        user_id
        user {
          user_id
          active
          email
          username
          is_email_verified
          created_at
        }
        discussion_id
        plain_text
        quill_text
        postgres_language
        is_edited
        reply_id
        reply {
          is_edited
          user {
            username
          }
          plain_text
          files {
            id
          }
        }
        created_at
        reactions {
          id
          user_id
          user {
            user_id
            active
            email
            username
            is_email_verified
            created_at
          }
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
      user {
        user_id
        active
        email
        username
        is_email_verified
        created_at
      }
      reactions {
        id
        user_id
        user {
          user_id
          active
          email
          username
          is_email_verified
          created_at
        }
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
      is_edited
      reply_id
      reply {
        is_edited
        user {
          username
        }
        plain_text
        files {
          id
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
      user {
        user_id
        active
        email
        username
        is_email_verified
        created_at
      }
      quill_text
      plain_text
      postgres_language
      is_edited
      reply_id
      reply {
        is_edited
        user {
          username
        }
        plain_text
        files {
          id
        }
      }
      reactions {
        id
        user_id
        user {
          user_id
          active
          email
          username
          is_email_verified
          created_at
        }
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
      user {
        user_id
        active
        email
        username
        is_email_verified
        created_at
      }
      quill_text
      plain_text
      postgres_language
      is_edited
      reply_id
      reply {
        is_edited
        user {
          username
        }
        plain_text
        files {
          id
        }
      }
      reactions {
        id
        user_id
        user {
          user_id
          active
          email
          username
          is_email_verified
          created_at
        }
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

export const DELETE_ATTACHMENT = gql`
  mutation DeleteAttachment($attachmentId: Int!, $post_id: Int!) {
    deleteAttachment(attachmentId: $attachmentId, post_id: $post_id)
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
      user {
        user_id
        active
        email
        username
        is_email_verified
        created_at
      }
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
      user {
        user_id
        active
        email
        username
        is_email_verified
        created_at
      }
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
  mutation CreateUser($email: String!, $username: String!) {
    createUser(email: $email, username: $username) {
      user_id
    }
  }
`;

export const GET_APP_ID = gql`
  query GetApp($app_name: String!) {
    getApp(app_name: $app_name) {
      id
      app_name
    }
  }
`;

export const GET_ORG_ID = gql`
  query GetOrg($name: String!) {
    getOrg(name: $name) {
      id
      name
    }
  }
`;

export const GET_USER_ID_FROM_EMAIL = gql`
  query GetUserIdFromEmail($email: String!) {
    getUserIdFromEmail(email: $email) {
      user_id
    }
  }
`;

export const GET_USER_ID_FROM_NAME = gql`
  query GetUserIdFromName($name: String!) {
    getUserIdFromName(name: $name) {
      user_id
    }
  }
`;

export const GET_DISCUSSIONS_SUMMARY_BY_USER_ID = gql`
  query GetDiscussionsSummaryByUserId($userId: Int!) {
    getDiscussionsSummaryByUserId(userId: $userId) {
      id
      table_name
      row
      total_posts
    }
  }
`;
