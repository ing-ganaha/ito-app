import { defineConfig } from "orval";

export default defineConfig({
  ito: {
    input: {
      target: "./openapi.yaml",
    },
    output: {
      mode: "tags-split",
      target: "./resources/react/libs/orval/endpoints",
      schemas: "./resources/react/libs/orval/models",
      client: "react-query",
    },
  },
});
