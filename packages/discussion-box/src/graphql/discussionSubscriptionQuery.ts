import { gql } from "@apollo/client";

export const DISCUSSION_CREAETD_SUBSCRIPTION = gql`
  subscription OnDiscussionCreated($table_name: String!, $row: Int!) {
    discussionCreated(table_name: $table_name, row: $row) {
      id
      app
      org
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

export const POST_CREATED_SUBSCRIPTION = gql`
  subscription OnPostCreated($discussionId: Int!) {
    postCreated(discussionId: $discussionId) {
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

export const POST_UPDATED_SUBSCRIPTION = gql`
  subscription OnPostUpdate($discussionId: Int!) {
    postUpdated(discussionId: $discussionId) {
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

export const POST_DELETED_SUBSCRIPTION = gql`
  subscription OnPostDeleted($discussionId: Int!) {
    postDeleted(discussionId: $discussionId)
  }
`;

export const REACTION_CREATED_SUBSCRIPTION = gql`
  subscription OnReactionCreated($discussionId: Int!) {
    reactionCreated(discussionId: $discussionId) {
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

export const REACTION_DELETED_SUBSCRIPTION = gql`
  subscription OnReactionDeleted($discussionId: Int!) {
    reactionDeleted(discussionId: $discussionId)
  }
`;
