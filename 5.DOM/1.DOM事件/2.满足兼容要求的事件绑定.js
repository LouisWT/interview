// DOM0级的写法兼容性很好，缺点在于每个事件只有一个事件处理函数
// DOM2级的写法，分为IE浏览器的 addEvent 和 别的浏览器的 addEventListener，同时 IE 事件处理程序的this指向window，而非被绑定事件的元素

// 1. 简单写法
function addEvent(elm, evType, fn, useCapture) {
  if (elm.addEventListener) {
    elm.addEventListener(evType, fn, useCapture);//DOM2.0
    return true;
  }
  else if (elm.attachEvent) {
    var r = elm.attachEvent('on' + evType, fn);//IE5+
    return r;
  }
  else {
    elm['on' + evType] = fn;//DOM 0
  }
}

// 2. 复杂写法
function addEvent(element, type, handler) {
  if (!element.events) element.events = {};

  //获得事件处理程序队列
  let handlers = element.events[type];

  if (!handlers) {
    // 如果没有，创建一个事件处理程序的队列
    handlers = [];
    element.events[type] = handlers;

    //存储存在的事件处理函数(如果有)，之后会对这个方法进行覆盖
    if (element["on" + type]) {
      handlers.push(element["on" + type]);
    }
  }

  //将事件处理函数存入队列
  handlers.push(handler);

  // 替换兼容性最好的 DOM0 绑定方法 
  element["on" + type] = handleEvent;
};

// 当发生事件时，事件处理函数就是下面这个函数
// 如果是正常浏览器，this 是拥有这个事件处理函数的元素
// 如果是 IE，this 是 window 对象
function handleEvent(event) {
  // 抓取事件对象，IE使用全局事件对象
  event = event || fixEvent(window.event);
  // 取得事件处理程序队列
  const handlers = this.events[event.type];

  let returnValue = true;
  // 执行每个处理函数
  for (let handler of handlers) {
    if (handler.call(this, event) === false) {
      returnValue = false;
    }
  }
  return returnValue;
}

function fixEvent(event) {
  // 对IE polyfill 标准方法
  event.preventDefault = function () {
    this.returnValue = false;
  };
  event.stopPropagation = function () {
    this.cancelBubble = true;
  };
  return event;
}

function removeEvent(element, type, handler) {
  if (element.events && element.events[type]) {
    const handlers = element.events[type];
    const index = handlers.indexOf(handler);
    if (index === -1) {
      return;
    }
    handlers.splice(index, 1);
    // 递归的移除，防止一个事件处理函数对一个type进行了多次注册的情况
    return removeEvent(element, type, handler)
  }
}