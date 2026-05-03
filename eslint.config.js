import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import perfectionist from "eslint-plugin-perfectionist";

export default tseslint.config(
  {
    ignores: [
      "resources/react/libs/chakra-ui/**",
      "resources/react/libs/orval/**",
      "node_modules/**",
      "public/**",
      "vendor/**",
    ],
  },
  {
    files: ["resources/react/**/*.{ts,tsx}"],
    extends: [
      ...tseslint.configs.recommended,
      pluginReact.configs.flat.recommended,
      pluginReact.configs.flat["jsx-runtime"],
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: {
        project: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    settings: {
      react: { version: "detect" },
    },
    plugins: {
      perfectionist,
    },
    rules: {
      "@typescript-eslint/consistent-type-imports": [
        "error",
        { prefer: "type-imports", fixStyle: "inline-type-imports" },
      ],
      "perfectionist/sort-imports": [
        "error",
        {
          type: "alphabetical",
          order: "asc",
          internalPattern: ["^@/"],
          groups: [
            "type",
            ["builtin", "external"],
            "internal",
            ["parent", "sibling", "index"],
            "unknown",
          ],
        },
      ],
      "no-restricted-imports": [
        "error",
        {
          patterns: [
            {
              group: ["../*", "./*"],
              importNamePattern: "^[^i]",
              message:
                "Use @/ alias for imports. Only index files may use relative imports.",
            },
          ],
        },
      ],
    },
  }
);
