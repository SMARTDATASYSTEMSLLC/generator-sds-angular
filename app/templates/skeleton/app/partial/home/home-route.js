(function () {
    'use strict';

    angular.module('app')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'partial/home/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: "vm",
                    title: ''
                });
        }]);

})();
