## 学习笔记

### Object.creat()

**使用现有的对象用来提供原型，创建一个新的对象**

#### 深拷贝
可使用该方法实现单一类型的数据深拷贝

#### 继承

原型式继承

```
var antherPerson2 = Object.create(person, {
    name: {
        value: "Frank"
    }
});
antherPerson2.friends.push("Shelby");
console.log(antherPerson2.name); // Frank

```


### 跳出双层for循环

```
let temp = 0

label: for(let i = 0; i < 5; i++) {
  for(j = 0; j < 5; j++) {
    temp += 1
    break label
  }
  temp += 1
}

console.log(temp)

```


