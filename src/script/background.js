class Background {
    constructor() {

    }
    start() {
        function Dotline(option) {
            this.opt = this.extend({
                dom: 'J_dotLine', //画布id
                cw: 1000, //画布宽
                ch: 800, //画布高
                ds: 100, //点的个数
                r: 0.5, //圆点半径
                cl: '#000', //颜色
                dis: 100 //触发连线的距离
            }, option);
            this.c = document.getElementById(this.opt.dom); //canvas元素id
            this.ctx = this.c.getContext('2d');
            this.c.width = this.opt.cw; //canvas宽
            this.c.height = this.opt.ch; //canvas高
            this.dotSum = this.opt.ds; //点的数量
            this.radius = this.opt.r; //圆点的半径
            this.disMax = this.opt.dis * this.opt.dis; //点与点触发连线的间距
            this.color = this.color2rgb(this.opt.cl); //设置粒子线颜色
            this.dots = [];
            //requestAnimationFrame控制canvas动画
            var RAF = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || function (callback) {
                window.setTimeout(callback, 1000 / 60);
            };
            var _self = this;
            //增加鼠标效果
            var mousedot = {
                x: null,
                y: null,
                label: 'mouse'
            };
            this.c.onmousemove = function (e) {
                var e = e || window.event;
                mousedot.x = e.clientX - _self.c.offsetLeft - 50;
                mousedot.y = e.clientY - _self.c.offsetTop;
            };
            this.c.onmouseout = function (e) {
                mousedot.x = null;
                mousedot.y = null;
            }
            //控制动画
            this.animate = function () {
                _self.ctx.clearRect(0, 0, _self.c.width, _self.c.height);
                _self.drawLine([mousedot].concat(_self.dots));
                RAF(_self.animate);
            };
        }
        //合并配置项，es6直接使用obj.assign();
        Dotline.prototype.extend = function (o, e) {
            for (var key in e) {
                if (e[key]) {
                    o[key] = e[key]
                }
            }
            return o;
        };
        Dotline.prototype.color2rgb = function (colorStr) {
            var red = null,
                green = null,
                blue = null;
            var cstr = colorStr.toLowerCase(); //变小写
            var cReg = /^#[0-9a-fA-F]{3,6}$/; //确定是16进制颜色码
            if (cstr && cReg.test(cstr)) {
                if (cstr.length == 4) {
                    var cstrnew = '#';
                    for (var i = 1; i < 4; i++) {
                        cstrnew += cstr.slice(i, i + 1).concat(cstr.slice(i, i + 1));
                    }
                    cstr = cstrnew;
                }
                red = parseInt('0x' + cstr.slice(1, 3));
                green = parseInt('0x' + cstr.slice(3, 5));
                blue = parseInt('0x' + cstr.slice(5, 7));
            }
            return red + ',' + green + ',' + blue;
        }
        //画点
        Dotline.prototype.addDots = function () {
            var dot;
            for (var i = 0; i < this.dotSum; i++) { //参数
                dot = {
                    x: Math.floor(Math.random() * this.c.width) - this.radius,
                    y: Math.floor(Math.random() * this.c.height) - this.radius,
                    ax: (Math.random() * 2 - 1) / 1.5,
                    ay: (Math.random() * 2 - 1) / 1.5
                }
                this.dots.push(dot);
            }
        };
        //点运动
        Dotline.prototype.move = function (dot) {
            dot.x += dot.ax;
            dot.y += dot.ay;
            //点碰到边缘返回
            dot.ax *= (dot.x > (this.c.width - this.radius) || dot.x < this.radius) ? -1 : 1;
            dot.ay *= (dot.y > (this.c.height - this.radius) || dot.y < this.radius) ? -1 : 1;
            //绘制点
            this.ctx.beginPath();
            this.ctx.arc(dot.x, dot.y, this.radius, 0, Math.PI * 2, true);
            this.ctx.stroke();
        };
        //点之间画线
        Dotline.prototype.drawLine = function (dots) {
            var nowDot;
            var _that = this;
            //自己的思路：遍历两次所有的点，比较点之间的距离，函数的触发放在animate里
            this.dots.forEach(function (dot) {

                _that.move(dot);
                for (var j = 0; j < dots.length; j++) {
                    nowDot = dots[j];
                    if (nowDot === dot || nowDot.x === null || nowDot.y === null) continue; //continue跳出当前循环开始新的循环
                    var dx = dot.x - nowDot.x, //别的点坐标减当前点坐标
                        dy = dot.y - nowDot.y;
                    var dc = dx * dx + dy * dy;
                    if (Math.sqrt(dc) > Math.sqrt(_that.disMax)) continue;
                    // 如果是鼠标，则让粒子向鼠标的位置移动
                    if (nowDot.label && Math.sqrt(dc) > Math.sqrt(_that.disMax) / 2) {
                        dot.x -= dx * 0.02;
                        dot.y -= dy * 0.02;
                    }
                    var ratio;
                    ratio = (_that.disMax - dc) / _that.disMax;
                    _that.ctx.beginPath();
                    _that.ctx.lineWidth = ratio / 2;
                    _that.ctx.strokeStyle = 'rgba(' + _that.color + ',' + parseFloat(ratio + 0.2).toFixed(1) + ')';
                    _that.ctx.moveTo(dot.x, dot.y);
                    _that.ctx.lineTo(nowDot.x, nowDot.y);
                    _that.ctx.stroke(); //不描边看不出效果

                    //dots.splice(dots.indexOf(dot), 1);
                }
            });
        };
        //开始动画
        Dotline.prototype.start = function () {
            var _that = this;
            this.addDots();
            setTimeout(function () {
                _that.animate();
            }, 100);
        }
        window.Dotline = Dotline;

        onload = () => {
            var dotline = new Dotline({
                dom: 'J_dotLine', //画布id
                cw: 1000, //画布宽
                ch: 800, //画布高
                ds: 100, //点的个数
                r: 0.5, //圆点半径
                cl: '#335', //粒子线颜色
                dis: 100 //触发连线的距离
            }).start();
        }
        onload()
    }

    rotate(){
        //宇宙特效
        "use strict";
        var canvas = document.getElementById('canvas'),
          ctx = canvas.getContext('2d'),
          w = canvas.width = window.innerWidth,
          h = canvas.height = window.innerHeight,
        
          hue = 217,
          stars = [],
          count = 0,
          maxStars = 1300;//星星数量
        
        var canvas2 = document.createElement('canvas'),
          ctx2 = canvas2.getContext('2d');
        canvas2.width = 100;
        canvas2.height = 100;
        var half = canvas2.width / 2,
          gradient2 = ctx2.createRadialGradient(half, half, 0, half, half, half);
        gradient2.addColorStop(0.025, '#CCC');
        gradient2.addColorStop(0.1, 'hsl(' + hue + ', 61%, 33%)');
        gradient2.addColorStop(0.25, 'hsl(' + hue + ', 64%, 6%)');
        gradient2.addColorStop(1, 'transparent');
        
        ctx2.fillStyle = gradient2;
        ctx2.beginPath();
        ctx2.arc(half, half, half, 0, Math.PI * 2);
        ctx2.fill();
        
        // End cache
        
        function random(min, max) {
          if (arguments.length < 2) {
            max = min;
            min = 0;
          }
        
          if (min > max) {
            var hold = max;
            max = min;
            min = hold;
          }
        
          return Math.floor(Math.random() * (max - min + 1)) + min;
        }
        
        function maxOrbit(x, y) {
          var max = Math.max(x, y),
            diameter = Math.round(Math.sqrt(max * max + max * max));
          return diameter / 2;
          //星星移动范围，值越大范围越小，
        }
        
        var Star = function() {
        
          this.orbitRadius = random(maxOrbit(w, h));
          this.radius = random(60, this.orbitRadius) / 8; 
          //星星大小
          this.orbitX = w / 2;
          this.orbitY = h / 2;
          this.timePassed = random(0, maxStars);
          this.speed = random(this.orbitRadius) / 500000; 
          //星星移动速度
          this.alpha = random(2, 10) / 10;
        
          count++;
          stars[count] = this;
        }
        
        Star.prototype.draw = function() {
          var x = Math.sin(this.timePassed) * this.orbitRadius + this.orbitX,
            y = Math.cos(this.timePassed) * this.orbitRadius + this.orbitY,
            twinkle = random(10);
        
          if (twinkle === 1 && this.alpha > 0) {
            this.alpha -= 0.05;
          } else if (twinkle === 2 && this.alpha < 1) {
            this.alpha += 0.05;
          }
        
          ctx.globalAlpha = this.alpha;
          ctx.drawImage(canvas2, x - this.radius / 2, y - this.radius / 2, this.radius, this.radius);
          this.timePassed += this.speed;
        }
        
        for (var i = 0; i < maxStars; i++) {
          new Star();
        }
        
        function animation() {
          ctx.globalCompositeOperation = 'source-over';
          ctx.globalAlpha = 0.5; //尾巴
          ctx.fillStyle = 'hsla(' + hue + ', 64%, 6%, 2)';
          ctx.fillRect(0, 0, w, h)
        
          ctx.globalCompositeOperation = 'lighter';
          for (var i = 1, l = stars.length; i < l; i++) {
            stars[i].draw();
          };
        
          window.requestAnimationFrame(animation);
        }
        
        animation();
    }
}
let background = new Background()
export default background