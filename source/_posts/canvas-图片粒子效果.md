---
title: canvas-图片粒子效果
date: 2017-11-23 11:35:54
tags: [前端, canvas, js]
---

<canvas id="myCanvas" style="width: 100%; height: 600px; background-color: #0c1328; cursor: pointer;"></canvas>

## 废话少说

实现以上效果需要4步

1.  读取图片
2.  对图片像素处理（偏移, 模糊...）
3.  画到画布上
4.  动画

## 1. 读取图片

![rocket](/uploads/canvas-图片粒子效果/rocket.png)

---
```js
// 新建一个image对象
const imgObj = new Image();
imgObj.onload = () => cb(imgObj);
imgObj.src = 'rocket.png';
```

## 2. 获取信息

`canvas`提供[`drawImage`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/drawImage)接口能把图片或是另一画布画在当前画布上，同时还有[`getImageData`](https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/getImageData)能从画布上获取某一块画布的信息。


```js
ctx.drawImage(imgObj, image.x, image.y, image.width, image.height); // 画到画布上

/**
 * 从画布中获取颜色值
 * { width: 100, height: 100, data: Uint8ClampedArray[40000] }
 * .data [r1, g1, b1, a1, r2, g2, b2, a2]
 */
const imageData = ctx.getImageData(image.x, image.y, image.width, image.height);

/**
 * calculateParticles
 * 偏移
 * [{ x, y, fillStyle, offsetX, offsetY, time }]
 */
const particles = calculateParticles(imageData.data, function generateStart() {
  return {
    x: canvas.width / 2,
    y: canvas.height
  }
});
```

## 3. 画到画布上

```js
function draw() {
  // 画每个点
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    // 时间
    particle.time++;

    // 设置填充颜色
    ctx.fillStyle = particle.fillStyle;
    // 绘粒子到画布上
    ctx.fillRect(
      particle.x,
      particle.y,
      2, 2);
  }
}
```

## 4. 动画

### 缓动函数

> 指定动画效果在执行时的速度，使其看起来更加真实

