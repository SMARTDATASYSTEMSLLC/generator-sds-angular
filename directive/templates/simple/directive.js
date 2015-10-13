(function () {
    'use strict';
    function <%= lodash.camelCase(name) %> (){
        return {
            restrict: 'A',
            link: function (scope, element, attrs, fn) {


            }
        };
    }

    angular.module('<%= appname %>').directive('<%= lodash.camelCase(name) %>',<%= lodash.camelCase(name) %>);
})();
