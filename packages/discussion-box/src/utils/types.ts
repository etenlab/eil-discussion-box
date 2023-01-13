export type ActionType<T> = {
  type: string;
  payload: T;
};

export interface IUser {
  user_id: number;
  active: boolean;
  email: string;
  username: string;
  is_email_verified: boolean;
  created_at: Date;
}

export interface IReaction {
  id: number;
  post_id: number;
  user_id: number;
  user: IUser;
  content: string;
}

export interface IFile {
  id: number;
  file_name: string;
  file_type: string | null;
  file_size: number;
  file_url: string;
}

export interface IRelationshipPostFile {
  id: number;
  file: IFile;
}

export interface IPost {
  id: number;
  user_id: number;
  user: IUser;
  discussion_id: number;
  quill_text: string;
  plain_text: string;
  postgres_language: string;
  files: IRelationshipPostFile[];
  reactions: IReaction[];
  is_edited: boolean;
  reply_id?: number;
  reply?: {
    is_edited: boolean;
    user: {
      username: string;
    };
    plain_text: string;
    files: [
      {
        id: number;
      },
    ];
  };
  created_at: Date;
}

export interface IDiscussion {
  id: number;
  app?: number;
  org?: number;
  table_name: string;
  row: number;
  posts: IPost[];
}

export type DiscussionRouteQuizParams = {
  table_name?: string;
  row?: string;
};

export interface SnackbarState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface EmojiPopoverState {
  anchorEl: Element | null;
  post: IPost | null;
  mode: 'quill' | 'react' | null;
}

export interface DiscussionCreatedData {
  discussionCreated: IDiscussion;
}

export interface PostCreatedData {
  postCreated: IPost;
}

export interface PostUpdatedData {
  postUpdated: IPost;
}

export interface PostDeletedData {
  postDeleted: number;
}

export interface ReactionCreatedData {
  reactionCreated: IReaction;
}

export interface ReactionDeletedData {
  reactionDeleted: number;
}

export interface UploadedFile {
  uploadFile: IFile;
}

export const FileMimeTypes = {
  Video: 'video',
  Audio: 'audio',
  Image: 'image',
};

export type FeedbackType = 'success' | 'error' | 'info' | 'warning';

export type EmojiModeType = 'quill' | 'react';

export type EditorKinds = 'quill' | 'audio' | 'video';

export type RecorderStatus = 'new' | 'paused' | 'recording' | 'ended';
