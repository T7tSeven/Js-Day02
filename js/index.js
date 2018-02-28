var bannerId = document.getElementById('banner');
var pointerId = document.getElementById('pointer');
var bannerLi = bannerId.getElementsByTagName('li');
var arrowLeft = document.getElementById('arrowLeft');
var arrowRight = document.getElementById('arrowRight');
var screen = document.getElementsByClassName('screen')[0];
var img = document.getElementsByTagName('img');

//鼠标移上屏幕定时器清除
screen.onmouseover = function () {
    arrowLeft.style.display='block';
    arrowRight.style.display='block';
    clearInterval(timer);
    timer = null;
}
screen.onmouseout = function () {
    arrowLeft.style.display='none';
    arrowRight.style.display='none';
    timer = setInterval(autoPlay,2000);
}

//创建底部指示点
for (var i = 0; i < bannerLi.length; i++) {
    var pointerLi = document.createElement('li');
    pointerId.appendChild(pointerLi);
    pointerLi.innerHTML = i + 1;
}
var pointerLi = pointerId.children;
pointerLi[0].className = 'on';
//克隆第一张和最后一张图片添加到ul当中
var picFir = bannerLi[0].cloneNode(true);
bannerId.appendChild(picFir);
var picLas = bannerLi[bannerLi.length - 2].cloneNode(true);
bannerId.insertBefore(picLas, bannerLi[0]);
//定位到第一张图片的位置
bannerId.style.left = -img[0].offsetWidth + 'px';
//左右箭头切换
var k = 1;
arrowRight.onclick = function () {
    k++;
    if(k>=bannerLi.length){
        k = 1;
        bannerId.style.left = -img[0].offsetWidth*k + 'px';
    }
    var target = -img[0].offsetWidth * k;
    move(bannerId, 'left', 30, target, function () {
        if (k >= bannerLi.length - 1) {
            bannerId.style.left = -img[0].offsetWidth + 'px';
            k = 1;
        }
        clear();
        pointerLi[k - 1].className = 'on';
    });
}
arrowLeft.onclick = function () {
    k--;
    //避免点击过快出现空白
    if(k<=0){
        k = bannerLi.length - 2;
        bannerId.style.left = -img[0].offsetWidth*k + 'px';
    }
    var target = -img[0].offsetWidth * k;
    move(bannerId, 'left', 30, target, function () {
        if (k <= 0) {
            k = bannerLi.length - 2;
            bannerId.style.left = -img[0].offsetWidth * k + 'px';
        }
        clear();
        pointerLi[k - 1].className = 'on';
    });
}
//点击指示点显示对应图片
for (var i = 0; i < pointerLi.length; i++) {
    //闭包实现切换
    (function(i){
        pointerLi[i].onclick = function () {
        var target = -(i + 1) * img[0].offsetWidth;
        move(bannerId, 'left', 60, target, () => {
            clear();
            pointerLi[i].className = 'on';
            k = i + 1;
        })
    }
    })(i)
    //index属性实现切换
    // pointerLi[i].index = i
    // pointerLi[i].onclick = function () {
    //     var target = -(this.index + 1) * img[0].offsetWidth;
    //     move(bannerId, 'left', 60, target, () => {
    //         clear();
    //         pointerLi[this.index].className = 'on';
    //         k = this.index + 1;
    //     })
    // }
}
//加定时器实现轮播
var timer = null;
timer = setInterval(autoPlay, 2000);
//自动轮播函数
function autoPlay() {
    k++;
    if (k >= 8) {
        k = 1;
        bannerId.style.left = -img[0].offsetWidth * k + 'px';
    }
    move(bannerId, 'left', 30, -img[0].offsetWidth * k, function () {
        if (k >= 7) {
            k = 1;
            bannerId.style.left = -img[0].offsetWidth + 'px';
        }
        clear();
        console.log(k)
        pointerLi[k - 1].className = 'on';
    });
}

//清除指示点样式函数
function clear() {
    for (var i = 0; i < pointerLi.length; i++) {
        pointerLi[i].className = '';
    }
}
//运动函数
function move(obj, attr, speed, tar, fn) {
    clearInterval(obj.timer);
    var dis = parseFloat(getStyle(obj, attr));
    speed = dis > tar ? -speed : speed;
    obj.timer = setInterval(function () {
        dis += speed;
        if (dis >= tar && speed > 0) {
            dis = tar;
        }
        if (dis <= tar && speed < 0) {
            dis = tar;
        }
        obj.style[attr] = dis + 'px';
        if (dis == tar) {
            clearInterval(obj.timer);
            obj.timer = null;
            fn && fn();
        }
    }, 30);
}

//获取样式函数
function getStyle(obj, attr) {
    return obj.currentStyle ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}