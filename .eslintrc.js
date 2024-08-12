module.exports = {
  root: true,
  parser: "@typescript-eslint/parser",
  env: {
    node: true,
    es6: true
  },
  plugins: ["@typescript-eslint", "prettier", "mocha"],
  extends: [
    "plugin:prettier/recommended",
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:mocha/recommended"
  ],
  rules: {
    "prettier/prettier": "error",
    "no-case-declarations": 0,
    "@typescript-eslint/no-explicit-any": 0,
    "@typescript-eslint/no-var-requires": 0,
    "no-console": 0 // 使用0或者"off",都是同样的
  }
};
