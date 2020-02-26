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
    "plugins": [
        "jsdoc"
    ],
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
        "quote-props": [
            "error",
            "as-needed"
        ],
        "no-shadow": [
            "error",
            {
                "builtinGlobals": false,
                "hoist": "functions",
                "allow": []
            }
        ],
        // "yoda": [
        //     "error",
        //     "always",
        //     {
        //         "exceptRange": true,
        //         "onlyEquality": true
        //     }
        // ],
        "block-spacing": [
            "error",
            "always"
        ],
        "prefer-const": [
            "warn",
            {
                "destructuring": "any",
                "ignoreReadBeforeAssign": false
            }
        ],
        "no-var": [
            "error"
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
        ],
        "arrow-parens": [
            "error",
            "always"
        ],
        "no-cond-assign": [
            "error",
            "except-parens"
        ],
        "capitalized-comments": [
            "error",
            "never",
            {
                "line": {},
                "block": {
                    "ignoreInlineComments": true,
                    "ignorePattern": "@description"
                }
            }
        ],
        "jsdoc/check-alignment": 1,
        "jsdoc/check-examples": 1,
        "jsdoc/check-indentation": 1,
        "jsdoc/check-param-names": 1,
        "jsdoc/check-syntax": 1,
        "jsdoc/check-tag-names": 1,
        "jsdoc/check-types": [
            1,
            { "noDefaults": true }
        ],
        "jsdoc/implements-on-classes": 1,
        "jsdoc/match-description": 1,
        "jsdoc/newline-after-description": 1,
        "jsdoc/no-undefined-types": 1,
        "jsdoc/require-description": [
            2,
            { "descriptionStyle": "tag" }
        ],
        "jsdoc/require-description-complete-sentence": [
            1,
            { "abbreviations": [":", "i.e"] }
        ],
        "jsdoc/require-example": 0,
        "jsdoc/require-hyphen-before-param-description": 1,
        "jsdoc/require-jsdoc": 1,
        "jsdoc/require-param": 1,
        "jsdoc/require-param-description": 1,
        "jsdoc/require-param-name": 1,
        "jsdoc/require-param-type": 1,
        "jsdoc/require-returns": 1,
        "jsdoc/require-returns-check": 1,
        "jsdoc/require-returns-description": 1,
        "jsdoc/require-returns-type": 1,
        "jsdoc/valid-types": 1
    },
    "settings": {
        "jsdoc": {
            "tagNamePreference": {
                "arg": "param",
                "return": "returns",
                "property": "prop"
            },
            "ignorePrivate": true
        }
    }
}