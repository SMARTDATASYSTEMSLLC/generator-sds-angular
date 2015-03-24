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

        $routeProvider.otherwise({redirectTo:'/'});

    });
    <% } %><% if (uirouter) { %>
    angular.module('<%= _.camelize(appname) %>').config(function( $componentLoaderProvider) {

        $componentLoaderProvider.setComponentFromCtrlMapping(function (name){
            return name[0].toLowerCase() + name.substr(1, name.length - 5);
        });

        $componentLoaderProvider.setCtrlNameMapping(function (name){
            return name[0].toUpperCase() + name.substr(1) + 'Ctrl';
        });

        $componentLoaderProvider.setTemplateMapping(function (name){
            return './partial/' + name + '/' + name + '.html';
        });

    });
    <% } %>
    angular.module('<%= _.camelize(appname) %>').run(function($rootScope, $location, progressLoader) {
        var lastUrl = $location.path();

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

        $rootScope.$on('$routeChangeStart', function (event, current) {
            //this is needed because
            //1. on $route.reload no 'success' is fired and the spinner never stops
            //2. clicking, ie. a node menu again, behaves the same as a route reload
            if (lastUrl !== $location.path()) {
                progressLoader.start();
            }

            lastUrl = $location.path();
        });

        $rootScope.$on('$routeChangeSuccess', function (event, current) {
            if (current.$$route && current.$$route.title) {
                $rootScope.title = current.$$route.title;
            }else{
                $rootScope.title = '<%= _.camelize(appname) %>';
            }
            progressLoader.endAll();
        });

        $rootScope.$on('$routeChangeError', function(){
            progressLoader.endAll();
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
