var JStudio = (function(){
    var JS = {};

    JS.Player = function(stage){
        var player = this;

        player.stage = typeof stage == "object"?stage:{};
        player.animation = [];
        player.frame = 0;
        player.frameRate = 60;
        player.reverse = false;
        player.loop = false;

        player.timeout = null;

        player.load = function(animation){
            this.animation = animation;
        };

        player.render = function(){
            if(player.frame >= 0 && player.frame < player.animation.length){
                player.animation[player.frame].call(player, player.stage);
            }
            return player;
        };

        player.play = function(frame_rate, loop, reverse){
            if(typeof loop == "boolean"){
                player.loop = loop;
            }
            if(typeof frame_rate == "number"){
                player.frameRate = frame_rate;
            }
            if(typeof reverse == "boolean"){
                player.reverse = reverse;
            }
            player.stop();
            player.step();
            player.timeout = setTimeout(function(){
                player.play();
            }, 
            1000/player.frameRate);
            return player;
        };

        player.stop = function(){
            if(player.timeout){
                clearTimeout(player.timeout);
            }
            return player;
        };

        player.step = function(){
            var frame = Math.max(0, Math.min(player.animation.length-1, player.frame+(player.reverse?-1:1)));
            if(frame == player.frame){
                if(player.loop){
                    player.goto(player.reverse?player.animation.length-1:0);
                }else{
                    player.stop();
                }
            }else{
                player.goto(frame);
            }
            return player;
        };

        player.goto = function(frame){
            if(typeof frame == "number"){
                player.frame = frame;
                player.render();
            }
            return player;
        };
    };

    JS.Recorder = function(){
        var recorder = this;
        recorder.recording = [];
        recorder.next = function(start){
            var links = [typeof start=="function"?start:function(){}];
            function chain(link){
                if(typeof link == "function"){
                    links.push(link);
                }
                return chain;
            }
            function frame(){
                var links = frame.links;
                for(var i=0; i<links.length; i++){
                    if(typeof links[i] == "function"){
                        links[i].apply(this, arguments);
                    }
                }
            }
            frame.links = links;
            frame.extend = chain;
            recorder.recording.push(frame);
            return chain;
        };
        recorder.goto = function(index){
            while(recorder.recording.length<=index){
                recorder.next();
            }
            return recorder.recording[index].extend;
        };
        recorder.export = function(){
            return recorder.recording;
        };
    };

    JS.record = {};

    JS.record.player = {};
    JS.record.player.play = function(){
        var args = arguments;
        return function(stage){
            this.play.apply(this, args);
        };
    };
    JS.record.player.stop = function(){
        return function(stage){
            this.stop();
        };
    };
    JS.record.player.goto = function(){
        var args = arguments;
        return function(stage){
            this.goto.apply(this, args);
        };
    };
    JS.record.player.step = function(){
        var args = arguments;
        return function(stage){
            this.step.apply(this, args);
        };
    };
    JS.record.player.load = function(animation){
        return function(stage){
            this.load.call(this, animation);
        };
    };
    JS.record.player.reverse = function(reverse){
        return function(stage){
            this.reverse = reverse;
        };
    };
    JS.record.player.loop = function(loop){
        return function(stage){
            this.loop = loop;
        };
    };
    JS.record.player.frameRate = function(frameRate){
        return function(stage){
            this.frameRate = frameRate;
        };
    };

    JS.record.stage = {};
    JS.record.stage.set = function(key, value){
        return function(stage){
            stage[key] = value;
        };
    };

    JS.record.element = {};
    JS.record.element.create = function(id, tag, parent){
        return function(stage){
            if(!id) return;
            var el = document.createElement(tag);
            stage[id] = el;
            el.id = id;
            if(parent){
                parent.appendChild(el);
            }
        };
    };
    JS.record.element.remove = function(id){
        return function(stage){
            var element = typeof id=="string"?stage[id]:id;
            if(!element) return;
            element.parentNode.removeChild(stage[id]);
            if(typeof id == "string") delete stage[id];
        };
    };
    JS.record.element.appendTo = function(id, parent){
        return function(stage){
            var element = typeof id=="string"?stage[id]:id;
            if(!element) return;
            parent.appendChild(element);
        };
    };
    JS.record.element.set = function(id, attr, value){
        return function(stage){
            var element = typeof id=="string"?stage[id]:id;
            if(!element) return;
            element[attr] = value;
        };
    };
    JS.record.element.style = function(id, attr, value){
        return function(stage){
            var element = typeof id=="string"?stage[id]:id;
            if(!element) return;
            element.style[attr] = value;
        };
    };

    JS.record.console = {};
    JS.record.console.log = function(){
        var args = arguments;
        return function(stage){
            console.log.apply(console, args);
        };
    };

    JS.record.window = {};
    JS.record.window.resizeBy = function(win, relW, relH){
        return function(stage){
            win.resizeBy(relW, relH);
        };
    };
    JS.record.window.resizeTo = function(win, width, height){
        return function(stage){
            win.resizeTo(width, height);
        };
    };

    return JS;

})();

var module;
if(module){
    module.exports = JStudio;
}