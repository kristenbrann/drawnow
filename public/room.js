var $ui, host, room, controlPanel, colorSelectors;
host = window.document.location.host.replace(/:.*/, '');
room = window.location.pathname.split('/').pop();

var WS = window.WS;
var DrawingBoard = window.DrawingBoard;
document.addEventListener('drawmsg', function(e) {
    var data = JSON.parse(e.detail);
    DrawingBoard.draw(data);
});
document.addEventListener('usrdraw', function(e) {
    var data = e.detail;
    WS.sendMsg(data);
});

controlPanel = document.getElementById('controls');
controlPanel.onclick = function() {
    controlPanel.classList.add('open');
};

colorSelectors = document.getElementsByClassName('js-colorSelector');
for(var i = 0; i < colorSelectors.length; i++) {
    colorSelectors[i].addEventListener('click', DrawingBoard.setColor.bind(null, colorSelectors[i].getAttribute('data-color')));
}
