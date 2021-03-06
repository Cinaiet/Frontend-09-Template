学习笔记

## 字符串算法分析
### 字典树 (Trie Tree)
- 精确匹配
- 用于大量高重复字符串的储存与分析
- 最大限度地减少无谓的字符串比较，查询效率比哈希表高

字典树又称单词字典树、查找树。是一种树形结构，哈希树的变种。
#### 性质
- 根节点不包含字符，除根节点外每一个节点都只包含一个字符。
- 从根节点到某一节点，路径上经过的字符连接起来，为该节点对应的字符串。
- 每个节点的所有子节点包含的字符都不相同。
### KMP
- 部分匹配
- 检查一个长字符串中有没有短字符串的部分

#### 原理
1. 根据模式串(查找的数据)算出跳表表格
2. 利用跳表表格，拿原串(原数据)与模式串比较
### Wildcard 
- 在KMP基础上增加了通配符
- ? 表示匹配任意字符；*表示匹配任意数量的任意字符
### 正则
- 正则一般来说都是需要用到回溯的一个系统
- 它可以说是字符串通用模式匹配的终极版本
### 状态机
- 通用的字符串分析
- 与正则表达式相比，状态机会更强大
- 正则表达式与有限状态机在理论上是完全等价的两种东西
- 但是有限状态机不同的是，我们还可以往里面嵌代码，还可以给字符串做而外的处理
- 正则写起来很方便，有限状态机写起来成本比较高
### LL LR
- 在简单的匹配和分析的基础上，如果我们要对字符串建立多层级的结构，我们就会使用 LL 和 LR 这样的语法分析的算法
