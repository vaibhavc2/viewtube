module.exports = {
  root: true,
  env: { browser: false, es2020: true },
  extends: ["eslint:recommended", "plugin:import/errors", "prettier"],
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  parser: "@typescript-eslint/parser",
  plugins: ["import"],
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module",
    project: ["./tsconfig.json"],
    tsconfigRootDir: __dirname,
  },
  rules: {
    indent: ["error", 2],
    "linebreak-style": 1,
    quotes: ["error", "double"],
    "@typescript-eslint/no-empty-interface": "off",
    "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
    "@typescript-eslint/no-use-before-define": "off",
    "no-multiple-empty-lines": [2, { max: 3, maxEOF: 1 }],
  },
};
