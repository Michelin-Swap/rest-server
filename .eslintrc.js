module.exports = {
    root: true,
    parserOptions: {
      parser: 'babel-eslint',
      "sourceType": "module",
    },
    env: {
      browser: true,
      "es6": true
    },
    // https://github.com/vuejs/eslint-plugin-vue#priority-a-essential-error-prevention
    // consider switching to `plugin:vue/strongly-recommended` or `plugin:vue/recommended` for stricter rules.
    extends: ['plugin:vue/essential', 'airbnb-base'],
    // required to lint *.vue files
    plugins: [
      'vue'
    ],
    // check if imports actually resolve
    settings: {
      'import/resolver': {
        webpack: {
          config: 'build/webpack.base.conf.js'
        }
      }
    },
    "globals": {
      "twaver": "readonly",
      "mono": "readonly"
    },
    // add your custom rules here
    rules: {
      'linebreak-style': ["error", "unix"],
      // don't require .vue extension when importing
      'import/extensions': ['error', 'always', {
        js: 'never',
        vue: 'never'
      }],
      // disallow reassignment of function parameters
      // disallow parameter object manipulation except for specific exclusions
      'no-param-reassign': ['off', {
        props: true,
        ignorePropertyModificationsFor: [
          'state', // for vuex state
          'acc', // for reduce accumulators
          'e' // for e.returnvalue
        ]
      }],
      // allow optionalDependencies
      'import/no-extraneous-dependencies': ['error', {
        optionalDependencies: ['test/unit/index.js']
      }],
      'no-underscore-dangle': 0,
      'global-require': 0,
      "import/no-dynamic-require": 0,
      // allow debugger during development
      'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
      "no-console": 0,
      "no-unused-vars": [
        "off",
        {
          "args": "none"
        }
      ],
      "no-mixed-operators": [
        "error",
        {
          "groups": [
            // ["+", "-", "*", "/", "%", "**"],
            // ["&", "|", "^", "~", "<<", ">>", ">>>"],
            // ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
            ["&&", "||"],
            ["in", "instanceof"]
          ],
          "allowSamePrecedence": true
        }
      ]
    },
  
  }