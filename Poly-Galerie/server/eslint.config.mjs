import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest"


export default [
  { files: ["**/*.js"], languageOptions: { sourceType: "commonjs" } },
  { ignores: ["eslint.config.mjs"] },
  { languageOptions: { globals: { ...globals.browser, ...jestPlugin.environments.globals.globals, ...globals.node } } },
  pluginJs.configs.recommended,
  {
    plugins: { 'jest': jestPlugin },
  },
  {
    rules: {
      "no-var": "error",
      "max-len": [
        "error",
        {
          "code": 120,
          "comments": 150,
          "ignoreStrings": true,
          "ignoreUrls": true,
          "ignoreTemplateLiterals": true
        }
      ],
      "object-shorthand": ["warn", "properties"],
      "accessor-pairs": [
        "error",
        { "setWithoutGet": true, "enforceForClassMembers": true }
      ],
      "array-bracket-spacing": ["error", "never"],

      "arrow-spacing": ["error", { "before": true, "after": true }],
      "block-spacing": ["error", "always"],
      "comma-spacing": ["error", { "before": false, "after": true }],
      "comma-style": ["error", "last"],
      "computed-property-spacing": [
        "error",
        "never",
        { "enforceForClassMembers": true }
      ],
      "constructor-super": "error",
      "default-case-last": "error",
      "dot-location": ["error", "property"],
      "eol-last": "off",
      "eqeqeq": ["error", "always", { "null": "ignore" }],
      "no-magic-numbers": ["error", { "ignore": [0, 1, 2, 3, 100, -1] }],
      "max-lines": ["error", 400],
      "func-call-spacing": ["error", "never"],
      "generator-star-spacing": ["error", { "before": true, "after": true }],
      "key-spacing": ["error", { "beforeColon": false, "afterColon": true }],
      "keyword-spacing": ["error", { "before": true, "after": true }],
      "lines-between-class-members": [
        "error",
        "always",
        { "exceptAfterSingleLine": true }
      ],
      "multiline-ternary": ["error", "always-multiline"],
      "new-cap": [
        "error",
        { "newIsCap": true, "capIsNew": false, "properties": true }
      ],
      "new-parens": "error",

      "no-array-constructor": "error",
      "no-async-promise-executor": "error",
      "no-caller": "error",
      "no-case-declarations": "error",
      "no-class-assign": "error",
      "no-compare-neg-zero": "error",
      "no-cond-assign": "error",
      "no-const-assign": "warn",
      "no-constant-condition": ["warn", { "checkLoops": false }],
      "no-dupe-args": "error",
      "no-dupe-class-members": "error",
      "no-dupe-keys": "error",
      "no-duplicate-case": "error",
      "no-useless-backreference": "error",
      "no-empty": ["error", { "allowEmptyCatch": true }],
      "no-empty-character-class": "error",
      "no-empty-pattern": "error",
      "no-eval": "error",
      "no-ex-assign": "error",
      "no-extend-native": "error",
      "no-extra-bind": "error",
      "no-extra-boolean-cast": "error",
      "no-extra-parens": ["error", "functions"],
      "no-fallthrough": "error",
      "no-floating-decimal": "error",
      "no-func-assign": "error",
      "no-global-assign": "error",
      "no-implied-eval": "error",
      "no-import-assign": "error",
      "no-invalid-regexp": "error",
      "no-irregular-whitespace": "error",
      "no-iterator": "error",
      "no-labels": ["error", { "allowLoop": false, "allowSwitch": false }],
      "no-lone-blocks": "error",
      "no-loss-of-precision": "error",
      "no-misleading-character-class": "error",
      "no-prototype-builtins": "error",
      "no-useless-catch": "error",
      "no-mixed-operators": [
        "error",
        {
          "groups": [
            ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
            ["&&", "||"],
            ["in", "instanceof"]
          ],
          "allowSamePrecedence": true
        }
      ],
      "no-mixed-spaces-and-tabs": "error",
      "no-multi-str": "error",
      "no-multiple-empty-lines": ["error", { "max": 3, "maxEOF": 0 }],
      "no-obj-calls": "error",
      "no-octal": "error",
      "no-octal-escape": "error",
      "no-redeclare": ["error", { "builtinGlobals": false }],
      "no-regex-spaces": "error",
      "no-return-assign": ["error", "except-parens"],
      "no-self-assign": ["error", { "props": true }],
      "no-self-compare": "error",
      "no-template-curly-in-string": "error",
      "no-this-before-super": "error",
      "no-throw-literal": "error",
      "no-unexpected-multiline": "error",
      "no-unmodified-loop-condition": "error",
      "no-unneeded-ternary": ["error", { "defaultAssignment": false }],
      "no-unsafe-finally": "error",
      "no-unsafe-negation": "error",
      "no-unused-expressions": [
        "error",
        {
          "allowShortCircuit": true,
          "allowTernary": true,
          "allowTaggedTemplates": true
        }
      ],
      "no-unused-vars": [
        "error",
        {
          "args": "none",
          "caughtErrors": "none",
          "ignoreRestSiblings": true,
          "vars": "all"
        }
      ],
      "no-use-before-define": [
        "error",
        { "functions": false, "classes": false, "variables": false }
      ],
      "no-useless-call": "error",
      "no-useless-computed-key": "error",
      "no-useless-constructor": "error",
      "no-useless-rename": "error",
      "no-useless-return": "error",
      "no-whitespace-before-property": "error",

      "object-curly-newline": [
        "error",
        { "multiline": true, "consistent": true }
      ],
      "object-curly-spacing": ["error", "always"],
      "object-property-newline": [
        "error",
        { "allowMultiplePropertiesPerLine": true }
      ],
      "one-var": ["error", { "initialized": "never" }],
      "operator-linebreak": [
        "error",
        "after",
        { "overrides": { "?": "before", ":": "before", "|>": "before" } }
      ],
      "prefer-const": ["error", { "destructuring": "all" }],
      "rest-spread-spacing": ["error", "never"],
      "semi-spacing": ["error", { "before": false, "after": true }],

      "space-before-blocks": ["error", "always"],
      "space-in-parens": ["error", "never"],
      "space-infix-ops": "error",
      "space-unary-ops": ["error", { "words": true, "nonwords": false }],
      "spaced-comment": [
        "error",
        "always",
        {
          "line": { "markers": ["*package", "!", "/", ",", "="] },
          "block": {
            "balanced": true,
            "markers": ["*package", "!", ",", ":", "::", "flow-include"],
            "exceptions": ["*"]
          }
        }
      ],

      "symbol-description": "error",
      "template-curly-spacing": ["error", "never"],
      "template-tag-spacing": ["error", "never"],
      "unicode-bom": ["error", "never"],
      "use-isnan": [
        "error",
        {
          "enforceForSwitchCase": true,
          "enforceForIndexOf": true
        }
      ],
      "valid-typeof": ["error", { "requireStringLiterals": true }],
      "wrap-iife": ["error", "any", { "functionPrototypeMethods": true }],
      "yield-star-spacing": ["error", "both"],
      "yoda": ["error", "never"],
    }
  }
];