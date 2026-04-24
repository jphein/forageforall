/**
 * ESLint config — minimal, strict.
 */
module.exports = {
  extends: ["expo", "prettier"],
  rules: {
    "react-hooks/exhaustive-deps": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
  },
};
