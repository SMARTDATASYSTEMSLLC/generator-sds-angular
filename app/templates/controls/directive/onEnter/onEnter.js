(function () {
    'use strict';
    function onEnter (){
        return {
            restrict: 'A',
            link: function(scope,element,attrs) {
                element.bind("keypress", function (event) {
                    if (event.which === 13) {
                        scope.$apply(function () {
                            scope.$eval(attrs.onEnter);
                        });
                        event.preventDefault();
                    }
                });
            }
        };
    }

    angular.module('<%= _.camelize(appname) %>').directive('onEnter',onEnter);
})();
