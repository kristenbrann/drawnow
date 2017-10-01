window.DrawingBoard = (function() {
    var canvas, ctx, sketch, sketch_style, mouse, last_mouse;

    canvas = document.querySelector('#paint');
    ctx = canvas.getContext('2d');

    sketch = document.querySelector('#sketch');
    sketch_style = getComputedStyle(sketch);
    canvas.width = parseInt(sketch_style.getPropertyValue('width'));
    canvas.height = parseInt(sketch_style.getPropertyValue('height'));

    mouse = {x: 0, y: 0};
    last_mouse = {x: 0, y: 0};

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

    function _paint(x1, y1, x2, y2, color) {
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.closePath();
        if (color != null) {
            var currentStrokeStyle = ctx.strokeStyle;
            ctx.strokeStyle = color;
            ctx.stroke();
            ctx.strokeStyle = currentStrokeStyle;
        } else {
            ctx.stroke();
        }
    }

    function onPaint() {
        var drawEvent;
        _paint(last_mouse.x, last_mouse.y, mouse.x, mouse.y);
        drawEvent = new CustomEvent('usrdraw', {
            detail: {
                type: 'draw',
                color: ctx.strokeStyle,
                lastX: last_mouse.x,
                lastY: last_mouse.y,
                nowX: mouse.x,
                nowY: mouse.y
            }
        });
        document.dispatchEvent(drawEvent);
    }

    canvas.addEventListener('mousedown', function(e) {
        canvas.addEventListener('mousemove', onPaint, false);
    }, false);

    canvas.addEventListener('mouseup', function() {
        canvas.removeEventListener('mousemove', onPaint, false);
    }, false);

    return {
        setColor: function _setColor(color) {
            ctx.strokeStyle = color;
        },
        setShape: function _setShape(shape) {
            ctx.lineCap = shape;
        },
        setSize: function _setSize(size) {
            ctx.lineWidth = size;
        },
        draw: function _draw(data) {
            _paint(data.lastX, data.lastY, data.nowX, data.nowY, data.color);
        }
    };
})();