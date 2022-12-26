export const modules = {
  toolbar: [
    ["bold", "italic", "strike"],
    ["link"],
    [{ list: "ordered" }, { list: "bullet" }],
    ["blockquote"],
    ["code", "code-block"],
  ],
  keyboard: {
    bindings: {
      enter: {
        key: 13,
        shiftKey: false,
        handler: () => {},
      },
      tab: false,
    },
  },
};

export const formats = [
  "bold",
  "italic",
  "strike",
  "link",
  "list",
  "bullet",
  "blockquote",
  "code",
  "code-block",
];
