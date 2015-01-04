(function () {
    'use strict';

    angular.module('<%= _.camelize(appname) %>')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/about', {
                    templateUrl: 'partial/about/about.html',
                    controller: 'AboutCtrl',
                    controllerAs: "vm",
                    title: ''
                });
        }]);

})();
