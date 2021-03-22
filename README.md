# ant-fe-interview

## 试题一

```ts
<!-- 给定 CSV 文件，转换成树结构 -->
interface Person {
  name: string;
  age: number; 
  parent: Person[]; 
  children: Person[];
}

const csv = `
name,age,parent
Bob,30,David
David,60,
Anna,10,Bob
`;
```

### [code](https://github.com/liuvigongzuoshi/ant-fe-interview/tree/main/01)

## 试题二

- 实现一个前端缓存模块，模块支持设置最大容量，超出容量时采用LRU机制，主要用于缓存xhr返回的结果，避免多余的网络请求浪费，要求：
  - 生命周期为一次页面打开
  - 如果有相同的请求同时并行发起，要求其中一个能挂起并且等待另外一个请求返回并读取该缓存
  - LRU机制当缓存容量达到上限时，它应该在写入新数据之前删除最久未使用的数据值，从而为新的数据值留出空间。

### [online preview](https://liuvigongzuoshi.github.io/ant-fe-interview/02/index.html)

## 试题三

在一个html canvas画布上绘制上百个圆，点击其中的一个圆，将其绘制在最上面（原先的绘制不保留），并设置不同的颜色

### [online preview](https://liuvigongzuoshi.github.io/ant-fe-interview/03/index.html)