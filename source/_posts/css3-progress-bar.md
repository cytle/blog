---
title: css3 progress bar
date: 2017-02-18 13:46:16
tags: [css, 前端]
---

### 实现的效果

<div class="progress-bar"></div>

### 原理

1.  用css3的`linear-gradient`在节点的背景上画一个渐变效果;
2.  **给背景一个动画**
3.  结束

### 源码


```html

<div class="progress-bar"></div>

<style type="text/css">
  @keyframes progress_bar_key_frames {
    from {
      transform: translateX(-100%);
    }
    to {
      transform: translateX(100%);
    }
  }
  @keyframes progress_bar_scale {
    from {
      transform: scaleX(0);
    }
    to {
      transform: scaleX(1);
    }
  }
  .progress-bar {
    width: 100%;
    height: 20px;
    background-color: white;
    overflow: hidden;
    position: relative;
  }

  .progress-bar:before, .progress-bar:after {
    height: 100%;
    display: block;
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
  }
  .progress-bar:before {
    background-color: #3ba776;
    transform-origin: left center;
    transform: scaleX(1);
    /*transition: transform 1s ease-out;*/
    animation: progress_bar_scale 20s infinite;
  }
  .progress-bar:after {
    background-repeat: no-repeat;
    animation: progress_bar_key_frames 2s ease-out infinite;
    /*// animation-direction: alternate;*/
    background-image: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 90%, transparent 100% );
  }
</style>

```

<style type="text/css">
@keyframes progress_bar_key_frames {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(100%);
  }
}
@keyframes progress_bar_scale {
  from {
    transform: scaleX(0);
  }
  to {
    transform: scaleX(1);
  }
}
.progress-bar {
  width: 100%;
  height: 20px;
  background-color: white;
  overflow: hidden;
  position: relative;
}

.progress-bar:before, .progress-bar:after {
  height: 100%;
  display: block;
  content: '';
  position: absolute;
  top: 0px;
  left: 0px;
  width: 100%;
}
.progress-bar:before {
  background-color: #3ba776;
  transform-origin: left center;
  transform: scaleX(1);
  /*transition: transform 1s ease-out;*/
  animation: progress_bar_scale 20s infinite;
}
.progress-bar:after {
  background-repeat: no-repeat;
  animation: progress_bar_key_frames 2s ease-out infinite;
  /*// animation-direction: alternate;*/
  background-image: linear-gradient(90deg, transparent 0%, rgba(255, 255, 255, 0.6) 90%, transparent 100% );
}
</style>
