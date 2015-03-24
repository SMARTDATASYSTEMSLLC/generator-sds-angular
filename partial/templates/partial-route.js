(function () {
    'use strict';

    angular.module('<%= appname %>')
    <% if (!uirouter) { %>
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('<%= route %>', {
                    templateUrl: '<%= routeUrl %>',
                    controller: '<%= ctrlname %>',
                    controllerAs: "vm",
                    title: '<%= name %>'
                });
        }]);
    <% } %><% if (uirouter) { %>
        .run(function ($router) {

            $router.config([
                {
                    path: '<%= route %>',
                    component: '<%= name %>',
                    title: '<%= name %>'
                }
            ]);
        });
    <% } %>
})();
