---
title: HessianJava从U+10000到U+10FFFF的码位传输错误
date: 2016-09-24 14:29:26
tags: Hessian UTF-8-MB4 unicode UTF-16
---

> 这段时间使用Hessian传递数据，发现有很多大坑。年久失修的Hessian的PHP实现库在64位下传递数字错误
> 连连。之前还发现了传递emoji表情出现了问题，这几天终于追踪到问题所在。


## 现象说明

使用PHP作为client调用Java开发的Server，返回的字符串中含有不能被json编码的字符，表现为实际的字符
串为「你好🌍，abc！」，经过HessianJava和HessianPHP后，结果输出为「你好������，abc！」，除了
这个「🌍」emoji表情外其它的字符都能正确输出。比较奇怪的是Java到Java没有问题。

我先在数据库中写了一堆emoji表情，然后在hessian2parse解析字符串的地方拦截其收到内容，打印它们的字节

|表情|Unicode|UTF-16|UTF-8 bytes|服务器收到bytes
|:-|:-|:-|:-|:-
|🌍|1 F3 0D|D8 3C DF 0D|F0 9F 8C 8D|ED A0 BC ED BC 8D
|🐁|1 F4 01|D8 3D DC 01|F0 9F 90 81|ED A0 BD ED B0 81

这里选择部分打印出来

Hessian协议在传递数据时用的字符编码是UTF-8，可变长度，有效的压缩了数据长度，从上面的表格可以发现应
该是4字节的UTF-8，结果变成6字节，而HessianPHP这边对utf8字符串几乎没有什么处理，这么搞，字符串肯
定是乱码的。


## 找问题

`HessianPHP`这边对字符几乎的0处理，当然如果当前环境是别的字符集，会将字符串转码。但发现
`HessianPHP`读字符串时，只对1-3字节的UTF-8字符有识别，对4字节的UTF-8没有处理。如果把PHP这边同
时作为服务和客户端测试时，也出现bug，长度读取不对。

```php
<?php
  // 修改后
    function readUTF8Bytes($len){
        $string = $this->read($len);
        $pos = 0;
        $pass = 1;

        while($pass <= $len){
            $charCode = ord($string[$pos]);
            if($charCode < 0x80){
                $pos++;
            } elseif(($charCode & 0xe0) == 0xc0){
                $pos += 2;
                $string .= $this->read(1);
            } elseif (($charCode & 0xf0) == 0xe0) {
                $pos += 3;
                $string .= $this->read(2);
            } else
            // 在此加入4字节字符识别，参考UTF-8编码规则
            if (($charCode & 0xf8) == 0xf0) {
                $pos += 4;
                $string .= $this->read(3);
            }
            $pass++;
        }

        if(! HessianUtils::isInternalUTF8()){
            $string = utf8_decode($string);
        }

        return $string;
    }
?>
```

这么修改后，php之间的传递就没有问题了。详细的UTF-8说明参考这，
[wiki:UTF-8](https://zh.wikipedia.org/wiki/UTF-8)



再看Java部分前，有一个背景需要知道，从1.5版开始，Java储存字符使用`UTF-16`的方式，
每个char长度为2Bytes。可以参考[wiki:UTF-16](https://zh.wikipedia.org/wiki/UTF-16)，了解其编码方式。


> 在Unicode的零号平面(BMP)中，**UTF-16数值等价于对应的码位**。
> Unicode中除了BMP外，还有16个辅助平面，码位为U+10000到U+10FFFF。在UTF-16中被编码为一对16比特长的码元（即32bit,4Bytes）。

简而言之，就是像ASCII字符、中文字符等这些在零号平面中的字符在Java中由一个char（2Bytes）表示，
而emoji这样在辅助平面上的字符由2个char（4Bytes）表示，理论上能实现所有的Unicode字符编码了。


看看Java这边的处理，以下是写入部分
```java
  /**
   * Prints a string to the stream, encoded as UTF-8
   *
   * @param v the string to print.
   */
  public void printString(String v, int strOffset, int length)
    throws IOException
  {
    int offset = _offset;
    byte []buffer = _buffer;

    for (int i = 0; i < length; i++) {
      if (SIZE <= offset + 16) {
        _offset = offset;
        flushBuffer();
        offset = _offset;
      }

      char ch = v.charAt(i + strOffset);

      if (ch < 0x80)
        buffer[offset++] = (byte) (ch);
      else if (ch < 0x800) {
        buffer[offset++] = (byte) (0xc0 + ((ch >> 6) & 0x1f));
        buffer[offset++] = (byte) (0x80 + (ch & 0x3f));
      }
      else {
        buffer[offset++] = (byte) (0xe0 + ((ch >> 12) & 0xf));
        buffer[offset++] = (byte) (0x80 + ((ch >> 6) & 0x3f));
        buffer[offset++] = (byte) (0x80 + (ch & 0x3f));
      }
    }

    _offset = offset;
  }
```

这部分代码的目的是将字符串从Java下的字符串（UTF-32）转为UTF-8编码，但明显它只能满足在BMP上码位的
转码，不能支持辅助平面。

再来看看读的部分
```java
  /**
   * Parses a single UTF8 character.
   */
  private int parseUTF8Char()
    throws IOException
  {
    int ch = _offset < _length ? (_buffer[_offset++] & 0xff) : read();

    if (ch < 0x80)
      return ch;
    else if ((ch & 0xe0) == 0xc0) {
      int ch1 = read();
      int v = ((ch & 0x1f) << 6) + (ch1 & 0x3f);

      return v;
    }
    else if ((ch & 0xf0) == 0xe0) {
      int ch1 = read();
      int ch2 = read();
      int v = ((ch & 0x0f) << 12) + ((ch1 & 0x3f) << 6) + (ch2 & 0x3f);

      return v;
    }
    else
      throw error("bad UTF-8 encoding at " + codeName(ch));
  }
```
Hessian是按UTF-8编码传输，在这个方法中应该是将UTF-8转为UTF-16，按照UTF-8编码方案这里没有处理4字节的字符。

由于写入的函数只是将每一个字符单独转成UTF-8字符，可能由两个char表示一个字符的，也这样分别被转成两个
UTF-8字符。读取部分，也是这么分别读，最后获取到的char没有问题，弄拙成巧，Java-Java部分就正常传输了。

## 解决


## 说明
本文使用的`HessianPHP`版本为`v2.0.3`，源码来源于此
[HessianPHP](https://code.google.com/archive/p/hessianphp/downloads)

`Java`的Hessian包版本为`4.0.37`，源码来源于此
[hessian-4.0.37-src.jar](http://hessian.caucho.com/download/hessian-4.0.37-src.jar)


## 参考

[使用 Java 语言进行 Unicode 代理编程](https://www.ibm.com/developerworks/cn/java/j-unicode/)

[Unicode、UTF-16、UTF-8相互转换](https://cytle.github.io/2016/10/12/unicode%E3%80%81UTF-16%E3%80%81UTF-8%E7%9B%B8%E4%BA%92%E8%BD%AC%E6%8D%A2/)

[Emoji Unicode Tables](http://apps.timwhitlock.info/emoji/tables/unicode)

