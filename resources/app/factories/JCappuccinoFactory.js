/*
 *  Gère la connexion avec JCappuccino via un WebSocket
 *  Source: https://github.com/payutc/mozart/
 */
app.factory('JCappuccinoFactory', function() {

    var service = {
        callback: {}
    };

    service.init = function(){
      if(service.ws) service.reset();
      else service.connect();
    }

    service.reset = function() {
      if(service.ws) {
        service.callback = {};
        service.ws.close();
        service.ws = null;
      }
    }

    service.connect = function() {

        var ws = new WebSocket('ws://localhost:9191/events/');

        var handle = function(event, message) {
            for(i in service.callback[event]) {
                service.callback[event][i](message);
            }
        }

        ws.onopen = function() {
            handle("onopen", "");
        };

        ws.onerror = function() {
            handle("onerror", "");
        };

        ws.onclose = function() {
            handle("onclose", "");
        };

        ws.onmessage = function(message) {
            var data = message.data.split(':');
            var event = data[0], data = data[1];
            handle(event, data);
        };

        service.ws = ws;
    }

    service.send = function(event, message) {
        service.ws.send(event + ':' + message);
    }

    service.subscribe = function(event, callback) {
        if(!service.callback[event]) {
            service.callback[event] = [];
        }
        service.callback[event].push(callback);
    }

    return service;
});
