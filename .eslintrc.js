module.exports = {
  parser: "@typescript-eslint/parser", // Specifies the ESLint parser
  extends: [
    "plugin:@typescript-eslint/recommended", // Uses the recommended rules from @typescript-eslint/eslint-plugin
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  plugins: ["@typescript-eslint", "prettier"],
  parserOptions: {
    ecmaVersion: 2020, // Allows for the parsing of modern ECMAScript features
    sourceType: "module", // Allows for the use of imports
  },
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    "no-console": "error",
    "no-tabs": ["error", { allowIndentationTabs: true }],
    quotes: [1, "double"],
    "@typescript-eslint/naming-convention": [
      "warn",
      {
        selector: "interface",
        format: ["PascalCase"],
        prefix: ["I"],
      },
    ],
    "prettier/prettier": [
      "warn",
      {
        endOfLine: "auto",
        printWidth: 120,
      },
    ],
    "require-jsdoc": 0,
    "valid-jsdoc": 0,
    "no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
    "@typescript-eslint/no-non-null-assertion": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/ban-ts-comment": "off",
    "@typescript-eslint/ban-types": "warn",
    "@typescript-eslint/no-unused-vars": ["warn", { varsIgnorePattern: "^_" }],
  },
  ignorePatterns: ['*.d.ts', '.eslintrc.js', 'dist'],
};
