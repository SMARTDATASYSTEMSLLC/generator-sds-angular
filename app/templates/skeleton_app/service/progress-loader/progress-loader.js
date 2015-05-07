(function (){
    'use strict';

    function progressLoader($window, $q) {
        var active = 0;
        var notice = null;

        return {
            wait: function (promise, isBlocking){
                if (isBlocking){
                    this.start();
                }else{
                    this.startNonblocking();
                }
                return promise.then(this.end, function (arg){
                    return $q.reject(this.end(arg));
                });
            },
            startNonblocking:function (arg){
                if ( ++active < 2) {
                    if (notice){
                        notice.update({
                            delay: 0,
                            hide: true
                        });
                    }
                    notice = new $window.PNotify({
                        title: "Please Wait",
                        type: 'info',
                        icon: 'fa fa-spinner fa-spin',
                        hide: false,
                        buttons: {
                            closer: false,
                            sticker: false
                        },
                        opacity: 0.75,
                        shadow: false,
                        width: "170px",
                        stack: {
                            dir1: "down",
                            dir2: "left",
                            push: "bottom",
                            spacing1: 5,
                            spacing2: 5,
                            context: $("body")
                        }
                    });
                }
                return arg;
            },
            start: function (arg) {
                if ( ++active < 2) {
                    $.blockUI({
                        message: '<i class="fa fa-spinner fa-spin"></i>',
                        baseZ:1500,
                        css: {
                            border: 'none',
                            padding: '15px',
                            backgroundColor: '#000',
                            '-webkit-border-radius': '10px',
                            '-moz-border-radius': '10px',
                            opacity: 0.5,
                            color: '#fff',
                            width: '144px',
                            'font-size': '72px',
                            left:'50%',
                            'margin-left': '-50px'
                        }
                    });
                }
                return arg;
            },
            end: function (arg) {
                if (--active < 1) {
                    if (notice){
                        notice.update({
                            delay: 0,
                            hide: true
                        });
                    }
                    $.unblockUI();
                    active = 0;
                }
                return arg;
            },
            endAll: function(arg){
                if (notice){
                    notice.update({
                        delay: 0,
                        hide: true
                    });
                }
                $.unblockUI();
                active = 0;
                return arg;
            }
        };
    }

    angular.module('<%= _.camelize(appname) %>').factory('progressLoader',progressLoader);

})();
