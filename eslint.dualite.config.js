import globals from "globals";
import tseslint from "typescript-eslint";
import pluginReact from "eslint-plugin-react";
import hooks from "eslint-plugin-react-hooks";
import refresh from "eslint-plugin-react-refresh";

export default tseslint.config(
  {
    ignores: ["dist", "tailwind.config.js", "postcss.config.js", "vite.config.ts"],
  },
  // Add the recommended configs at the top level
  ...tseslint.configs.recommended,

  // Add React-specific configs and custom overrides
  {
    files: ["**/*.{js,jsx,ts,tsx}"],
    plugins: {
      react: pluginReact,
      "react-hooks": hooks,
      "react-refresh": refresh,
    },
    languageOptions: {
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Inherit rules from React plugins
      ...pluginReact.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      
      // Custom overrides
      "react/react-in-jsx-scope": "off",
      "react-refresh/only-export-components": "warn",
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "react/prop-types": "off",
      "react-hooks/rules-of-hooks": "off",
      "react/no-unescaped-entities": "off",
    },
    settings: {
      react: {
        version: "detect",
      },
    },
  }
);
