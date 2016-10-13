---
title: Hessian-utfmb4-emoji表情传输（还未解决）
date: 2016-09-24 14:29:26
tags:
---


```php
<?php

$a = '🌍y🌑y🌕y🌙y🌝y🌡y🌥y🌩y🎅y🎉y🎍y🎑y🎕y🎙y🎝y🎡y🎥y🎩y🎭y🎱y🎵y🎹y🎽y🏁y🏅y🏉y🏍y🏑y🏕y🏙y🏝y🏡y🏥y🏩y🏭y🏱y🏵y🏹y🐁y🐅y🐉y🐍y🐑y🐕y🐙y🐝y🐡y🕉y🕍y🕑y🕕y🕙y🕝y🕡y🕥';


$a = explode('y', $a);

// 从java端获取到的emoji表情（字符和$a相同）
$sHex = [
    'eda0bcedbc8d',
    'eda0bcedbc91',
    'eda0bcedbc95',
    'eda0bcedbc99',
    'eda0bcedbc9d',
    'eda0bcedbca1',
    'eda0bcedbca5',
    'eda0bcedbca9',
    'eda0bcedbe85',
    'eda0bcedbe89',
    'eda0bcedbe8d',
    'eda0bcedbe91',
    'eda0bcedbe95',
    'eda0bcedbe99',
    'eda0bcedbe9d',
    'eda0bcedbea1',
    'eda0bcedbea5',
    'eda0bcedbea9',
    'eda0bcedbead',
    'eda0bcedbeb1',
    'eda0bcedbeb5',
    'eda0bcedbeb9',
    'eda0bcedbebd',
    'eda0bcedbf81',
    'eda0bcedbf85',
    'eda0bcedbf89',
    'eda0bcedbf8d',
    'eda0bcedbf91',
    'eda0bcedbf95',
    'eda0bcedbf99',
    'eda0bcedbf9d',
    'eda0bcedbfa1',
    'eda0bcedbfa5',
    'eda0bcedbfa9',
    'eda0bcedbfad',
    'eda0bcedbfb1',
    'eda0bcedbfb5',
    'eda0bcedbfb9',
    'eda0bdedb081',
    'eda0bdedb085',
    'eda0bdedb089',
    'eda0bdedb08d',
    'eda0bdedb091',
    'eda0bdedb095',
    'eda0bdedb099',
    'eda0bdedb09d',
    'eda0bdedb0a1',
    'eda0bdedb589',
    'eda0bdedb58d',
    'eda0bdedb591',
    'eda0bdedb595',
    'eda0bdedb599',
    'eda0bdedb59d',
    'eda0bdedb5a1',
    'eda0bdedb5a5',
];


echo '|表情|utf-8 bytes|服务器收到bytes|相差', PHP_EOL;
echo '|-|-|-|-', PHP_EOL;

foreach ($sHex as $key => $value) {
    $r = bin2hex($a[$key]);

    echo '|', $a[$key];
    echo '|', $r;
    echo '|', $value;

    echo '|', hexdec($value) - hexdec($r), PHP_EOL;
}
```


