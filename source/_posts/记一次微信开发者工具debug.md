---
title: 记一次微信开发者工具debug
date: 2017-06-18 00:39:28
tags: chrome nwjs 微信开发者工具
---

在维护的项目[Linux微信web开发者工具](https://github.com/cytle/wechat_web_devtools)中，有多个issues报小程序请求返回不成功，并且终端报异常

```
[7031:7031:0601/201040:ERROR:CONSOLE(1588)] "TypeError: Cannot read property 'certificateDetailsPromise' of undefined TypeError: Cannot read property 'certificateDetailsPromise' of undefined
    at r (<anonymous>:1:1116)
    at WebInspector.NetworkManager.dispatchEventToListeners (chrome-devtools://devtools/bundled/inspector.js:737:185)
    at WebInspector.NetworkDispatcher.responseReceived (chrome-devtools://devtools/bundled/inspector.js:7384:236)
    at Object.dispatch (chrome-devtools://devtools/bundled/inspector.js:4608:63)
    at WebInspector.MainConnection.dispatch (chrome-devtools://devtools/bundled/inspector.js:4548:31)
    at WebInspector.MainConnection._dispatchMessage (chrome-devtools://devtools/bundled/inspector.js:10773:7)
    at WebInspector.Object.dispatchEventToListeners (chrome-devtools://devtools/bundled/inspector.js:737:185)
    at innerDispatch (chrome-devtools://devtools/bundled/inspector.js:1588:58)
    at InspectorFrontendAPIImpl._dispatch (chrome-devtools://devtools/bundled/inspector.js:1587:1)
    at DevToolsAPIImpl._dispatchOnInspectorFrontendAPI (devtools_compatibility.js:62:21)
    at DevToolsAPIImpl.dispatchMessage (devtools_compatibility.js:147:14)", source: chrome-devtools://devtools/bundled/inspector.js (1588)
```

## 原因和解决方式如下：

**本文运行环境为**

- nw.js: linux 0.19.4 chrome版本55
- 小程序: 0.17.172600

在`package.nw/app/dist/inject/devtools.js`中有如下代码，

```js
var a, r = function(e) {
  /**
   * @typedef {WebInspector.NetworkRequest}
   */
  var t = e.data;
  a || (a = document.getElementsByTagName("iframe")[0]);
  // 1. 请求的安全信息
  var n = t.securityDetails(),
    o = { command: "securityDetails", url: t.url, statusCode: t.statusCode, remoteAddress: t._remoteAddress };
  if (n) {
    o.protocol = n.protocol, o.securityState = t.securityState();
    new Date;
    // 0. 在运行时t.target()并没有对象networkManager，在此引发错误
    t.target().networkManager.certificateDetailsPromise(n.certificateId).then(function(e) {
        var t = e.issuer ? e.issuer.toLocaleLowerCase() : "";
        t.indexOf("rapidssl") === -1
        && t.indexOf("symantec") === -1
        && t.indexOf("geotrust") === -1
        && t.indexOf("thawte") === -1
        && t.indexOf("trustasia") === -1
        || (o.securityState = "secure");
        a.contentWindow.postMessage(o, "*")
    })
  } else
      a.contentWindow.postMessage(o, "*")
};
```

在注释0处发生上文终端所报异常,利用`nw --remote-debugging-port=9222`进行远程debug,
打印出`t`,类型为`WebInspector.NetworkRequest`，t.target()类型为`WebInspector.Target`
并没有属性`networkManager`，因此运行时类似

```js
undefined.certificateDetailsPromise(n.certificateId).then(/* ... */)
```

根据`WebInspector`、`NetworkRequest`关键词能找到这里用的是chrome开发者工具的sdk，
项目地址为[devtools-frontend](https://github.com/ChromeDevTools/devtools-frontend)

在此项目下，关键词`certificateDetailsPromise`出现的地方只有一处[front_end/security/SecurityPanel.js:361](https://github.com/ChromeDevTools/devtools-frontend/blob/c03abd24fb64d646bc4845699b7ff428dddbd507/front_end/security/SecurityPanel.js#L361)

```js
/**
 * @typedef {Object}
 * @property {!Protocol.Security.SecurityState} securityState - Current security state of the origin.
 * @property {?Protocol.Network.SecurityDetails} securityDetails - Security details of the origin, if available.
 * @property {?Promise<>} *certificateDetailsPromise* - Certificate details of the origin.
 * @property {?Security.SecurityOriginView} originView - Current SecurityOriginView corresponding to origin.
 */
Security.SecurityPanel.OriginState;
```


`Security.SecurityPanel.OriginState`离我们的`WebInspector.NetworkRequest`有点距离，**而解决这类问题我的宗旨是尽量少改源码**，这条路有点远先放一旁。

上文异常代码中，在`certificateDetailsPromise`的then中获得到数据就是`issuer`

```js
var t = e.issuer ? e.issuer.toLocaleLowerCase() : "";
```

那么issuer是什么含义呢？

在`devtools-frontend`搜索下

这个关键字只出现了一次在
[front_end/security/SecurityPanel.js:907](https://github.com/ChromeDevTools/devtools-frontend/blob/c03abd24fb64d646bc4845699b7ff428dddbd507/front_end/security/SecurityPanel.js#L907)

```
table.addRow(Common.UIString('Issuer'), originState.securityDetails.issuer);
```

而这里的`originState.securityDetails`和上文注释1处获取的`t.securityDetails()`好像是同一个，惊不惊喜，意不意外！！

```
  var n = t.securityDetails(),
```
使用远程断点，看到`n`变量真有属性`issuer`,值为:"TrustAsia DV SSL CA - G5"

既然如此，现在的sdk是不是想让我们直接使用`securityDetails`，而不用通过`certificateDetailsPromise`来获取`issuer`呢？

将有问题的代码，修改为以下代码

```js
// 声明issuer
var issuer, t = e.data;

a || (a = document.getElementsByTagName("iframe")[0]);
var n = t.securityDetails(),
  o = { command: "securityDetails", url: t.url, statusCode: t.statusCode, remoteAddress: t._remoteAddress };
if (n) {
  console.error(n);

  o.protocol = n.protocol, o.securityState = t.securityState();
  new Date;
  // 移除certificateDetailsPromise，从n取issuer
  issuer = n.issuer ? n.issuer.toLocaleLowerCase() : "";
  issuer.indexOf("rapidssl") === -1
  && issuer.indexOf("symantec") === -1
  && issuer.indexOf("geotrust") === -1
  && issuer.indexOf("thawte") === -1
  && issuer.indexOf("trustasia") === -1
  || (o.securityState = "secure"), a.contentWindow.postMessage(o, "*")
} else
  a.contentWindow.postMessage(o, "*")
```

*6/23更新: 为了替换更方便使用如下方式替换*

`t.target().networkManager.certificateDetailsPromise(n.certificateId)` 替换为 `Promise.resolve(n)`

```js
var a, r = function(e) {
  var t = e.data;
  a || (a = document.getElementsByTagName("iframe")[0]);
  var n = t.securityDetails(),
    o = { command: "securityDetails", url: t.url, statusCode: t.statusCode, remoteAddress: t._remoteAddress };
  if (n) {
    o.protocol = n.protocol, o.securityState = t.securityState();
    new Date;
    Promise.resolve(n).then(function(e) {
        var t = e.issuer ? e.issuer.toLocaleLowerCase() : "";
        t.indexOf("rapidssl") === -1
        && t.indexOf("symantec") === -1
        && t.indexOf("geotrust") === -1
        && t.indexOf("thawte") === -1
        && t.indexOf("trustasia") === -1
        || (o.securityState = "secure");
        a.contentWindow.postMessage(o, "*")
    })
  } else
      a.contentWindow.postMessage(o, "*")
};
```

运行成功


## 总结

查了下，`issuer`是指域名型证书型号，而TrustAsia（亚洲诚信）是一证书机构，"TrustAsia DV SSL CA - G5"是证书型号。


```js
  issuer.indexOf("rapidssl") === -1
  && issuer.indexOf("symantec") === -1
  && issuer.indexOf("geotrust") === -1
  && issuer.indexOf("thawte") === -1
  && issuer.indexOf("trustasia") === -1
  || (o.securityState = "secure")
```

rapidssl、symantec、geotrust、thawte和trustasia一样是各证书机构。
这部分代码的意思是只有当`issuer`中有这些机构关键字，就认为是有证书的，把`securityState`设置为"secure"，然后把信息传给业务层。

**这次还有个需要纠结的地方是`networkManager.certificateDetailsPromise()`为毛没了，而小程序在用，mac和windows下没有问题，这是以后linux微信小程序升级需要注意的地方。**
