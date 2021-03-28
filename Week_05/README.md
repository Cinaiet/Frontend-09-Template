学习笔记

## Proxy
用于修改某些操作的默认行为.

在目标对象之前架设一层“拦截”，外界对该对象的访问，都必须先通过这层拦截，因此提供了一种机制，可以对外界的访问进行过滤和改写。

```
var proxy = new Proxy(target, handler);

var pro = new Proxy({}, {
  get(target, prop) {
    return 35
  }
})

pro.time // 35
pro.cinaiet // 35

```

作为构造函数，Proxy接受两个参数。第一个参数是所要代理的目标对象（上例是一个空对象），即如果没有Proxy的介入，操作原来要访问的就是这个对象；第二个参数是一个配置对象，对于每一个被代理的操作，需要提供一个对应的处理函数，该函数将拦截对应的操作。比如，上面代码中，配置对象有一个get方法，用来拦截对目标对象属性的访问请求。

## childNode
ChildNode 混合了所有(拥有父对象) **Node** 对象包含的公共方法和属性。其由 Element、DocumentType 和 CharacterData 对象实现。

### 属性
没有继承任何属性，也没有任何专有属性。


## Node
### childNodes 
只读属性。返回一个包含了该节点所有子节点的实时的NodeList. NodeList 是变化的。如果该节点的子节点发生了变化，NodeList对象就会自动更新。 

