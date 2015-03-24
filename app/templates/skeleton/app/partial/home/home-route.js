(function () {
    'use strict';

    angular.module('<%= _.camelize(appname) %>')
    <% if (!uirouter) { %>
        .config(function ($routeProvider) {
            $routeProvider
                .when('/home', {
                    templateUrl: 'partial/home/home.html',
                    controller: 'HomeCtrl',
                    controllerAs: "vm",
                    title: 'home'
                });
        });
    <% } %><% if (uirouter) { %>
        .run(function ($router) {

            $router.config([
                {
                    path: '/home',
                    component: 'home',
                    title: 'home'
                }
            ]);
        });
    <% } %>

})();
