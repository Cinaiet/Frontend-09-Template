学习笔记


## CSS 分类

### @rule

- @media  媒体查询
- @import 引入...
- @page   分页媒体(打印)
- @charset  声明css的字符集
- @keyframes  css3动画
- fontface  设置字体样式
- supports  检查兼容性
- namespace 命名空间
- counter-style 计数器样式(类似于 li标签前面的点)

### rule

#### 选择器

- '*'
- class
- id
- tagname
- [attr=val]
- :active
- ::before 


#### 声明

键值对
```
如 font-size: 16px
```

## 思考题 

first-letter 选择每个首字母，为其设置样式。

first-line 于选取指定选择器的首行。
个人认为，first-letter中使用float确定首个文字的布局开销较小；
        而first-line是操作于一整行，不同的宽度首行选中的字节多少也不一样，使用float脱离文本流开销较大。

