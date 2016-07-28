(function () {
    'use strict';

    //<% if (!uirouter) { %>
    angular.module('<%= appname %>')
        .config(function ($routeProvider) {
            $routeProvider
                .when('<%= route %>', {
                    templateUrl: '<%= routeUrl %>',
                    controller: '<%= ctrlname %>',
                    controllerAs: "vm",
                    title: '<%= name %>'
                });
        });
    //<% } %><% if (uirouter) { %>
    angular.module('<%= appname %>')
        .run(function ($router) {

            $router.config([
                {
                    path: '<%= route %>',
                    component: '<%= name %>',
                    title: '<%= name %>'
                }
            ]);
        });
    //<% } %>
})();
