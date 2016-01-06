(function (){
    'use strict';
    angular.module('<%= lodash.camelCase(appname) %>', [
        'ui.bootstrap',
        '<%= routerModuleName %>',
        //<% if (hasAuth) { %>
        'angular-jwt',
        //<% } %>
        'ngAnimate'
    ]);
    //<% if (!uirouter) { %>
    angular.module('<%= lodash.camelCase(appname) %>').config(function($routeProvider, $locationProvider) {

        $routeProvider.otherwise({redirectTo:'/'});

        $locationProvider.html5Mode(true);

    });
    //<% } %><% if (uirouter) { %>
    angular.module('<%= lodash.camelCase(appname) %>').config(function( $componentLoaderProvider) {

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
    //<% } %>
    angular.module('<%= lodash.camelCase(appname) %>').run(function($rootScope, $location) {
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

        //$rootScope.$on('$routeChangeStart', function (event, current) {
        //    //this is needed because
        //    //1. on $route.reload no 'success' is fired and the spinner never stops
        //    //2. clicking, ie. a node menu again, behaves the same as a route reload
        //    if (lastUrl !== $location.path()) {
        //        progressLoader.start();
        //    }
        //
        //    lastUrl = $location.path();
        //});
        //
        //$rootScope.$on('$routeChangeSuccess', function (event, current) {
        //    if (current.$$route && current.$$route.title) {
        //        $rootScope.title = current.$$route.title;
        //    }else{
        //        $rootScope.title = '<%= lodash.camelCase(appname) %>';
        //    }
        //    progressLoader.endAll();
        //});
        //
        //$rootScope.$on('$routeChangeError', function(){
        //    progressLoader.endAll();
        //});


    });

	//nav controller
    function NavMenuCtrl($location){
        var vm = this;

        vm.isActive = function (viewLocation) {
            return viewLocation === $location.path();
        };
    }

    angular.module('<%= lodash.camelCase(appname) %>').controller('NavMenuCtrl', NavMenuCtrl);

})();
