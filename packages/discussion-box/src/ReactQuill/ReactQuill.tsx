import React, {
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
  KeyboardEvent,
  MouseEvent,
  ChangeEventHandler,
} from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

import { Skeleton, Stack, IconButton } from "@mui/material";

import HighlightOffOutlinedIcon from "@mui/icons-material/HighlightOffOutlined";

import { QuillAttachmentList } from "../Attachment";
import {
  AttachmentListContainer,
  QuillContainer,
  AttachmentButtonContainer,
  ReactionButtonContainer,
  ReplyButtonContainer,
} from "./styled";

import { AddAttachmentButton } from "../common/AddAttachmentButton";
import { AddReactionButton } from "../common/AddReactionButton";
import { SendButton } from "../common/SendButton";

import { IFile, UploadedFile } from "../utils/types";
import { modules, formats, Skeletons } from "./utils";

import { useMutation } from "@apollo/client";
import { fileClient } from "../graphql/fileGraphql";
import { UPLOAD_FILE } from "../graphql/fileQuery";
import { getMimeType } from "../utils/helpers";

const client = fileClient;

const maxFileSize =
  process.env.REACT_APP_MAX_FILE_SIZE !== undefined
    ? +process.env.REACT_APP_MAX_FILE_SIZE
    : 1024 * 1024 * 50;

type SkeletonSize = {
  width: string;
  height: string;
};

type ReactQuillProps = {
  attachments: IFile[];
  onAddAttachment(file: IFile): void;
  onCancelAttachment(file: IFile): void;
  openEmojiPicker(anchorEl: Element): void;
  value: string | undefined;
  special?: {
    title: string;
    action(): void;
  };
  sendToServer(): void;
  onChange(quill: string, plain: string): void;
};

export const CustomReactQuill = forwardRef<{ focus(): void }, ReactQuillProps>(
  (
    {
      attachments,
      onAddAttachment,
      onCancelAttachment,
      openEmojiPicker,
      special,
      value,
      sendToServer,
      onChange,
    },
    ref
  ) => {
    const [uploadFile, { data, loading, error }] = useMutation<UploadedFile>(
      UPLOAD_FILE,
      {
        client,
      }
    );
    const quillRef = useRef<ReactQuill | null>(null);
    const skeletonRef = useRef<SkeletonSize | null>(null);
    const inputRef = useRef<HTMLInputElement | null>(null);

    useImperativeHandle(ref, () => ({
      focus: () => {
        quillRef.current?.focus();
      },
    }));

    // Upload is successful then trigger onAddAttachment
    useEffect(() => {
      if (!!data && !error && !loading) {
        onAddAttachment(data.uploadFile);

        // Refresh file input element
        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    }, [data, error, loading, onAddAttachment]);

    const handleKeyEvent = (event: KeyboardEvent<HTMLElement>) => {
      if (event.key === "Enter" && !event.shiftKey) {
        sendToServer();
      }
    };

    const handleChange = (
      value: string,
      _delta: any,
      _source: any,
      editor: any
    ) => {
      const text = editor.getText(value);
      onChange(value, text);
    };

    const handleReactionClick = (event: MouseEvent<Element>) => {
      openEmojiPicker(event.currentTarget);
    };

    // Get a file then upload
    const handleFileChange: ChangeEventHandler<HTMLInputElement> = (event) => {
      inputRef.current = event.target;
      const files = event.target.files;

      if (files && files.length > 0) {
        const file = files[0];

        if (file.size > maxFileSize) {
          alert("Exceed max file size!");
          return;
        }

        const mimeType = getMimeType(file.type) as keyof typeof Skeletons;
        skeletonRef.current = Skeletons[mimeType];

        uploadFile({
          variables: { file, file_size: file.size, file_type: file.type },
        });
      }
    };

    const disabled = loading;

    return (
      <QuillContainer>
        {attachments.length > 0 || loading ? (
          <AttachmentListContainer>
            <QuillAttachmentList
              attachments={attachments}
              onCancel={onCancelAttachment}
            />
            {loading ? (
              <Skeleton
                animation="wave"
                variant="rectangular"
                width={skeletonRef.current?.width}
                height={skeletonRef.current?.height}
                sx={{ borderRadius: "8px" }}
              />
            ) : null}
          </AttachmentListContainer>
        ) : null}

        {special ? (
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{
              border: "1px solid #000",
              borderBottom: "none",
              borderRadius: "8px 8px 0 0",
              padding: "0 8px 0 16px",
              marginBottom: "-4px",
            }}
          >
            <span style={{ fontSize: "14px" }}>{special.title}</span>
            <IconButton onClick={special.action}>
              <HighlightOffOutlinedIcon />
            </IconButton>
          </Stack>
        ) : null}

        <div style={{ position: "relative" }}>
          <ReactQuill
            ref={quillRef}
            theme="snow"
            value={value}
            onKeyDown={handleKeyEvent}
            onChange={handleChange}
            modules={modules}
            formats={formats}
          />
          {special?.title === "Editing" ? null : (
            <AttachmentButtonContainer>
              <AddAttachmentButton
                onChange={handleFileChange}
                disabled={disabled}
              />
            </AttachmentButtonContainer>
          )}
          <ReactionButtonContainer>
            <AddReactionButton onClick={handleReactionClick} />
          </ReactionButtonContainer>
          <ReplyButtonContainer>
            <SendButton onClick={sendToServer} />
          </ReplyButtonContainer>
        </div>
      </QuillContainer>
    );
  }
);
