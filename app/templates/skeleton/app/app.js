(function (){
    'use strict';
    angular.module('app', [
        'ui.bootstrap',
        'ui.utils',
        'ngRoute',
        'ngAnimate',
        'LocalStorageModule'
    ]);

    angular.module('app').config(function($routeProvider) {

        $routeProvider.otherwise({redirectTo:'/home'});

    });

    angular.module('app').run(function($rootScope) {

        $rootScope.safeApply = function(fn) {
            var phase = $rootScope.$$phase;
            if (phase === '$apply' || phase === '$digest') {
                if (fn && (typeof(fn) === 'function')) {
                    fn();
                }
            } else {
                this.$apply(fn);
            }
        };

        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current.$$route && current.$$route.title) {
                $rootScope.title = current.$$route.title;
            }else{
                $rootScope.title = 'app';
            }
        });

    });

    //nav controller
    function NavMenuCtrl($location){
        var vm = this;

        vm.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }

    angular.module('app').controller('NavMenuCtrl', NavMenuCtrl);

})();
