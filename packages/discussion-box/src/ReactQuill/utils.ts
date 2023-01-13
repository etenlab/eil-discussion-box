export const modules = {
  toolbar: [
    ['bold', 'italic', 'strike'],
    ['link'],
    [{ list: 'ordered' }, { list: 'bullet' }],
    // ["blockquote"],
    // ["code", "code-block"],
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
  'bold',
  'italic',
  'strike',
  'link',
  'list',
  'bullet',
  // 'blockquote',
  // 'code',
  // 'code-block',
];

export const Skeletons = {
  normal: {
    width: '200px',
    height: '70px',
  },
  image: {
    width: '70px',
    height: '70px',
  },
  video: {
    width: '70px',
    height: '70px',
  },
  audio: {
    width: '300px',
    height: '70px',
  },
};
