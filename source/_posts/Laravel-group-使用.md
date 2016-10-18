---
title: Laravel-group-使用
date: 2016-10-17 18:19:55
tags:
---


group接受这几个属性，namespace、prefix、where、as。同时group可以嵌套使用。

以下两段代码功能相同

```php
<?php
    Route::group(['prefix' => 'users', 'namespace' => 'User'], function($router)
    {
        Route::post('', [
            'as' => '新增用户',
            'uses' => 'UserController@store'
            ]);

        Route::get('{id}', [
            'as' => '用户详情',
            'uses' => 'UserController@show'
            ])->where(['id' => '\\d+']);
    });
?>
```


```php
<?php
    Route::post('users', [
        'as' => '新增用户',
        'uses' => 'User\UserController@store'
        ]);

    Route::get('users\{id}', [
        'as' => '用户详情',
        'uses' => 'User\UserController@show'
        ])->where(['id' => '\\d+']);
?>
```
