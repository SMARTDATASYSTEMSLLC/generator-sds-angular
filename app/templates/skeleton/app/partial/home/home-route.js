(function () {
    'use strict';

    angular.module('<%= _.camelize(appname) %>')
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
