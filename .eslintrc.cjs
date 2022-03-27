module.exports = {
  parser: "@babel/eslint-parser",
  parserOptions: {
    sourceType: "module",
    requireConfigFile: false,
  },
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: ["eslint:recommended", "plugin:jest/recommended", "prettier"],
};
