import typescript from "rollup-plugin-typescript2";
import dts from 'rollup-plugin-dts'

export default [
  {
    input: ["src/index.ts"],
    output: [
      {
        dir: "dist",
        entryFileNames: "[name].js",
        format: "cjs",
        exports: "named",
      },
    ],
    plugins: [typescript()],
    external: [
      "react",
      "@mui/material",
      "@mui/material/styles",
      "@apollo/client",
      "@apollo/client/utilities",
      "@apollo/client/link/subscriptions",
      "@apollo/client/link/error",
      "@mui/icons-material/DeleteOutline",
      "@mui/icons-material/AddReactionOutlined",
      "@mui/icons-material/MoreVertOutlined",
      "emoji-picker-react",
      "graphql-ws",
      "react-quill",
      "react-quill/dist/quill.snow.css",
    ],
  },
  {
    input: "./dist/dts/src/index.d.ts",
    output: [{ file: "dist/index.d.ts", format: "es" }],
    plugins: [dts()],
  },
];
