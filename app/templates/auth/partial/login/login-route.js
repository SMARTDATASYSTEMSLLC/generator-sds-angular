(function () {
    'use strict';

    angular.module('hapiAngular')
    
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('/login', {
                    templateUrl: 'partial/login/login.html',
                    controller: 'LoginCtrl',
                    controllerAs: "vm",
                    title: 'login',
                    isAuth: false
                });
        }]);
    
})();
