import React, { useRef, useEffect, KeyboardEvent } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

import { AttachmentLabelList } from "../Attachment";
import { BottomToolbar } from "./BottomToolbar";
import { AttachmentListContainer } from "./styled";
import { IFileDB } from "../utils/types";

type ReactQuillProps = {
  attachments: IFileDB[];
  onAddAttachment: (file: IFileDB) => void;
  onCancelAttachment: (file: IFileDB) => void;
  value: string;
  sendToServer(): void;
  onChange(quill: string, plain: string): void;
};

export function CustomReactQuill({
  attachments,
  onAddAttachment,
  onCancelAttachment,
  value,
  sendToServer,
  onChange,
}: ReactQuillProps) {
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
    _delta: any,
    _source: any,
    editor: any
  ) => {
    const text = editor.getText(value);
    onChange(value, text);
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
            onCancel={onCancelAttachment}
          />
        </AttachmentListContainer>
      ) : null}
      <BottomToolbar onSend={sendToServer} onAddAttachment={onAddAttachment} />
    </>
  );
}
