---
title: Promise 介绍
date: 2017-11-23 15:10:07
tags: [前端, js, Promise]
---

# 基础介绍

> Promise 对象用于一个异步操作的最终完成（或失败）及其结果值的表示。(简单点说就是处理异步请求。我们经常会做些承诺，如果我赢了你就嫁给我，如果输了我就嫁给你之类的诺言。这就是promise的中文含义：诺言，一个成功，一个失败。)
>
> --- [MDN-Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)

Promise表示一个异步操作的结果，与之进行交互的方式主要是`then`方法，该方法注册了两个回调函数，用于接收`promise`的终值或本`promise`不能执行的原因。

如下代码：

```js
var p = new Promise(function(resolve, reject){ // executor
  if (Math.random() < 0.5) {
    resolve('终值'); // fulfill
  } else {
    reject('据因'); // reject
  }
});

p.then(
  function(value){  // onFulfilled
    console.log(value);
  },
  function(reason){ // onRejected
    console.log(reason);
  }
);
```

`new Promise`实例化一个Promise，其第一个构造参数`executor`是一个带有`resolve`和`reject`两个参数的函数，`executor`函数在Promise构造函数返回新建对象前被调用，被传递`resolve`和`reject`函数。`resolve`和`reject`函数被调用时，分别将promise的状态改为fulfilled（完成）或rejected（失败）。`executor`内部通常会执行一些异步操作，一旦完成，可以调用`resolve`函数来将promise状态改成fulfilled，或者在发生错误时将它的状态改为rejected。

-   **接受（fulfill）**：指一个`promise`成功时进行的一系列操作，如状态的改变、回调的执行。虽然规范中用`fulfill`来表示接受，但在后世的`promise`实现多以`resolve`来指代之。
-   **拒绝（reject）**：指一个`promise`失败时进行的一系列操作。
-   **终值（eventual value）**：所谓终值，指的是`promise`被接受时传递给解决回调的值，由于`promise`有一次性的特征，因此当这个值被传递时，标志着`promise`等待态的结束，故称之终值，有时也直接简称为值（value）。
-   **据因（reason）**：也就是拒绝原因，指在`promise`被拒绝时传递给拒绝回调的值。

## 三个状态

三个状态：未被决议、完成、拒绝，决议完状态不再改变

-   pending: 等待态，移至执行态或拒绝态
-   fulfilled: 接受态，不能迁移至其他任何状态，必须拥有一个**不可变**的终值
-   rejected: 拒绝态，不能迁移至其他任何状态，必须拥有一个**不可变**的据因

这里的不可变指的是恒等（即可用 === 判断相等），而不是意味着更深层次的不可变（译者注：指当 value 或 reason 不是基本值时，只要求其引用地址相等，但属性值可被更改）。

