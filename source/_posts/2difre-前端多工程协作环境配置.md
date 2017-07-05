---
title: 2difre-前端多工程协作环境配置
date: 2017-02-18 14:50:29
tags: nginx
---

> **问题:**
> 原来要打包到项目环境,得修改多个源文件(`Gruntfile.js`,`http.js`,`config/dev.js`),常常引发冲突.
> 实际上需要修改的是这三个配置:
> 1. 跳转地址
> 2. api基础地址
> 3. 资源地址
>
> 另一个**蛋疼**的事是为了各项目协作,需要配置不需要修改的项目(还得经常合并master),部署到本地和项目环境.

以下用**相对路径**(所有路径都使用相对路径,特别是引入`/api`来表示api地址)来解决上述问题,操作步骤为以下两步

1. 配置`nginx`分为本地开发环境和项目测试环境
2. 项目修改
    * 修改`Gruntfile.js`,`http.js`,`config/dev.js`

## 常见url说明

常见静态资源请求`url`
```
http://api.l.whereask.com /invoice  /meal     /page/checkout.html
根地址                    /变更分支 /工程名字 /资源地址
```

常见api`url`
```
http://api.l.whereask.com /invoice  /api         /orders/v1/get_query_shop_tax
根地址                    /变更分支 /api特殊名字 /资源地址
```

## nginx配置

### 本地开发配置

使用如下配置

----

**`*`: 表示需要经常配置的部分**

```nginx
server {
  listen 82;
  #rewrite_log on;
  #access_log /var/log/nginx/2dfire.access.log;
  #error_log /var/log/nginx/2dfire.error.log notice;

  server_name 127.0.0.1;

  location ^~ / {
    # 所有api转到whereask
    rewrite ^/([^/]*/api/.*)$ /whereask/$1 last;
    # 其余重写到dev
    rewrite ^/(.*)$ /dev/$1;
  }
  location /whereask/ { proxy_pass http://api.l.whereask.com/; }

  # build后静态资源路径,选用
  location /build/ {
    rewrite ^/build/[^/]*/(shop|bill|meal|marketing|om)/(.*)$  /build/static-$1/release/min/$2 last;
    rewrite ^/build/(.*)$ /whereask/$1 last;
    # 静态地址
    alias /c/src/js/;
  }

  # webpack热加载路径重写*
  location /__webpack_hmr {
    # 设置需要热加载的工程
    rewrite ^/(.*)$ /dev/meal/$1;
  }

  #开发地址部分，根据需要打开相应重写规则*
  location /dev/ {
    #1. `/daily/meal/` 经过 ``^~ /` 后为 `/dev/daily/meal/`
    #2. 经过 `/dev/` 变为 `/dev/meal/`
    #3. 同样shop是不匹配的，则 `/daily/shop/`重写为 `/whereask/daily/shop/`,使用whererask资源

    #rewrite ^/dev/[^/]*/(shop/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(bill/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(marketing/.*)$ /dev/$1 last;
    rewrite ^/dev/[^/]*/(meal/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(om/.*)$ /dev/$1 last;
    rewrite ^/dev/(.*)$ /whereask/$1 last;
  }

  # 本地webpack服务
  location /dev/shop/ { proxy_pass http://localhost:8086/; }
  location /dev/bill/ { proxy_pass http://localhost:8089/; }
  location /dev/marketing/ { proxy_pass http://localhost:8085/; }
  location /dev/meal/ { proxy_pass http://localhost:8088/; }
  location /dev/om/ { proxy_pass http://localhost:8087/; }
}
```

----

可以实现

**`==>`: 表示最后指向地址**

#### 1. 将含`变更分支`的url重写到`本地webpack服务`或`whereask变更环境`

即实现根据`变更分支`自动使用对应变更静态资源

如根据以下配置
```nginx
  #开发地址部分，根据需要打开相应重写规则*
  location /dev/ {
    #1. `/daily/meal/` 经过 ``^~ /` 后为 `/dev/daily/meal/`
    #2. 经过 `/dev/` 变为 `/dev/meal/`
    #3. 同样shop是不匹配的，则 `/daily/shop/`重写为 `/whereask/daily/shop/`,使用whererask资源

    #rewrite ^/dev/[^/]*/(shop/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(bill/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(marketing/.*)$ /dev/$1 last;
    rewrite ^/dev/[^/]*/(meal/.*)$ /dev/$1 last;
    #rewrite ^/dev/[^/]*/(om/.*)$ /dev/$1 last;
    rewrite ^/dev/(.*)$ /whereask/$1 last;
  }
```

可以将以下url重写到`本地webpack服务`

- `localhost:82/invoice/meal`/page/checkout.html ==> `localhost:8088`/page/checkout.html
- `localhost:82/fire-one/meal`/page/checkout.html ==> `localhost:8088`/page/checkout.html
- `localhost:82/[任意变更分支]/meal`/page/checkout.html ==> `localhost:8088`/page/checkout.html

将以下非`meal`工程url反向代理到`http://api.l.whereask.com/invoice/...`部分

- `localhost:82`/invoice/om/page/om.html ==> `api.l.whereask.com`/invoice/om/page/om.html

#### 2. 将webpack热加载路径重写

- `localhost:82`/__webpack_hmr ==> `localhost:8088`/__webpack_hmr

#### 3. 将`api`url反向代理到`http://api.l.whereask.com/变更分支/api/...`部分

即实现根据`变更分支`自动使用对应变更api资源

- `localhost:82`/invoice/api/orders/v1/get_query_shop_tax ==> `api.l.whereask.com`/invoice/api/orders/v1/get_query_shop_tax

### 项目环境配置(10.1.7.159)

**项目环境各分支作用说明**

|分支名称|作用
|-|-
|daily|日常环境,大家都可以上的车,代码从master中检出
|dev_193|可以支付的分支

----

```nginx
  # 工程默认使用daily代码
  location /invoice/ {
    rewrite ^/[\w]*?/(.*)$ /daily/$1 last;
  }

  # 真实api地址 重写到server_from_meal
  location /invoice/api/ {
      rewrite ^/invoice/api/(.*)$  /invoice_server/$1;
  }

  # 假设meal和bill是本次变更会修改的工程,添加以下两条
  location /invoice/meal/ {
    proxy_pass       http://10.1.4.186/nginx/meal/;
  }

  location /invoice/bill/ {
    proxy_pass       http://10.1.4.187/nginx/bill/;
  }
```

----

**配置dev_193**

如果需要dev_193使用invoice分支代码，可以如下修改dev_193配置

```nginx
location /dev_193/ {
    #全部重写到invoice
    rewrite ^/dev_193/(.*)$ /invoice/$1;
}
```

## 项目修改细节

static-meal, static-shop, static-om, static-bill, static-markting在项目中都需要做以下修改(只涉及到dev环境打包)

### Gruntfile.js

删除`dev`环境替换相对路径的配置

----

```javascript
{
    // ...
    dev: {
        replacements: [
            /* 为了页面间传递url,需要修改../page为../../{当前工程}/page */
            {
                from: /(\.\.\/page)/g,
                to: '../../meal/page'
            },
            /* 从这开始删除
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
            {
                from: 'grunt_env_dev',
                to: 'grunt_env_dev'
            }
            结束 */
        ]
    }
    // ...
}
```

### http.js

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
