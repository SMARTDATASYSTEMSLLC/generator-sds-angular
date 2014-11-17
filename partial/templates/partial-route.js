(function () {
    'use strict';

    angular.module('<%= appname %>')
        .config(['$routeProvider', function ($routeProvider) {
            $routeProvider
                .when('<%= route %>', {
                    templateUrl: '<%= routeUrl %>',
                    controller: '<%= ctrlname %>',
                    controllerAs: "vm",
                    title: ''
                });
        }]);

})();
