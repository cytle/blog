---
title: 2difre-前端多工程协作环境配置(相对路径)
date: 2017-02-18 14:50:29
tags:
---

### 项目修改细节

#### Gruntfile.js

删除`dev`环境替换相对路径的配置

```javascript
{
    // ...
    dev: {
        replacements: [
            /* 从这开始
            {
                from: /(\.\.\/public)/g,
                to: 'http://10.1.4.186/nginx/meal/public'
            },
            {
                from: /(\.\.\/images)/g,
                to: 'http://10.1.4.186/nginx/meal/images'
            },
            {
                from: /(\.\.\/css)/g,
                to: 'http://10.1.4.186/nginx/meal/css'
            },
            {
                from: /(\.\.\/js)/g,
                to: 'http://10.1.4.186/nginx/meal/js'
            },
            {
                from: /(\.\.\/page)/g,
                to: 'http://api.l.whereask.com/fromMeal/meal/page'
            },
            {
                from: /(\.\.\/\.\.\/marketing)/g,
                to: 'http://api.l.whereask.com/fromMeal/marketing'
            },
            {
                from: /(\.\.\/\.\.\/bill)/g,
                to: 'http://api.l.whereask.com/fromMeal/bill'
            },
            {
                from: /(\.\.\/\.\.\/om)/g,
                to: 'http://api.l.whereask.com/fromMeal/om'
            },
            {
                from: /(\.\.\/\.\.\/shop)/g,
                to: 'http://api.l.whereask.com/fromMeal/shop'
            },
            从这结束 */
            {
                from: 'grunt_env_dev',
                to: 'grunt_env_dev'
            }
        ]
    }
    // ...
}
```

#### http.js

修改api基础地址为相对路径

```javascript
// var API_BASE_URL = 'http://api.l.whereask.com/server_from_meal';
var API_BASE_URL = '../../api';

// var RETAIL_BASE_URL = 'http://retailweixin.2dfire-dev.com/retail-weidian-api';
var RETAIL_BASE_URL = '../../retail-weidian-api';
```

#### config/dev.js

修改api基础地址为相对路径

```javascript
module.exports = {
    // API_BASE_URL: 'http://api.l.whereask.com/server_from_meal',
    API_BASE_URL: '../../api',

    // RETAIL_BASE_URL: 'http://retailweixin.2dfire-dev.com/retail-weidian-api',
    RETAIL_BASE_URL: '../../retail-weidian-api',

    SHARE_BASE_URL: 'http://api.l.whereask.com',
    IMAGE_BASE_URL: 'http://ifiletest.2dfire.com/',
    API_WEB_SOCKET: 'http://10.1.5.114:9003/web_socket'
};
```

### 本地开发配置

```
server {
  listen 80;
  access_log /var/log/nginx/2dfire.access.log;
  error_log /var/log/nginx/2dfire.error.log;

  # 注意设置自定义域名,需要在hostname加一条
  server_name x.me;
  # 静态地址,请求打包后的静态文件
  location /meal/ {
    alias /home/xsp/src/js/2dfire/static-meal/;
  }
  location /bill/ {
    alias /home/xsp/src/js/2dfire/static-bill/;
  }
  location /om/ {
    alias /home/xsp/src/js/2dfire/static-om/;
  }
  location /shop/ {
    alias /home/xsp/src/js/2dfire/static-shop/;
  }
  location /marketing/ {
    alias /home/xsp/src/js/2dfire/static-marketing/;
  }

  # 真实api地址
  location /api/ {
    proxy_pass http://api.l.whereask.com/;
  }

  # 真实零售api地址
  location /retail-weidian-api/ {
    proxy_pass       http://retailweixin.2dfire-dev.com/retail-weidian-api;
  }


  # 开发环境配置
  # 开发环境默认反向代理到上面的静态地址
  location /dev/ {
    proxy_pass       /;
  }

  # meal和bill需要修改,反向代理到webpack-server的端口
  location /dev/meal/ {
    proxy_pass       http://localhost:8088/;
  }
  location /dev/bill/ {
    proxy_pass       http://localhost:8089/;
  }
#  location /dev/om/ {
#    proxy_pass       http://localhost:8087/;
#  }
#  location /dev/shop/ {
#    proxy_pass       http://localhost:8086/;
#  }
#  location /dev/marketing/ {
#    proxy_pass       http://localhost:8085/;
#  }
  # 开发环境下api地址,注意在项目中切不同开发分支,需要配置相应的API地址
  location /dev/api/ {
    proxy_pass       http://api.l.whereask.com/from_meal_server/;
  }
#  location /retail-weidian-api/ {
#    proxy_pass       http://retailweixin.2dfire-dev.com/retail-weidian-api;
#  }
}
```


###　项目环境配置(10.1.7.159)

```
  # 工程默认使用daily (需要daily环境已经在用相对路径的环境配置)
  location /fromMeal/ {
    proxy_pass       http://api.l.where.com/daily/;
  }

  # meal和bill是本次变更会修改的工程
  location /fromMeal/meal/ {
    proxy_pass       http://10.1.4.186/nginx/meal/page;
  }
  location /fromMeal/bill/ {
    proxy_pass       http://10.1.4.187/nginx/bill/page;
  }

  # 真实api地址
  location /fromMeal/api/ {
    proxy_pass       http://api.l.where.com/server_from_meal;
  }

  # 真实零售api地址
  location /fromMeal/retail-weidian-api/ {
    proxy_pass       http://retailweixin.2dfire-dev.com/retail-weidian-api;
  }
```
