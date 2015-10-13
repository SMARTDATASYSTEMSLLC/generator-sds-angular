(function () {
    'use strict';

    angular.module('<%= lodash.camelCase(appname) %>').config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');

    })
    .run(function($log, $q, $location, $rootScope, authService) {
        var previousLocation = "/login",
            postLogInRoute;
        function redirectNoAccess(newRoute, event){
            //send back to wherever they came from
            event.preventDefault();
            if (previousLocation) {
                $location.path(previousLocation);
            }
        }

        function securityCheck(newRoute, event){
            if(!authService.authentication.isAuth) {
                console.log(newRoute && newRoute.$$route);
                if (newRoute && newRoute.$$route && newRoute.$$route.isAuth !== false) {
                    postLogInRoute = $location.url();
                    $location.path("/login").replace();
                    $log.log('postLogInRoute', postLogInRoute);
                }
                else {
                    $location.path($location.path());
                }
            }else if (postLogInRoute){
                $location.url(postLogInRoute);
                postLogInRoute = null;
            } else {
                if(newRoute && newRoute.$$route) {
                    var hasAccess = true;//rolesService.canAccessRoute(newRoute.$$route);
                    if (!hasAccess) {
                        redirectNoAccess(newRoute, event);
                    }else if (newRoute.$$route && newRoute.$$route.templateUrl) { //don't store a previous if not a view
                        previousLocation = $location.url();
                    }
                }
            }
        }

        $rootScope.$on('$routeChangeStart', function (event, currRoute) {
            securityCheck(currRoute, event);
        });

        securityCheck(null, null);
    });

})();
