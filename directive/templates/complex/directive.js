(function () {
    'use strict';
    function <%= lodash.camelCase(name) %> () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '<%= htmlPath %>',
            link: function ($scope, $element, $attrs, fn) {


            }
        };
    }

    angular.module('<%= appname %>').directive('<%= lodash.camelCase(name) %>', <%= lodash.camelCase(name) %>);

})();
