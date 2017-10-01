window.WS = (function() {
    var ws, host, room;
    host = window.document.location.host.replace(/:.*/, '');
    room = window.location.pathname.split('/').pop();
    ws = new WebSocket('ws://' + host + ':' + location.port);

    ws.onopen = function() {
        ws.send('hello server!');
    };
    ws.onmessage = function (event) {
        var data = JSON.parse(event.data);
        if(data.type && data.type === 'draw' && data.room && data.room === room) {
            var wsEvent = new CustomEvent('drawmsg', { detail: event.data });
            document.dispatchEvent(wsEvent);
        }
    };

    return {
        sendMsg: function(data) {
            data.room = room;
            ws.send(JSON.stringify(data));
        }
    };
})();
