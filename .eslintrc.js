module.exports = {
  "extends": "airbnb-base",
  "env": {
    "node": true,
    "browser": true,
    "es6": true,
    "mocha": true
  },
  "rules": {
    "class-methods-use-this": 0,
    "object-curly-newline" : 1,
    "array-callback-return": 0,
    "consistent-return" : 0,
    "prefer-destructuring": 1,
    "linebreak-style":0,
    "quotes": "off",
    "no-console": 0,
    "arrow-body-style": ["error", "always"],
    "no-unused-vars": ["error", { "vars": "all", "args": "none", "ignoreRestSiblings": true }]
  }
};
