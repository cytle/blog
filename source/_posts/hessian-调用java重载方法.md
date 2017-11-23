---
title: Hessian-调用java重载方法
date: 2016-09-24 10:02:13
tags: [Hessian, java, php, 方法重载, unsafeDeserialize]
---

> 重载(overloading) 是在一个类里面，方法名字相同，而参数不同。返回类型可以相同也可以不同。每个重
> 载的方法（或者构造函数）都有一个独一无二的参数类型列表。

### 问题

Hessian的客户端（调用者，如PHP）不能也不会识别调用的参数类型，从而传递相应的参数列表。另一方面java
端接受请求后，只通过方法名和参数数量来取得方法。

在使用像php这样的弱类型语言通过`Hessian`调用java端服务时，重载方法的使用存在问题。

### 源码查看
下面来看服务端的源码：

#### 产生方法列表

```java
// com.caucho.services.server.AbstractSkeleton

  protected AbstractSkeleton(Class apiClass)
  {
    _apiClass = apiClass;
    Method []methodList = apiClass.getMethods();

    for (int i = 0; i < methodList.length; i++) {
      Method method = methodList[i];

      // put 方法名
      if (_methodMap.get(method.getName()) == null)
        _methodMap.put(method.getName(), methodList[i]);

      Class []param = method.getParameterTypes();

      // put 方法名 + 参数数量
      String mangledName = method.getName() + "__" + param.length;
      _methodMap.put(mangledName, methodList[i]);

      // put 方法名 + 每个参数类型(不完整的类型名)
      _methodMap.put(mangleName(method, false), methodList[i]);
    }
  }

  //...

  public static String mangleName(Method method, boolean isFull)
  {
    StringBuffer sb = new StringBuffer();

    sb.append(method.getName());

    // 获取方法的参数列表
    Class []params = method.getParameterTypes();
    for (int i = 0; i < params.length; i++) {
      sb.append('_');

      // 参数的类型
      sb.append(mangleClass(params[i], isFull));
    }

    return sb.toString();
  }
```

在上面这段程序中，我们可以知道hessian按以下三种方式作为key存了方法

- 方法名
- 方法名 + 参数数量
- 方法名 + 每个参数类型(不完整的类型名)

#### 获取方法
```java
// com.caucho.hessian.server.HessianSkeleton extends AbstractSkeleton

  // ...
  // Line 247,254
    Method method;
    // 通过方法名 + 参数数量 获取
    method = getMethod(methodName + "__" + argLength);

    // 通过方法名获取
    if (method == null)
      method = getMethod(methodName);
```

### 例子
当有以下一个接口时

```java
public interface TestService {

    public String getName(User user);

    public String getName(int uid);
}
```

将产生以下方法

- getName
- getName__1
- getName_User
- getName_int

如果我们在客户端中调用时

```php
<?php

getUser(1);

// 假设 $user 是一个对象
getUser($user);
```

这样调用，java端会选择同一个方法，getName__1，可能是`getName(User user)`或者
`getName(int uid)`，很有可能就报`unsafeDeserialize`异常了。

在使用这样参数数量相同的重载方法时，按照java端的获取规则，我们可以这么调用

```php
<?php

getUser_int(1);

// 直接跟上参数类型
getUser_User($user);

// 如果多个继续在后面加尾缀，类型大小写和java一致
// getUser_User_int_String($user);
```

这样就可以完美调用重载的方法了。



