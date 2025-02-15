// 新增移动端控制逻辑
const mobileLeft = document.getElementById('mobile-left');
const mobileRight = document.getElementById('mobile-right');
const mobileDown = document.getElementById('mobile-down');
const mobileRotate = document.getElementById('mobile-rotate');
const mobileFlip = document.getElementById('mobile-flip');

// 触摸事件处理
function addMobileControl(element, action) {
    element.addEventListener('touchstart', (e) => {
        e.preventDefault();
        action();
    });
    element.addEventListener('mousedown', (e) => {
        e.preventDefault();
        action();
    });
}

// 绑定移动端按钮
addMobileControl(mobileLeft, moveLeft);
addMobileControl(mobileRight, moveRight);
addMobileControl(mobileDown, moveDown);
addMobileControl(mobileRotate, rotate);
addMobileControl(mobileFlip, flip);

// 优化触摸体验：禁用长按菜单
document.addEventListener('contextmenu', (e) => e.preventDefault());

// 新增：自动隐藏地址栏（针对移动浏览器）
window.addEventListener('load', function() {
    setTimeout(function() {
        window.scrollTo(0, 1);
    }, 0);
});
