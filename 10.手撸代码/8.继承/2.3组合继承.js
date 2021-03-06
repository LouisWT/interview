// 组合继承其实就是将类式继承和构造函数继承结合起来使用

function Parent(y) {
  this.y = y;
  this.a = [];
}

Parent.prototype.say = function() {
  console.log(this.y);
}

function Child(y) {
  this.z = 3;
  Parent.call(this, y);
}

Child.prototype = new Parent();

Child.prototype.saya = function() {
  console.log(this.a);
}

let c1 = new Child(1);
let c2 = new Child(2);

// 1
c1.say();
// 2
c2.say();

c1.a.push('a');
// [ 'a' ]
c1.saya();
// []
c2.saya();

// true
console.log(c1 instanceof Object)
// true
console.log(c1 instanceof Parent)
// true
console.log(c1 instanceof Child)

// 优点：
// 结合了前两种方法的优点，并且没有那两种方法的三个缺点

// 缺点：
// 它调用了两次父类的函数