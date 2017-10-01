var host = window.document.location.host.replace(/:.*/, '');
var ws = new WebSocket('ws://' + host + ':8080');
ws.onopen = function() {
    ws.send('hello server!');
};
ws.onmessage = function (event) {
    var data = JSON.parse(event.data);
    console.log(data);
    if(data.type && data.type === 'draw') {
        paintFromMessage(data.color, data.lastX, data.lastY, data.nowX, data.nowY);
    }
};

var canvas = document.querySelector('#paint');
var ctx = canvas.getContext('2d');

var sketch = document.querySelector('#sketch');
var sketch_style = getComputedStyle(sketch);
canvas.width = parseInt(sketch_style.getPropertyValue('width'));
canvas.height = parseInt(sketch_style.getPropertyValue('height'));

var mouse = {x: 0, y: 0};
var last_mouse = {x: 0, y: 0};

/* Mouse Capturing Work */
canvas.addEventListener('mousemove', function(e) {
    last_mouse.x = mouse.x;
    last_mouse.y = mouse.y;

    mouse.x = e.pageX - this.offsetLeft;
    mouse.y = e.pageY - this.offsetTop;
}, false);

/* Drawing on Paint App */
ctx.lineWidth = 5;
ctx.lineJoin = 'round';
ctx.lineCap = 'round';
ctx.strokeStyle = 'blue'; // default

canvas.addEventListener('mousedown', function(e) {
    canvas.addEventListener('mousemove', onPaint, false);
}, false);

canvas.addEventListener('mouseup', function() {
    canvas.removeEventListener('mousemove', onPaint, false);
}, false);

var paintFromMessage = function(color, lastx, lasty, mousex, mousey) {
    var currentStrokeStyle = ctx.strokeStyle;
    ctx.beginPath();
    ctx.moveTo(lastx, lasty);
    ctx.lineTo(mousex, mousey);
    ctx.closePath();
    ctx.strokeStyle = color;
    ctx.stroke();
    ctx.strokeStyle = currentStrokeStyle;
};
var onPaint = function() {
    ctx.beginPath();
    ctx.moveTo(last_mouse.x, last_mouse.y);
    ctx.lineTo(mouse.x, mouse.y);
    ctx.closePath();
    ctx.stroke();
    ws.send(JSON.stringify({
        type: 'draw',
        color: ctx.strokeStyle,
        lastX: last_mouse.x,
        lastY: last_mouse.y,
        nowX: mouse.x,
        nowY: mouse.y
    }));
};

var controlPanel = document.getElementById('controls');
controlPanel.onclick = function() {
    controlPanel.classList.add('open');
};
canvas.addEventListener('click', function(e) {
    controlPanel.classList.remove('open');
});

function setColor(color) {
    ctx.strokeStyle = color;
}