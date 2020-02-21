module.exports = {
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly"
    },
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "double"
        ],
        "semi": [
            "error",
            "never"
        ],
        "keyword-spacing": [
            "error",
            { "before": true }
        ],
        "no-trailing-spaces": [
            "error"
        ],
        "curly": [
            "error",
            "all"
        ],
        "object-curly-spacing": [
            "error",
            "always"
        ],
        "space-before-blocks": [
            "error",
            "always"
        ],
        "no-shadow": [
            "error",
            "always"
        ],
        "yoda": [
            "error",
            "always"
        ],
        "prefer-const": [
            "warn",
            "always"
        ],
        "no-var": [
            "error",
            "always"
        ],
        "no-confusing-arrow": [
            "error",
            { "allowParens": true }
        ],
        "spaced-comment": [
            "error",
            "always"
        ],
        "space-infix-ops": [
            "error"
        ],
        "no-mixed-operators": [
            "error",
            {
                "groups": [
                    ["+", "-", "*", "/", "%", "**"],
                    ["&", "|", "^", "~", "<<", ">>", ">>>"],
                    ["==", "!=", "===", "!==", ">", ">=", "<", "<="],
                    ["&&", "||"],
                    ["in", "instanceof"]
                ],
                "allowSamePrecedence": true
            }
        ]
    }
}