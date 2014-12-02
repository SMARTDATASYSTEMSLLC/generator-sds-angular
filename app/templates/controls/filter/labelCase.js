(function (){
    'use strict';

    function labelCase (){
        return function (input) {
            input = input.replace(/([A-Z])/g, ' $1');
            return input[0].toUpperCase() + input.slice(1);
        };
    }

    angular.module('<%= _.camelize(appname) %>').filter('labelCase', labelCase);
})();