|表情|utf-8 bytes|服务器收到bytes|相差
|:-:|:-:|:-:|:-:
|🌍|f09f8c8d|eda0bcedbc8d|261270583259136
|🌑|f09f8c91|eda0bcedbc91|261270583259136
|🌕|f09f8c95|eda0bcedbc95|261270583259136
|🌙|f09f8c99|eda0bcedbc99|261270583259136
|🌝|f09f8c9d|eda0bcedbc9d|261270583259136
|🌡|f09f8ca1|eda0bcedbca1|261270583259136
|🌥|f09f8ca5|eda0bcedbca5|261270583259136
|🌩|f09f8ca9|eda0bcedbca9|261270583259136
|🎅|f09f8e85|eda0bcedbe85|261270583259136
|🎉|f09f8e89|eda0bcedbe89|261270583259136
|🎍|f09f8e8d|eda0bcedbe8d|261270583259136
|🎑|f09f8e91|eda0bcedbe91|261270583259136
|🎕|f09f8e95|eda0bcedbe95|261270583259136
|🎙|f09f8e99|eda0bcedbe99|261270583259136
|🎝|f09f8e9d|eda0bcedbe9d|261270583259136
|🎡|f09f8ea1|eda0bcedbea1|261270583259136
|🎥|f09f8ea5|eda0bcedbea5|261270583259136
|🎩|f09f8ea9|eda0bcedbea9|261270583259136
|🎭|f09f8ead|eda0bcedbead|261270583259136
|🎱|f09f8eb1|eda0bcedbeb1|261270583259136
|🎵|f09f8eb5|eda0bcedbeb5|261270583259136
|🎹|f09f8eb9|eda0bcedbeb9|261270583259136
|🎽|f09f8ebd|eda0bcedbebd|261270583259136
|🏁|f09f8f81|eda0bcedbf81|261270583259136
|🏅|f09f8f85|eda0bcedbf85|261270583259136
|🏉|f09f8f89|eda0bcedbf89|261270583259136
|🏍|f09f8f8d|eda0bcedbf8d|261270583259136
|🏑|f09f8f91|eda0bcedbf91|261270583259136
|🏕|f09f8f95|eda0bcedbf95|261270583259136
|🏙|f09f8f99|eda0bcedbf99|261270583259136
|🏝|f09f8f9d|eda0bcedbf9d|261270583259136
|🏡|f09f8fa1|eda0bcedbfa1|261270583259136
|🏥|f09f8fa5|eda0bcedbfa5|261270583259136
|🏩|f09f8fa9|eda0bcedbfa9|261270583259136
|🏭|f09f8fad|eda0bcedbfad|261270583259136
|🏱|f09f8fb1|eda0bcedbfb1|261270583259136
|🏵|f09f8fb5|eda0bcedbfb5|261270583259136
|🏹|f09f8fb9|eda0bcedbfb9|261270583259136
|🐁|f09f9081|eda0bdedb081|261270600032256
|🐅|f09f9085|eda0bdedb085|261270600032256
|🐉|f09f9089|eda0bdedb089|261270600032256
|🐍|f09f908d|eda0bdedb08d|261270600032256
|🐑|f09f9091|eda0bdedb091|261270600032256
|🐕|f09f9095|eda0bdedb095|261270600032256
|🐙|f09f9099|eda0bdedb099|261270600032256
|🐝|f09f909d|eda0bdedb09d|261270600032256
|🐡|f09f90a1|eda0bdedb0a1|261270600032256
|🕉|f09f9589|eda0bdedb589|261270600032256
|🕍|f09f958d|eda0bdedb58d|261270600032256
|🕑|f09f9591|eda0bdedb591|261270600032256
|🕕|f09f9595|eda0bdedb595|261270600032256
|🕙|f09f9599|eda0bdedb599|261270600032256
|🕝|f09f959d|eda0bdedb59d|261270600032256
|🕡|f09f95a1|eda0bdedb5a1|261270600032256
|🕥|f09f95a5|eda0bdedb5a5|261270600032256


```java
// 写入流
// unicode 转为 utf-8

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
      throw error("bad utf-8 encoding at " + codeName(ch));
  }
```


1. 假设一个表情为两个`char`（unicode）, write 转为 2个3字节字符（utf-8）
2. 读取
    2.1 java: parse再将此转回两个`char`（unicode），在完美端传输。
    2.2 php: 将字符作为utf-8来对待。不能和java沟通


## 参考
[unicode、utf-16、utf-8相互转换](https://cytle.github.io/2016/10/12/unicode%E3%80%81utf-16%E3%80%81utf-8%E7%9B%B8%E4%BA%92%E8%BD%AC%E6%8D%A2/)

[Emoji Unicode Tables](http://apps.timwhitlock.info/emoji/tables/unicode)

[PHP实现Unicode和Utf-8编码的互相转换](https://segmentfault.com/a/1190000003020776)
