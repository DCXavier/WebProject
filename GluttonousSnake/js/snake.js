/**
 * 蛇的初始化构造函数
 * @constructor 蛇的初始化
 */
function SnakeInit() {
  this.flag = {
    'startFlag': true,
    'result': true,
    'keyFlag': true
  };
  this.dom = {
    'audio': document.getElementById('sound'),
    'startBtn': document.getElementById('startBtn'),
    'snake': document.getElementById('snake'),
    'body': document.getElementById('snake').children,
    'canvas': document.getElementById('canvas'),
    'food': document.getElementById('food'),
    'score': document.getElementById('score'),
    'level': document.getElementById('level'),
    'mask': document.getElementById('canvas_mask'),
    'restart': document.getElementById('restart')
  };
  this.step = 30;
  this.direct = '';
  this.perDirect = 'right';
  this.scoreCount = 0;
  this.setLevel = 1;
  this.setSecond = 400;
  this.snakeArr = [{
      x: 0,
      y: 0
    }, {
      x: 30,
      y: 0
    }, {
      x: 60,
      y: 0
    }, {
      x: 90,
      y: 0
    }];
  this.headArr = {x: 90, y: 0};
  this.timer;
  this.deleteArr = this.snakeArr[0];
  this.random = [{}];
  this.dom.audio.volume = 0.1;
  this.bindStartEvent();
}

/**
 * 游戏载入原型方法
 */
SnakeInit.prototype.init = function () {
  this.paintSnake();
  this.random = this.setFood();
  this.flag.startFlag = false;
  this.move('right');
  this.bindKeyEvent();
};
/**
 * 绘制蛇的身体原型方法
 */
SnakeInit.prototype.paintSnake = function () {

  for (let i = 0; i < this.snakeArr.length; i++) {
    this.dom.body[i].style.top = this.snakeArr[i].y + 'px';
    this.dom.body[i].style.left = this.snakeArr[i].x + 'px';
  }
};
/**
 * 绑定开始按钮原型方法
 */
SnakeInit.prototype.bindStartEvent = function () {
  let that = this;
  this.dom.startBtn.addEventListener('click', function () {
    if (that.flag.startFlag) {
      that.init();
      that.dom.snake.style.display = 'block';
    }
  });
};
/**
 * 绑定键盘事件原型方法
 */
SnakeInit.prototype.bindKeyEvent = function () {
  let that = this;
  let direct = this.direct;
  document.addEventListener('keydown', function () {
    event.preventDefault();

    if (event.key === 'ArrowUp' && that.direct !== 'down' && that.direct !== 'up') {
      if (that.flag.keyFlag && direct !== 'up') {
        direct = 'up';
        that.move('up');
      }
    }
    else if (event.key === 'ArrowDown' && that.direct !== 'up' && that.direct !== 'down') {
      if (that.flag.keyFlag && direct !== 'down') {
        direct = 'down';
        that.move('down');
      }
    }
    else if (event.key === 'ArrowLeft' && that.direct !== 'right' && that.direct !== 'left') {
      if (that.flag.keyFlag && direct !== 'left') {
        direct = 'left';
        that.move('left');
      }
    }
    else if (event.key === 'ArrowRight' && that.direct !== 'left' && that.direct !== 'right') {
      if (that.flag.keyFlag && direct !== 'right') {
        direct = 'right';
        that.move('right');
      }
    }
  });
};
/**
 * 蛇的移动原型方法
 * @returns {boolean} 返回判断是否超过边界的结果布尔值，true则为未过边界，false则超过边界
 * @param dir
 */
