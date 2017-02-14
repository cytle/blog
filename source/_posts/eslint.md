---
title: eslint
date: 2017-02-14 14:12:54
tags:
---

```json
{
  "root": true,
  "env": {
    "es6": true,
    "node": true,
    "browser": true,
    "commonjs": true,
    "jquery": true
  },
  "plugins": [
    "import",
    "html",
    "react"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
    "plugin:react/recommended"
  ],
  "settings" : {
      "import/resolver": {
        "webpack": {
          "config": "build/webpack.dev.js"
        }
      }
  },
  "parserOptions": {
      "ecmaFeatures": {
          "experimentalObjectRestSpread": true,
          "jsx": true
      },
      "sourceType": "module"
  },
  "globals": {
  },
  "rules": {
    "react/react-in-jsx-scope": ["off"],
    "react/prop-types": ["off"],
    "indent": [
      "error",
      4
    ],
    "linebreak-style": [
      "error",
      "unix"
    ],
    "quotes": [
      "off",
      "single"
    ],
    "semi": [
      "error",
      "always"
    ]
  }
}
```

### 文件是否存在判断

插件`eslint-plugin-import`

**增加配置**

```json
{
  "plugins": [
    "import"
  ],
  "extends": [
    "eslint:recommended",
    "plugin:import/errors",
    "plugin:import/warnings",
  ]
}
```

#### 兼顾Webpack

插件`eslint-import-resolver-webpack`

**增加配置**

```json
{
  "settings" : {
      "import/resolver": {
        "webpack": {
          "config": "build/webpack.dev.js"
        }
      }
  },
}
```

### react支持

插件`eslint-plugin-react`

**增加配置**

```json
{
  "plugins": [
    "react"
  ],
  "extends": [
    "plugin:react/recommended",
  ]
}
```



### 集成

#### sublime

插件推荐

- SublimeLinter + SublimeLinter-eslint
- Eslint-Formater

安装`SublimeLinter`后按需要修改环境地址

```json
{
    "user": {
        "paths": {
            "linux": [
                "/usr/local/bin"
            ],
            "osx": [],
            "windows": []
        }
    }
}
```
