---
title: eslint-plugin-import 未找到webpack.config 错误
date: 2018-08-09 11:39:15
tags:
---

## 问题由来

项目是需要兼容多端（`web`、小程序），一些组件和辅助方法使用`webpack`的`mainFileds`来区分各端兼容版本，因此一些组件文件夹内有`package.json`，如以下结构

```txt
project
├── src
│   ├── components
│   │   ├── swiper
│   │   │   ├── index.vue
│   │   │   ├── wx.vue
│   │   │   └── package.json
│   │   └── video
│   │       ├── index.vue
│   │       ├── wx.vue
│   │       └── package.json
│   └── pages
├── .eslintrc.js
├── webpack.config.js
└── package.json
```

另一方面,`eslint-import-resolver-webpack`在加载`webpack.config`时，如果配置中的地址不是绝对地址时候，会拼接上`packageDir`(通过`find-root`包,找到的当前`package.json`所在目录)

```js
// https://github.com/benmosher/eslint-plugin-import/blob/master/resolvers/webpack/index.js#L342-L344
if (!path.isAbsolute(configPath)) {
  configPath = path.join(packageDir, configPath)
}
```

而实际定义的`webpack.config`地址是相对`/project/package.json`的，这时候就会报出类似的错误。

```txt
Error resolving webpackConfig { Error: Cannot find module '/xxx/xxx/project/src/pages/components/swiper/webpack.config.js'
```

此处已经向作者提出[`issue`](https://github.com/benmosher/eslint-plugin-import/issues/1158), 提问“为什么要使用packageDir加入configPath，而不是使用eslint配置的目录”

## 解决方案

配置绝对地址`webpack.config`

```js
// .eslintrc.js
const path = require('path');

module.exports = {
  // ...
  settings: {
    'import/resolver': {
      webpack: {
        // 配置为绝对地址
        config: path.resolve(__dirname, 'shells/web/webpack.config.js'),
      },
    },
  }
};
```
