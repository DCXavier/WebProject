function Game() {
  this.dom = {
    "box": $('#box'),
    "btn": $('#startBtn'),
    "mask": $('#mask'),
  };
  this.color = {
    'red': 'red',
    'lightblue': 'lightblue',
  };
  this.block = {
    'height': 120,
    'num': 1
  };
  this.row = [];
  this.colArr = [];
  this.score = 0;
  this.container = $('<div></div>');
  this.timer;
  this.timerTwo;
  this.setSeconds = 10;
  this.flag = false;
  this.count = 0;
  this.btn = $('<button>PLAY</button>');
  this.bindStartEvent();
}

/**
 * 绑定游戏开始事件
 */
Game.prototype.bindStartEvent = function () {
  let that = this;
  this.dom.mask.append(this.btn);

  this.btn.addClass('btn');
  this.btn.on('click', function () {
    that.dom.mask.css('display', 'none');
    that.init();
  });
};

/**
 * 游戏初始化
 */
Game.prototype.init = function () {
  this.addBlock();
  this.container.addClass('container');
  this.container.css('height', this.block.height * this.block.num + 'px');
  this.container.css('top', -120 + 'px');
  this.dom.box.append(this.container);

  let that = this;
  this.timer = setInterval(function () {
    that.container.css('top', parseInt(that.container.css('top')) + 1 + 'px');
    if (parseInt(that.container.css('top')) === 0) {
      if (that.block.num < 6) {
        if (that.block.num === 5) {
          that.isGameOver();
        }
        that.block.num++;
      }
      else if (that.block.num === 6) {
        that.isGameOver();
        if (that.flag && parseInt(that.container.css('bottom')) === -that.block.height) {
          $(that.row[0]).remove();
          that.row.shift();
          that.colArr.shift();
        }
      }
      that.addBlock();
      // 这里的判断是为了设置游戏结束标准
      // ----删除掉这部分则视为 当方块完全通过底边才游戏结束，反之，则在底边就判断是否结束
      if (that.block.num === 6) {
        that.isGameOver();
      }
      that.container.css('height', that.block.num * that.block.height + 'px');
      that.container.css('top', -that.block.height + 'px');

      if (that.count % 5 === 0 && that.setSeconds > 0 && that.count !== 0) {
        that.setSeconds--;
        clearInterval(that.timer);
        that.init();
      }
    }
  }, that.setSeconds);

};

/**
 * 判断方块是否在最底端未被点击
 */
Game.prototype.isGameOver = function () {
  let that = this;
  for (let j = 0; j < that.colArr[0].length; j++) {
    if (String($(that.colArr[0][j]).css('backgroundColor')) !== 'rgba(0, 0, 0, 0)' &&
      String($(that.colArr[0][j]).css('backgroundColor')) !== 'rgb(233, 233, 233)') {
      clearInterval(that.timer);
      $(that.dom.mask).empty();
      let gameOver = $('<h1>Game Over</h1> <br />' +
        '<h2>Score: ' + (that.score) + '</h2>');

      gameOver.addClass('gameover');
      that.dom.mask.append(gameOver);
      that.dom.mask.css('display', 'block');
    }
    // 在这里面 判断是否被点击
    that.flag = String($(that.colArr[0][j]).css('backgroundColor')) === 'rgba(0, 0, 0, 0)' ||
      String($(that.colArr[0][j]).css('backgroundColor')) === 'rgb(233, 233, 233)';
  }
};

/**
 * 添加方块
 */
Game.prototype.addBlock = function () {
  //this.colArr[0] = this.col;
  for (let i = this.row.length; i < this.block.num; i++) {
    let random = Math.floor(Math.random() * 4);
    let randomColor = Math.floor(Math.random() * 2 + 1);
    this.row[i] = $('<div></div>');
    this.colArr[i] = [];
    for (let j = 0; j < 4; j++) {
      let that = this;
      this.colArr[i][j] = $('<div></div>');
      this.colArr[i][j].addClass('col');
      this.row[i].append(this.colArr[i][j]);
      this.colArr[i][j].on('click', function (event) {
        event.preventDefault();
        if (String($(event.target).css('backgroundColor')) !== 'rgba(0, 0, 0, 0)' &&
          String($(event.target).css('backgroundColor')) !== 'rgb(233, 233, 233)') {
          $(event.target).css('background', '#e9e9e9');
          that.score = (++that.count) * 5;
        }
        else {
          clearInterval(that.timer);
          $(that.dom.mask).empty();
          let gameOver = $('<h1>Game Over</h1> <br /><h2>Score: ' + (that.score) + '</h2>');
          gameOver.addClass('gameover');
          that.dom.mask.append(gameOver);
          that.dom.mask.css('display', 'block');
        }
      });
    }
    switch (randomColor) {
      case 1:
        this.colArr[i][random].css('background', this.color.red);
        break;
      case 2:
        this.colArr[i][random].css('background', this.color.lightblue);
        break;
      default:
        break;
    }
    this.row[i].addClass('row');
    this.container.prepend(this.row[i]);
  }
};

let newGame = new Game();