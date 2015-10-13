(function (){
    'use strict';

    function <%= lodash.camelCase(name) %> (){
        return function(input,arg) {
            return 'output';
        };
    }

    angular.module('<%= appname %>').filter('<%= lodash.camelCase(name) %>', <%= lodash.camelCase(name) %>);
})();
