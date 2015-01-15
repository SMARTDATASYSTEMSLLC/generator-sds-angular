(function (){
    'use strict';
    angular.module('<%= _.camelize(appname) %>', [
        'ui.bootstrap',
        'ui.utils',
        '<%= routerModuleName %>',
        'ngAnimate',
        'LocalStorageModule'
    ]);
    <% if (!uirouter) { %>
    angular.module('<%= _.camelize(appname) %>').config(function($routeProvider) {

        $routeProvider.otherwise({redirectTo:'/home'});

    });
    <% } %><% if (uirouter) { %>
    angular.module('<%= _.camelize(appname) %>').config(function($stateProvider, $urlRouterProvider) {

        $urlRouterProvider.otherwise('/home');

    });
    <% } %>
    angular.module('<%= _.camelize(appname) %>').run(function($rootScope) {

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
                $rootScope.title = '<%= _.camelize(appname) %>';
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

    angular.module('<%= _.camelize(appname) %>').controller('NavMenuCtrl', NavMenuCtrl);

})();
