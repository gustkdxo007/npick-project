module.exports = {
  root: true,
  env: {
    node: true
  },
  plugins: [
    "@typescript-eslint"
  ], 
  extends: [
    "plugin:vue/essential",
    "eslint:recommended",
    "@vue/typescript/recommended",
    "@vue/prettier",
    "@vue/prettier/@typescript-eslint"
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    quotes: ["error", "double"],
    "camelcase": "off",
    "@typescript-eslint/camelcase": "off",
    "no-console": process.env.NODE_ENV === "production" ? "warn" : "off",
    "no-debugger": process.env.NODE_ENV === "production" ? "warn" : "off",    
  }
};
