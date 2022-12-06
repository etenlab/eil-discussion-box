import React, { useRef, useEffect } from 'react';
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

type ReactQuillProps = {
  value: string;
  onKeyUp(event: any): void;
  onChange(quill: string, plain: string): void;
}

export function CustomReactQuill({value, onKeyUp, onChange}: ReactQuillProps) {
  const ref = useRef<any>();

  useEffect(() => {
    if (ref.current) {
      const editor = ref.current.getEditor();
      const keyboard = editor.getModule('keyboard');
      keyboard.bindings[13].unshift({
        key: 13,
        handler: () => {
          return false;
        }
      });
    }
  }, []);

  const handleChange = (value: string, delta: any, source: any, editor: any) => {
    const text = editor.getText(value);
    onChange(value, text);
  }

  return (
    <ReactQuill
      ref={ref}
      theme="snow"
      value={value}
      onKeyUp={onKeyUp}
      onChange={handleChange}
    />
  );
}
