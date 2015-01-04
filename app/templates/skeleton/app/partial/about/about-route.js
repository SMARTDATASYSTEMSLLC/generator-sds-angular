(function () {
    'use strict';

    angular.module('app')
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
