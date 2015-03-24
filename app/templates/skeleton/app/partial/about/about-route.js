(function () {
    'use strict';

    angular.module('<%= _.camelize(appname) %>')
    <% if (!uirouter) { %>
    .config(function ($routeProvider) {
            $routeProvider
                .when('/about', {
                    templateUrl: 'partial/about/about.html',
                    controller: 'AboutCtrl',
                    controllerAs: "vm",
                    title: 'about'
                });
        });
    <% } %><% if (uirouter) { %>
    .run(function ($router) {

            $router.config([
                {
                    path: '/about',
                    component: 'about',
                    title: 'about'
                }
            ]);
        });
    <% } %>

})();
