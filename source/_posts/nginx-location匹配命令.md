---
title: nginx-location匹配命令
date: 2016-10-11 14:02:09
tags: nginx
---

## location匹配命令

|符合|说明|
|:-:|:-|
|~|波浪线表示执行一个正则匹配，区分大小写|
|~*|表示执行一个正则匹配，不区分大小写|
|^~|^~表示普通字符匹配，如果该选项匹配，只匹配该选项，不匹配别的选项，一般用来匹配目录|
|=|进行普通字符精确匹配|
|@|"@" 定义一个命名的 location，使用在内部定向时，例如 error_page, try_files|


### location 匹配的优先级(与location在配置文件中的顺序无关)

= 精确匹配会第一个被处理。如果发现精确匹配，nginx停止搜索其他匹配。
普通字符匹配，正则表达式规则和长的块规则将被优先和查询匹配，也就是说如果该项匹配还需去看有没有正则表达式匹配和更长的匹配。

^~ 则只匹配该规则，nginx停止搜索其他匹配，否则nginx会继续处理其他location指令。
最后匹配理带有"~"和"~*"的指令，如果找到相应的匹配，则nginx停止搜索其他匹配；当没有正则表达式或者没有正则表达式被匹配的情况下，那么匹配程度最高的逐字匹配指令会被使用。

#### location 优先级官方文档

Directives with the = prefix that match the query exactly. If found, searching stops.
All remaining directives with conventional strings, longest match first. If this match used the ^~ prefix, searching stops.

Regular expressions, in order of definition in the configuration file.
If #3 yielded a match, that result is used. Else the match from #2 is used.

=前缀的指令严格匹配这个查询。如果找到，停止搜索。

所有剩下的常规字符串，最长的匹配。如果这个匹配使用^〜前缀，搜索停止。

正则表达式，在配置文件中定义的顺序。

如果第3条规则产生匹配的话，结果被使用。否则，如同从第2条规则被使用。


例如

```nginx
location  = / {
  # 只匹配"/".
  # [ configuration A ]
}
location  / {
  # 匹配任何请求，因为所有请求都是以"/"开始
  # 但是更长字符匹配或者正则表达式匹配会优先匹配
  # [ configuration B ]
}
location ^~ /images/ {
  # 匹配任何以 /images/ 开始的请求，并停止匹配 其它location
  # [ configuration C ]
}
location ~* .(gif|jpg|jpeg)$ {
  # 匹配以 gif, jpg, or jpeg结尾的请求.
  # 但是所有 /images/ 目录的请求将由 [Configuration C]处理.
  # [ configuration D ]
}
```

请求URI例子:

/ -> 符合configuration A

/documents/document.html -> 符合configuration B

/images/1.gif -> 符合configuration C

/documents/1.jpg ->符合 configuration D

@location 例子
```nginx
error_page 404 = @fetch;

location @fetch(
  proxy_pass http://fetch;
)
```

转载请保留: http://www.nginx.cn/115.html
