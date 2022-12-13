import React, { useRef, useEffect, useState, KeyboardEvent } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

import { Stack } from "@mui/material";

import { AttachmentLabelList } from "src/Attachment";
import { BottomToolbar } from "./BottomToolbar";
import { AttachmentListContainer } from "./styled";
import { IFileDB } from "src/utils/types";

type ReactQuillProps = {
  value: string;
  sendToServer(): void;
  onChange(quill: string, plain: string): void;
};

export function CustomReactQuill({
  value,
  sendToServer,
  onChange,
}: ReactQuillProps) {
  const [attachments, setAttachments] = useState<IFileDB[]>([]);
  const ref = useRef<any>();

  useEffect(() => {
    if (ref.current) {
      const editor = ref.current.getEditor();
      const keyboard = editor.getModule("keyboard");
      keyboard.bindings[13].unshift({
        key: 13,
        handler: () => {
          return false;
        },
      });
    }
  }, []);

  const handleKeyEvent = (event: KeyboardEvent<HTMLElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      sendToServer();
    }
  };

  const handleChange = (
    value: string,
    delta: any,
    source: any,
    editor: any
  ) => {
    const text = editor.getText(value);
    onChange(value, text);
  };

  const onAddAttachment = (file: IFileDB) => {
    setAttachments((attachments) => [...attachments, file]);
  };

  const handleAttachmentCancel = (id: number) => {
    setAttachments((attachments) =>
      attachments.filter((attachment) => attachment.id !== id)
    );
  };

  return (
    <>
      <ReactQuill
        ref={ref}
        theme="snow"
        value={value}
        onKeyUp={handleKeyEvent}
        onChange={handleChange}
      />
      {attachments.length > 0 ? (
        <AttachmentListContainer>
          <AttachmentLabelList
            attachments={attachments}
            onCancel={handleAttachmentCancel}
          />
        </AttachmentListContainer>
      ) : null}
      <BottomToolbar onSend={sendToServer} onAddAttachment={onAddAttachment} />
    </>
  );
}
