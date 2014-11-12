(function (){
    'use strict';

    function <%= _.camelize(name) %> (){
        return function(input,arg) {
            return 'output';
        };
    }

    angular.module('<%= appname %>').filter('<%= _.camelize(name) %>', <%= _.camelize(name) %>);
})();
