---
title: ngrok-使用
date: 2016-10-19 23:55:28
tags: mac ngrok
---

### 安装ngrok客户端

mac下使用brew安装(来自cask)

```shell
$ brew cask install ngork
```

### 得到一个服务器

#### 直接使用ngrok.com

比较坑，需要翻墙。代理的域名也要翻墙访问。。

[ngrok.com注册](https://dashboard.ngrok.com/user/signup)

ngrok.com会提供一个`authtoken`


#### 这里应该有配置自己的服务器
挖一个坑

### 启动

在客户端终端执行
```shell
$ ngrok authtoken xxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

绑定本地端口，并且启动
```shell
$ ngrok http 80
```

访问http://127.0.0.1:4040/可以看到ngrok运行状态


![界面截图](/uploads/ngrok-使用/界面截图.png)
