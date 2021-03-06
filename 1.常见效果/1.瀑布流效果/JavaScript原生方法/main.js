const dataUrl = {
  data: [
    {
      src: 'http://qingmooc-v1.oss-cn-qingdao.aliyuncs.com/other/CMD.png'
    },
    {
      src: 'http://qingmooc-v1.oss-cn-qingdao.aliyuncs.com/other/CSSBOx.png'
    },
    {
      src: 'http://qingmooc-v1.oss-cn-qingdao.aliyuncs.com/other/IP6.png'
    },
    {
      src: 'http://qingmooc-v1.oss-cn-qingdao.aliyuncs.com/other/Keepalived.png'
    }
  ]
};

window.onload = function() {
  waterfall('main', 'box');
  let fn = throttle(handleOnScroll, 300);
  window.onscroll = fn;
}

function waterfall(parentId, boxClass) {
  const parent = document.getElementById(parentId);
  // 获取 parent 元素下 class 为 box 的元素
  const boxes = parent.getElementsByClassName(boxClass);

  // 计算页面的列数(页面宽/box宽)
  // box 宽 图片宽度180 + padding 20 + 边框 2 + padding15
  const boxWidth = boxes[0].offsetWidth;
  // 获取页面宽度
  const winWidth = document.documentElement.clientWidth;
  const colNumber = Math.floor(winWidth/boxWidth);

  // 设置 main 的宽度
  const mainWidth = boxWidth * colNumber;
  parent.style.width = `${mainWidth}px`;
  parent.style.margin = 'auto';

  const colsHeight = new Array(colNumber);
  for (let i = 0; i < colNumber; i += 1) {
    colsHeight[i] = boxes[i].offsetHeight;
    boxes[i].style.position = 'absolute';
    boxes[i].style.top = '0px';
    boxes[i].style.left = `${boxWidth * i}px`
  }
  for (let index = colNumber; index < boxes.length; index += 1) {
    let minCol = 0;
    for (let i = 0; i < colNumber; i += 1) {
      if (colsHeight[i] < colsHeight[minCol]) {
        minCol = i;
      }
    }
    boxes[index].style.position = 'absolute';
    boxes[index].style.top = `${colsHeight[minCol]}px`
    boxes[index].style.left = `${boxWidth * minCol}px`
    colsHeight[minCol] += boxes[index].offsetHeight;
  }
}

// 是否有滚动加载数据块的条件
function checkScrollSlide() {
  const parent = document.getElementById('main');
  const boxes = parent.getElementsByClassName('box');
  const lastBox = boxes[boxes.length - 1];
  const lastBoxHeight = lastBox.offsetTop + Math.floor(lastBox.offsetHeight / 2);

  // chrome 中 document.body.scrollTop 一直为 0
  // document.documentElement === document.getElementsByTagname('html')[0]
  const scrollTop = document.body.scrollTop || document.documentElement.scrollTop; 
  const height = document.body.clientHeight || document.documentElement.clientHeight
  const totalHeight = document.documentElement.scrollHeight;

  if (totalHeight < scrollTop + height + 100) {
    return true;
  }
  return false;
}

function handleOnScroll() {
  if (checkScrollSlide()) {
    const parent = document.getElementById('main');

    for (let index = 0; index < dataUrl.data.length; index += 1) {
      const newDiv = document.createElement('div');
      const secondDiv = document.createElement('div');
      const newImg = document.createElement('img');
      newDiv.appendChild(secondDiv);
      secondDiv.appendChild(newImg);
      newDiv.setAttribute('class', 'box');
      secondDiv.setAttribute('class', 'pic');
      newImg.setAttribute('src', dataUrl.data[index].src);
      parent.appendChild(newDiv);
    }

    waterfall('main', 'box')
  }
}

function throttle(fn, threshhold = 250) {
  let timer;
  let last = null;
  return function (...args) {
    let self = this;
    let remain = last ? threshhold - (Date.now() - last) : 0;
    clearTimeout(timer);
    if (remain > 0) {
      timer = setTimeout(function () {
        last = Date.now();
        fn.apply(self, args);
      }, remain)
    } else {
      last = Date.now();
      fn.apply(self, args);
    }
  }
}