SnakeInit.prototype.move = function (dir) {
  let headBody = this.dom.body[this.dom.body.length - 1];
  let head = this.headArr;
  if (this.timer) {
    clearInterval(this.timer);
  }

  let that = this;

  this.timer = setInterval(function () {
    let width = that.dom.canvas.offsetWidth;
    let height = that.dom.canvas.offsetHeight;
    that.levelUp(dir);
    // 先移动，再判断
    switch (dir) {
      case 'left':
        that.direct = dir;
        headBody.style.transform = "rotate(0deg)";
        headBody.style.backgroundImage = "url('images/head-left.png')";
        head.x -= that.step;
        break;
      case 'right':
        that.direct = dir;
        headBody.style.transform = "rotate(0deg)";
        headBody.style.backgroundImage = "url('images/head-right.png')";
        head.x += that.step;
        break;
      case 'up':

        if (that.direct === 'left') {
          headBody.style.transform = "rotate(90deg)";
        }
        else if (that.direct === 'right') {
          headBody.style.transform = "rotate(270deg)";
        }
        that.direct = dir;
        head.y -= that.step;
        break;
      case 'down':
        if (that.direct === 'left') {
          headBody.style.transform = "rotate(270deg)";
        }
        else if (that.direct === 'right') {
          headBody.style.transform = "rotate(90deg)";
        }
        that.direct = dir;
        head.y += that.step;
        break;
    }
    // 判断是否撞墙
    that.flag.result = !(head.x < 0 || head.y < 0 || head.x > (width - that.step) || head.y > (height - that.step));

    if (that.flag.result) {
      that.deleteArr = that.snakeArr.shift();
      that.snakeArr.push({x: that.headArr.x, y: that.headArr.y});
      that.paintSnake();
    }
    else {
      that.gameOver();
      clearInterval(that.timer);
    }

    for (let i = 0; i < that.snakeArr.length - 1; i++) {
      if (that.snakeArr[i].x === that.headArr.x && that.snakeArr[i].y === that.headArr.y) {
        that.flag.startFlag = true;
        that.gameOver();
        clearInterval(that.timer);
      }
    }



    if (that.headArr.x === that.random.x && that.headArr.y === that.random.y) {
      that.scoreCount++;
      that.dom.score.innerText = that.scoreCount * 10;
      that.growLength(that.deleteArr);
      that.random = that.setFood();
      that.dom.audio.play();
    }
  },this.setSecond);
};
/**
 * 游戏升级原型方法
 */
SnakeInit.prototype.levelUp = function (dir) {
  if (this.scoreCount >= 5 && this.scoreCount < 10) {
    this.setSecond = 350;
    this.setLevel = 2;
  }
  else if (this.scoreCount >= 10 && this.scoreCount < 15) {
    this.setSecond = 300;
    this.setLevel = 3;
  }
  else if (this.scoreCount >= 15 && this.scoreCount < 20) {
    this.setSecond = 250;
    this.setLevel = 4;
  }
  else if (this.scoreCount >= 20) {
    this.setSecond = 200;
    this.setLevel = 5;
  }
  if (this.scoreCount >= 5) {
    this.dom.level.innerText = this.setLevel;
    this.move(dir);
  }
};
/**
 * 设置食物原型方法
 * @returns {{x: number, y: number}} 返回食物所在位置的布尔值
 */
SnakeInit.prototype.setFood = function () {
  let randomX = Math.floor(Math.random() * (this.dom.canvas.offsetWidth / this.step)) * this.step;
  let randomY = Math.floor(Math.random() * (this.dom.canvas.offsetHeight / this.step)) * this.step;
  this.dom.food.style.left = randomX + 'px';
  this.dom.food.style.top = randomY + 'px';
  this.dom.food.style.display = 'block';

  return {x: randomX, y: randomY};
};
/**
 * 蛇的身体增长原型方法
 * @param node 增长的节点数据
 */
SnakeInit.prototype.growLength = function (node) {
  this.snakeArr.unshift(node);
  let target = this.dom.body[0];
  let li = document.createElement('li');

  this.dom.snake.insertBefore(li, target);
  this.dom.snake.children[0].style.left = this.snakeArr[0].x + 'px';
  this.dom.snake.children[0].style.top = this.snakeArr[0].y + 'px';
};
/**
 * 游戏结束后还原游戏原始数据原型方法
 */
SnakeInit.prototype.gameOver = function () {
  let that = this;
  let headBody = this.dom.body[this.dom.body.length - 1];
  this.dom.mask.className = "canvas_mask";
  this.dom.audio.src = 'sound/end.wav';
  this.dom.audio.play();
  that.flag.keyFlag = false;

  this.dom.restart.addEventListener('click', function () {
    that.dom.mask.className = '';
    headBody.style.backgroundImage = "url('images/head-right.png')";
    headBody.style.transform = "rotate(0deg)";
    if (that.scoreCount > 0) {
      for (let i = 0; i < that.scoreCount ; i++) {
        that.dom.snake.removeChild(that.dom.snake.children[0]);
      }
    }

    that.dom.score.innerText = '0';
    that.scoreCount = 0;
    that.setLevel = 1;
    that.dom.level.innerText = that.setLevel;
    that.setSecond = 400;
    that.dom.food.style.display = 'none';
    that.dom.audio.pause();
    that.dom.audio.src = 'sound/move.wav';
    that.dom.snake.style.display = 'none';
    that.snakeArr = [
      {
        x: 0,
        y: 0
      },
      {
        x: 30,
        y: 0
      },
      {
        x: 60,
        y: 0
      },
      {
        x: 90,
        y: 0
      }
    ];
    that.direct = 'right';
    that.headArr = {x: 90, y: 0};
    that.flag.result = true;
    that.flag.startFlag = true;
    that.flag.keyFlag = true;
    that.paintSnake(that.snakeArr);
  });
};

let snake = new SnakeInit();