![promise](https://mdn.mozillademos.org/files/8633/promises.png)

如下代码:

```js
var p = new Promise(function(resolve, reject) {
  resolve(42);
  reject('reason')
});
p.then(function(v) {
  console.log(v); // 42
});
p.then(function(v) {
  console.log(v); // 还是42
});
p.catch(function(reason) {
  console.log(reason); // 不会执行
});
```

变量`p`为一个已经决议的`promise`，它的决议状态（`PromiseStatus`）一直都是resolved，值一直未`42`。

## Then

一个`promise`必须提供一个`then`方法以访问其当前值、终值和据因。

```js
promise.then(onFulfilled, onRejected)
```

### 参数

-   onFulfilled：当Promise变成接受状态（fulfilled）时，该参数被调用。该函数有一个参数，即接受的值。
-   onRejected：当Promise变成拒绝状态（rejected）时，该参数被调用。该函数有一个参数，即拒绝的原因。

### 返回值

> then方法返回一个Promise，而它的行为与then中的回调函数的返回值有关：
>
> -   如果`then`中的回调函数返回一个值，那么`then`返回的Promise将会成为接受状态，并且将返回的值作为接受状态的回调函数的参数值。
> -   如果`then`中的回调函数抛出一个错误，那么`then`返回的Promise将会成为拒绝状态，并且将抛出的错误作为拒绝状态的回调函数的参数值。
> -   如果`then`中的回调函数返回一个已经是接受状态的Promise，那么`then`返回的Promise也会成为接受状态，并且将那个Promise的接受状态的回调函数的参数值作为该被返回的Promise的接受状态回调函数的参数值。
> -   如果`then`中的回调函数返回一个已经是拒绝状态的Promise，那么`then`返回的Promise也会成为拒绝状态，并且将那个Promise的拒绝状态的回调函数的参数值作为该被返回的Promise的拒绝状态回调函数的参数值。
> -   如果`then`中的回调函数返回一个未定状态（pending）的Promise，那么`then`返回Promise的状态也是未定的，并且它的终态与那个Promise的终态相同；同时，它变为终态时调用的回调函数参数与那个Promise变为终态时的回调函数的参数是相同的。

如下代码:

```js
var p1 = new Promise(function(resolve, reject) { // executor
  if (Math.random() < 0.5) {
    resolve('终值'); // fulfill
  } else {
    reject('据因'); // reject
  }
});

var p2 = p1.then(
  function(value) {  // onFulfilled
    console.log(value);
    return new Promise(function(resolve) {
      resolve(42);
    });
  },
  function(reason){ // onRejected
    console.log(reason);
    return 21;
  }
);

p2.then(function(value) {
  console.log(value); // 42 或是 21
}, function(reason) {
  console.log(reason); // 不会执行
})
```

-   如果`onFulfilled`不是函数且`p1`成功执行，`p2`必须成功执行并返回相同的值
-   如果`onRejected`不是函数且`p1`拒绝执行，`p2`必须拒绝执行并返回相同的据因

如下`p1`成功执行，`p2`的`onFulfilled`不是函数，`p2`返回相同的值：

```js
var p1 = Promise.resolve('终值'); // 等价于 new Promise(function(resovle) { resovle('终值') });
var p2 = p1.then(
  undefined,
  function(reason){ // onRejected
    console.log(reason);
    return 21;
  }
);

p2.then(function(value) {
  console.log(value); // '终值'
});
```

## catch

```js
var p1 = Promise.resolve('终值');

p1.then(
  undefined,
  function(reason){ // onRejected
    console.log(reason);
    return 21;
  }
);

// 和上面等价
p1.catch(
  function(reason){ // onRejected
    console.log(reason);
    return 21;
  }
);
```

## resolve

构造参数`executor`的`resolve`和`Promise.resolve`接受一个参数（和then中的回调函数返回值处理流程一样）：

-   传递的**不为**`promise`或`thenable`，则返回一个决议成功的promise，结果为传入的参数
-   传递的**为**`promise`或`thenable`，则返回此对象，无论是否已经决议

```js
var p = Promise.resolve(123);
console.log(Promise.resolve(p) === p);; // true
```

### Promise.resolve

如上文所说，`Promise.resolve`提供一个简便的方法来得到**接受的**`promise`

```js
Promise.resolve('终值');
// 和上面等价
new Promise(function(resovle) { resovle('终值') });
```

### Promise.reject

类似`Promise.reject`是一个简便的方法来得到**拒绝的**`promise`

```js
Promise.reject('终值');
// 和上面等价
new Promise(function(resovle, reject) { reject('据因') });
```

构造参数`executor`的`resolve`和`Promise.resolve`接受一个参数，无论改参数是何种状态的`promise`还是普通值，都将其作为`据因`

# 其它细节

## resolve和reject只接受一个参数

-   如果使用多个参数，第一个参数之后的所有参数都会被忽略
-   如果没有参数，`value`或`reason`则为undefined

## 没有决议，永远被挂着，不会执行

```js
new Promise((resolve, reject) => {

}).then((res) => {
  console.log(res); // 不会执行
}, (res) => {
  console.log(res); // 不会执行
});
```

## 异步链式流

`then`返回一个promise，可以链式调用：

```js
function getLocation() {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      resolve({ latitude: 88, longitude: 30 });
      // reject(new Error('获取失败'));
    }, 1000)
  });
}

function getNearShops(location) {
  // 根据location查询附近的店
  return new Promise(function() {
    resolve([{ name: '五六面馆', id: 1, location }]);
    // reject(new Error('获取失败'));
  });
}

getLocation()
  .then(getNearShops)
  .then((nearShops) => {
    console.log(nearShops);
  })
  .catch((err) => {
    console.error(err); // log
  });
```

## 更复杂的异步链式流

使用`Promise`我们能更清晰、更自信把功能拆分，不用担心回调被过多调用

```js
function confirm(content) {
  return new Promise(function(resolve, reject) {
    model.confirm(content, ({ ok }) => {
      if (ok) {
        resolve();
      } else {
        reject(new Error('用户取消'));
      }
    })
  })
}

var isAuthorizedLocation = false;
function authorizeLocation() {
  if (isAuthorizedLocation) {
    return Promise.resolve();
  }
  return confirm('是否授权定位') // 请求用户授权
    .then(() => {
      return new Promise(function(resolve, reject) { // 授权
        // 去授权
        resolve();
        reject(new Error('授权失败'));
      });
    });
}

authorizeLocation() // 1. 授权
  .then(getLocation) // 2. 获取定位
  .then(getNearShops) // 3. 请求附近的店
  .then((nearShops) => {
    console.log(nearShops);
  })
  .catch((err) => {
    console.error(err); // log
  });
```

## 被吞掉的异常

以下代码会造成`ReferenceError`，然而没有处理。

```js
new Promise(function(resolve, reject) {
  resolve(a.b); // 运行后会提示 Uncaught (in promise) ReferenceError: a is not defined
  // reject('123'); // 提示 Uncaught (in promise) 123
})
.then(function(v) {
  console.log(v);
});
```

被拒绝的`promise`如果没有`catch`处理控制台会提示错误信息，但是不影响代码段继续执行，
这就是被吞掉的异常。被吞掉的异常较难察觉，无法记录。因此推荐所有的`promise`最后都加上`catch`;

```js
new Promise(function(resolve, reject) {
  resolve(a.b); // 运行后会提示 Uncaught (in promise) ReferenceError: a is not defined
  // reject('123'); // 提示 Uncaught (in promise) 123
})
.then(function(v) {
  console.log(v);
})
.catch(function(err) {
  console.error(err);
});
```

## Promise.all([])

`Promise.all`返回一个`promise`，只有在传入`Promise.all`**所有**`promise`都**完成**，
返回的`promise`才会完成，并且其*终值*为所有`promise`的*终值*组成的数组。
如果有**任何**`promise`被**拒绝**，你只会得到第一个拒绝`promise`的`据因`。
这种模式被称为`门`： 只有所有人都到齐，门才会开。

```js
var p1 = Promise.resolve(3);
var p2 = 1337; // 参数不是promise时, 表示解决
var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "foo");
});
Promise.all([p1, p2, p3]).then(values => {
    console.log(values); // [3, 1337, "foo"]
});

// 加入被拒绝的promise
var p4 = Promise.all([p1, p2, p3, Promise.reject(555)]);

setTimeout(function() {
  console.log(p4); // Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: 555}
});
```

## Promise.race([])

对于`Promise.race`来说，返回的`promise`只取决于只有第一个被**决议**的`promise`，
并且其结果和被**决议**的`promise`相同。这种模式被称为`门闩`：第一个到达者，打开门闩。

```js
var p1 = Promise.resolve(3);
var p2 = 1337; // 参数不是promise时, 表示解决
var p3 = new Promise((resolve, reject) => {
    setTimeout(resolve, 100, "foo");
});
Promise.race([p1, p2, p3]).then(value => {
    console.log(value); // 3
});

// 加入被拒绝的promise
var p4 = Promise.race([p1, p2, p3, Promise.reject(555)]);
var p5 = Promise.race([Promise.reject(555), p1, p2, p3]);

setTimeout(function() {
  console.log(p4); // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 3}
  console.log(p5); // Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: 555}
});
```

**注意**：如果`Promise.race`被传入空数组会被挂住，永远不会被决议，而`Promise.all`会立即完成。

## 执行时间

[【翻译】Promises/A+规范](http://www.ituring.com.cn/article/66566)中对此解释的很清楚：

> **注1** 这里的平台代码指的是引擎、环境以及`promise`的实施代码。实践中要确保`onFulfilled`和`onRejected`方法异步执行，且应该在`then`方法被调用的那一轮事件循环之后的新执行栈中执行。这个事件队列可以采用“宏任务（macro-task）”机制或者“微任务（micro-task）”机制来实现。由于`promise`的实施代码本身就是平台代码（**译者注：** 即都是 JavaScript），故代码自身在处理在处理程序时可能已经包含一个任务调度队列。
>
> **译者注：** 这里提及了`macrotask`和`microtask`两个概念，这表示异步任务的两种分类。在挂起任务时，JS引擎会将所有任务按照类别分到这两个队列中，首先在`macrotask`的队列（这个队列也被叫做`task queue`）中取出第一个任务，执行完毕后取出`microtask`队列中的所有任务顺序执行；之后再取`macrotask`任务，周而复始，直至两个队列的任务都取完。
>
> 两个类别的具体分类如下：
>
> -   **macro-task:** script（整体代码）, `setTimeout`, `setInterval`, `setImmediate`, I/O, UI rendering
> -   **micro-task:** `process.nextTick`, `Promises`（这里指浏览器实现的原生 Promise）, `Object.observe`, `MutationObserver`
>
> 详见[stackoverflow 解答](http://stackoverflow.com/questions/25915634/difference-between-microtask-and-macrotask-within-an-event-loop-context) 或 [这篇博客](http://wengeezhang.com/?p=11)
>
> --- [【翻译】Promises/A+规范 注1](http://www.ituring.com.cn/article/66566)


补充一句：在处理微任务`microtask`时，他们可以排队更多的微任务，这些微任务都将被逐个运行，直到微任务队列耗尽。然后在再取`macrotask`任务。

考虑以下代码：

```js
var p1 = new Promise(function(resovle) { // executor
  console.log('resolved'); // 1. resolved
  resovle([1, 2, 3]);
});

p1
  .then(function(values) { // 第一个onFulfilled
    console.log(values); // 3. [1, 2, 3]
    return values.reduce(function(p, v) {
      return p + v;
    }, 0); // 求和
  })
  .then(function(sum) { // 第二个onFulfilled
    console.log(sum); // 5. 6
    throw new Error('据因');
  })
  .catch(function(reason) { // onRejected
    console.log(reason); // 6. '据因'
  });

p1.then(function () { // 第三个onFulfilled
  console.log('第三个onFulfilled'); // 4. '第三个onFulfilled'
});

console.log('同步执行'); // 2. Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 3}

setTimeout(function() {
  console.log('setTimeout'); // 7. setTimeout
});
```

序号表示控制台打印的顺序，可以看出`executor`是同步执行的，在`console.log('同步执行')`执行后，
第一个`onFulfilled`、第三个`onFulfilled`、第二个`onFulfilled`和`onRejected`陆续执行，最后才是`setTimeout`被执行。

再考虑以下代码，下面的示例展示了`Promise.all`的异步(当传递的可迭代对象是空时，是同步的)：

```js
var p1 = Promise.resolve(3);
var p2 = 1337;
var p3 = Promise.all([p1, p2]);

console.log(p3); // 1. Promise {[[PromiseStatus]]: "pending", [[PromiseValue]]: undefined}
console.log(Promise.all([])); // 2. Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: Array(0)}
setTimeout(function() {
  console.log(p3); // 3. Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: 3}
});
```

可以看出`p3`在即使`p1`和`p2`都是被**接受**的情况下还是**未决议**状态。
当script（整体代码）执行完成后，引擎再会去处理`p3`的决议（`microtask`）。
所有的`microtask`都处理完成后，再执行下一个`macrotask`（setTimeout）。

# 参考

-   [【翻译】Promises/A+规范](http://www.ituring.com.cn/article/66566)
-   [MDN-Promise](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Promise)
-   [task-queue](https://html.spec.whatwg.org/multipage/webappapis.html#task-queue)
