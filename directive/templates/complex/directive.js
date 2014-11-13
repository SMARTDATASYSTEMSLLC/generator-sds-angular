(function () {
    'use strict';
    function <%= _.camelize(name) %> () {
        return {
            restrict: 'E',
            replace: true,
            scope: {},
            templateUrl: '<%= htmlPath %>',
            link: function (scope, element, attrs, fn) {


            }
        };
    }

    angular.module('<%= appname %>').directive('<%= _.camelize(name) %>', <%= _.camelize(name) %>);

})();
