学习笔记

## 类型转换

| | Number | String | Boolean | Undefined | Null | Object | Symbol
| ---- | ----|  ---- | ---- | ---- | ---- | ---- | ---- | 
| Number | - | | 0为false其它均为true | x | x | 封箱转换 | x
| String | | - | 空串为false其它均为true | x | x | 封箱转换 | x
| Boolean | false为0；true为1 | 'true' 'false' | - | x | x | 封箱转换 | x
| Undefined | NaN | 'Undefined' | false | - | x | x | x |
| Null | 0 | 'Null' | false | x |x |x |
| Object | valueOf | valueOf toString | true | x | x | - | x|
| Symbol | x | x | x | x | x | 封箱转换 | -|


### 拆箱转换
拆箱转换指将Object类型数据(使用toPremitive内置函数)转换为基本类型。

### 装箱转换

使用new 操作符生成内置基本类型对象去生成新的value(Symbol除外)

```
new Number(1)
new String('a')
new Boolean(true)
Symbol('123')
```