[![ease.png](/uploads/canvas-图片粒子效果/ease.png)](http://easings.net/zh-cn)

```js
function easeInOutExpo(t, b, c, d) {
  t /= d / 2;
  if (t < 1) return c / 2 * Math.pow(2, 10 * (t - 1)) + b;

  return c / 2 * ( -Math.pow(2, -10 * (t - 1)) + 2) + b;
}
```

```js
function draw() {
  // 画布刷新
  ctx.fillStyle = backgroundColor;
  ctx.fillRect(0, 0, width, height);

  // 画每个点
  for (let i = 0; i < particles.length; i++) {
    const particle = particles[i];
    // 时间
    particle.time++;

    // 设置填充颜色
    ctx.fillStyle = particle.fillStyle;
    // 绘粒子到画布上
    ctx.fillRect(
      easeInOutExpo(particle.time, particle.x, particle.offsetX, totalTime), // 使用 easeInOutExpo
      easeInOutExpo(particle.time, particle.y, particle.offsetY, totalTime),
      2, 2);
  }

  // 浏览器下一帧时，再绘画
  requestAnimationFrame(this.draw);
}
```

## 总结

[源码地址](https://github.com/cytle/rocket)

### 优化
效果上

-   粒子出发时间随机延迟
-   粒子最终随机偏移
-   加上拖影

性能上
-   避免不必要的Canvas绘制状态频繁切换
-   避免使用浮点数坐标


### 另一个随机效果

<canvas id="fullCanvas" style="width: 100%; height: 600px; background-color: #0c1328; cursor: pointer;"></canvas>


<script type="text/javascript">
  var Rocket = (function () {
  'use strict';

  var babelHelpers = {};
  var asyncGenerator = function () {
    function AwaitValue(value) {
      this.value = value;
    }

    function AsyncGenerator(gen) {
      var front, back;

      function send(key, arg) {
        return new Promise(function (resolve, reject) {
          var request = {
            key: key,
            arg: arg,
            resolve: resolve,
            reject: reject,
            next: null
          };

          if (back) {
            back = back.next = request;
          } else {
            front = back = request;
            resume(key, arg);
          }
        });
      }

      function resume(key, arg) {
        try {
          var result = gen[key](arg);
          var value = result.value;

          if (value instanceof AwaitValue) {
            Promise.resolve(value.value).then(function (arg) {
              resume("next", arg);
            }, function (arg) {
              resume("throw", arg);
            });
          } else {
            settle(result.done ? "return" : "normal", result.value);
          }
        } catch (err) {
          settle("throw", err);
        }
      }

      function settle(type, value) {
        switch (type) {
          case "return":
            front.resolve({
              value: value,
              done: true
            });
            break;

          case "throw":
            front.reject(value);
            break;

          default:
            front.resolve({
              value: value,
              done: false
            });
            break;
        }

        front = front.next;

        if (front) {
          resume(front.key, front.arg);
        } else {
          back = null;
        }
      }

      this._invoke = send;

      if (typeof gen.return !== "function") {
        this.return = undefined;
      }
    }

    if (typeof Symbol === "function" && Symbol.asyncIterator) {
      AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
        return this;
      };
    }

    AsyncGenerator.prototype.next = function (arg) {
      return this._invoke("next", arg);
    };

    AsyncGenerator.prototype.throw = function (arg) {
      return this._invoke("throw", arg);
    };

    AsyncGenerator.prototype.return = function (arg) {
      return this._invoke("return", arg);
    };

    return {
      wrap: function (fn) {
        return function () {
          return new AsyncGenerator(fn.apply(this, arguments));
        };
      },
      await: function (value) {
        return new AwaitValue(value);
      }
    };
  }();

  var classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  var createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();


  var objectWithoutProperties = function (obj, keys) {
    var target = {};

    for (var i in obj) {
      if (keys.indexOf(i) >= 0) continue;
      if (!Object.prototype.hasOwnProperty.call(obj, i)) continue;
      target[i] = obj[i];
    }

    return target;
  };

  babelHelpers;

  var Particle = function () {
    function Particle(_ref) {
      var x = _ref.x,
          y = _ref.y,
          fillStyle = _ref.fillStyle,
          size = _ref.size,
          start = _ref.start,
          _ref$delay = _ref.delay,
          delay = _ref$delay === undefined ? 240 : _ref$delay,
          _ref$offset = _ref.offset,
          offset = _ref$offset === undefined ? 10 : _ref$offset;
      classCallCheck(this, Particle);

      this.x = start.x;
      this.y = start.y;
      this.fillStyle = fillStyle;
      this.size = size;
      this.timeGap = 1;
      this.targetX = x;
      this.targetY = y;
      if (offset) {
        this.targetX += (Math.random() - 0.5) * offset;
        this.targetY += (Math.random() - 0.5) * offset;
      }

      this.offsetX = this.targetX - this.x;
      this.offsetY = this.targetY - this.y;

      this.initialTime = delay ? -1 * Math.random() * delay >> 0 : 0;

      this.time = this.initialTime;
      this.status = 0;
    }

    createClass(Particle, [{
      key: "reverse",
      value: function reverse() {
        this.timeGap *= -1;
      }
    }, {
      key: "nextPoint",
      value: function nextPoint(animation, totalTime) {
        this.time += this.timeGap;

        // time 小于0表示还没有画布中
        if (this.time < 0) {
          this.status = -1;
          return null;
        }

        var time = this.time,
            x = this.x,
            y = this.y,
            offsetX = this.offsetX,
            offsetY = this.offsetY;

        if (time < totalTime) {
          this.status = 0;
        } else {
          this.status = 1;
        }

        return [animation({
          now: x,
          total: offsetX,
          time: time,
          totalTime: totalTime
        }), animation({
          now: y,
          total: offsetY,
          time: time,
          totalTime: totalTime
        })];
      }
    }, {
      key: "isFinished",
      get: function get$$1() {
        return this.status === this.timeGap;
      }
    }]);
    return Particle;
  }();

  function easeInOutExpo(_ref) {
    var time = _ref.time,
        now = _ref.now,
        total = _ref.total,
        totalTime = _ref.totalTime;

    time /= totalTime / 2;
    return time < 1 ? total / 2 * Math.pow(2, 10 * (time - 1)) + now : total / 2 * (-Math.pow(2, -10 * (time - 1)) + 2) + now;
  }

  var Canvas = function () {
    function Canvas(_ref) {
      var totalTime = _ref.totalTime,
          el = _ref.el,
          _ref$globalAlpha = _ref.globalAlpha,
          globalAlpha = _ref$globalAlpha === undefined ? 0.8 : _ref$globalAlpha,
          width = _ref.width,
          height = _ref.height,
          _ref$backgroundColor = _ref.backgroundColor,
          backgroundColor = _ref$backgroundColor === undefined ? '#000' : _ref$backgroundColor;
      classCallCheck(this, Canvas);

      if (!el.getContext) {
        throw new Error('canvas.getContext 不支持');
      }
      this.ctx = el.getContext('2d');
      this.width = width || el.width;
      this.height = height || el.height;
      this.globalAlpha = globalAlpha;

      el.width = width;
      el.height = height;

      this.totalTime = totalTime;
      this.backgroundColor = backgroundColor;
    }

    createClass(Canvas, [{
      key: 'readImageData',
      value: function readImageData(_ref2, imgObj) {
        var x = _ref2.x,
            y = _ref2.y,
            width = _ref2.width,
            height = _ref2.height;
        var ctx = this.ctx;
        // 把图像绘制到画布坐标为(100,100)的地方

        ctx.drawImage(imgObj, x, y, width, height);
        // imgObj = null;
        var imageData = ctx.getImageData(x, y, width, height);
        // ctx.clearRect(0, 0, this.width, this.height); // 清除画布

        return imageData.data;
      }
    }, {
      key: 'clear',
      value: function clear() {
        var ctx = this.ctx,
            width = this.width,
            height = this.height,
            backgroundColor = this.backgroundColor;

        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
      }

      // 清空画布

    }, {
      key: 'beforeDraw',
      value: function beforeDraw() {
        var ctx = this.ctx,
            width = this.width,
            height = this.height,
            backgroundColor = this.backgroundColor,
            globalAlpha = this.globalAlpha;

        ctx.save();
        ctx.globalAlpha = globalAlpha;
        ctx.fillStyle = backgroundColor;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
      }
    }, {
      key: 'drawParticles',
      value: function drawParticles(particles) {
        var totalTime = this.totalTime,
            ctx = this.ctx;


        this.beforeDraw();
        for (var i = 0; i < particles.length; i++) {
          var particle = particles[i];
          var point = particle.nextPoint(easeInOutExpo, totalTime);
          if (point !== null) {
            ctx.fillStyle = particle.fillStyle;
            ctx.fillRect(point[0], point[1], particle.size, particle.size);
          }
        }
      }
    }]);
    return Canvas;
  }();

  function loadImage(src, cb) {
    // 新建一个image对象
    var imgObj = new Image();
    imgObj.onload = function () {
      return cb(imgObj);
    };
    // 设置image的source
    imgObj.src = src;
  }

  var Rocket = function () {
    function Rocket(_ref) {
      var _ref$totalTime = _ref.totalTime,
          totalTime = _ref$totalTime === undefined ? 120 : _ref$totalTime,
          el = _ref.el,
          _ref$width = _ref.width,
          width = _ref$width === undefined ? 800 : _ref$width,
          _ref$height = _ref.height,
          height = _ref$height === undefined ? 400 : _ref$height,
          globalAlpha = _ref.globalAlpha,
          backgroundColor = _ref.backgroundColor,
          options = objectWithoutProperties(_ref, ['totalTime', 'el', 'width', 'height', 'globalAlpha', 'backgroundColor']);
      classCallCheck(this, Rocket);

      this.draw = this.draw.bind(this);
      // 获取canvas元素
      this.canvas = new Canvas({
        totalTime: totalTime,
        el: el,
        width: width,
        height: height,
        globalAlpha: globalAlpha,
        backgroundColor: backgroundColor
      });
      this.setOptions(options);
    }

    createClass(Rocket, [{
      key: 'setOptions',
      value: function setOptions(_ref2) {
        var _ref2$maxCols = _ref2.maxCols,
            maxCols = _ref2$maxCols === undefined ? 100 : _ref2$maxCols,
            _ref2$maxRows = _ref2.maxRows,
            maxRows = _ref2$maxRows === undefined ? 50 : _ref2$maxRows,
            _ref2$particleDelay = _ref2.particleDelay,
            particleDelay = _ref2$particleDelay === undefined ? 0 : _ref2$particleDelay,
            _ref2$particleOffset = _ref2.particleOffset,
            particleOffset = _ref2$particleOffset === undefined ? 0 : _ref2$particleOffset,
            _ref2$particleSize = _ref2.particleSize,
            particleSize = _ref2$particleSize === undefined ? 2 : _ref2$particleSize,
            _ref2$repeat = _ref2.repeat,
            repeat = _ref2$repeat === undefined ? false : _ref2$repeat,
            _ref2$startFrom = _ref2.startFrom,
            startFrom = _ref2$startFrom === undefined ? 'full' : _ref2$startFrom;

        this.maxCols = maxCols;
        this.maxRows = maxRows;
        this.particleDelay = particleDelay;
        this.particleOffset = particleOffset;
        this.particleSize = particleSize;
        this.repeat = repeat;
        this.startFrom = startFrom;
      }
    }, {
      key: 'drawImage',
      value: function drawImage(src, options) {
        var _this = this;

        // this.setOptions(options);
        this.startFrom = options.startFrom;

        loadImage(src, function (imgObj) {
          var canvas = _this.canvas;
          _this.image = {
            width: imgObj.width,
            height: imgObj.height,
            x: (canvas.width - imgObj.width) / 2,
            y: (canvas.height - imgObj.height) / 2
          };
          var imageData = canvas.readImageData(_this.image, imgObj);
          var generateStart = _this.startFrom === 'full' ? _this.fullParticlesStart() : _this.onePointParticlesStart();

          _this.particles = _this.calculateParticles(imageData, {
            generateStart: generateStart
          });

          canvas.clear();
          _this.stop();

          _this.draw();
        });
      }
    }, {
      key: 'stop',
      value: function stop() {
        cancelAnimationFrame(this.requestID);
      }
    }, {
      key: 'fullParticlesStart',
      value: function fullParticlesStart() {
        var _canvas = this.canvas,
            width = _canvas.width,
            height = _canvas.height;

        return function () {
          return {
            x: Math.random() * width,
            y: Math.random() * height
          };
        };
      }
    }, {
      key: 'onePointParticlesStart',
      value: function onePointParticlesStart() {
        var canvas = this.canvas;
        var image = this.image;
        var start = {
          x: canvas.width / 2,
          y: Math.min(canvas.height, image.y + image.height + 300)
        };
        return function () {
          return start;
        };
      }
    }, {
      key: 'calculateParticles',
      value: function calculateParticles(imageData, _ref3) {
        var generateStart = _ref3.generateStart;

        var particles = [];
        var _image = this.image,
            imageX = _image.x,
            imageY = _image.y,
            imageW = _image.width,
            imageH = _image.height;

        var cols = this.maxCols;
        var rows = this.maxRows;
        var cellWidth = imageW / cols;
        var cellHeight = imageH / rows;
        var round = Math.round;
        for (var i = 0; i < cols; i++) {
          for (var j = 0; j < rows; j++) {
            var x = round(i * cellWidth);
            var y = round(j * cellHeight);

            // 计算(i,j)在数组中的R的坐标值
            var pos = (y * imageW + x) * 4;

            // 判断像素透明度值是否符合要求
            if (imageData[pos + 3] <= 100) {
              continue;
            }

            // 符合要求的粒子保存到数组里
            particles.push(new Particle({
              x: imageX + x,
              y: imageY + y,
              fillStyle: 'rgb(' + imageData[pos] + ', ' + imageData[pos + 1] + ', ' + imageData[pos + 2] + ')',
              start: generateStart(),
              size: this.particleSize,
              delay: this.particleDelay,
              offset: this.particleOffset
            }));
          }
        }
        return particles;
      }
    }, {
      key: 'draw',
      value: function draw() {
        var particles = this.particles;
        if (particles.every(function (p) {
          return p.isFinished;
        })) {
          if (!this.repeat) {
            console.info('finish');
            return;
          }
          for (var i = 0; i < particles.length; i++) {
            particles[i].reverse();
          }
        }

        this.canvas.drawParticles(particles);

        // 下一帧绘画
        this.requestID = requestAnimationFrame(this.draw);
      }
    }]);
    return Rocket;
  }();

  return Rocket;

  }());
</script>

<script type="text/javascript">
  (function () {
    var rocket;
    var canvas = document.getElementById('myCanvas');

    function rocketToggle () {
      if (rocket) {
        rocket.stop();
      } else {
        rocket = new Rocket({
          el: canvas,
          width: canvas.parentElement.clientWidth,
          height: 600,
          maxCols: 100,
          maxRows: 100,
          backgroundColor: '#0c1328',
          particleDelay: 240,
          particleOffset: 10,
          particleSize: 2,
          globalAlpha: 0.6,
          repeat: false,
        });
      }
      rocket.drawImage('/uploads/canvas-图片粒子效果/rocket.png', {
        startFrom: 'onePoint'
      });
      isStarted = true;
    }
    canvas.addEventListener('click', rocketToggle);
  }())
</script>


<script type="text/javascript">
  (function () {
    var rocket;
    var canvas = document.getElementById('fullCanvas');

    function rocketToggle () {
      if (rocket) {
        rocket.stop();
      } else {
        rocket = new Rocket({
          el: canvas,
          width: canvas.parentElement.clientWidth,
          height: 600,
          maxCols: 100,
          maxRows: 100,
          backgroundColor: '#0c1328',
          particleDelay: 240,
          particleOffset: 10,
          particleSize: 2,
          globalAlpha: 0.6,
          repeat: false,
        });
      }
      rocket.drawImage('/uploads/canvas-图片粒子效果/rocket.png', {
        startFrom: 'full'
      });
      isStarted = true;
    }
    canvas.addEventListener('click', rocketToggle);
  }())
</script>
