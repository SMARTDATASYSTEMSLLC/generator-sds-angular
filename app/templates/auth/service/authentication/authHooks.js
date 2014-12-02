(function () {
    'use strict';

    angular.module('<%= _.camelize(appname) %>').config(function($httpProvider) {
        $httpProvider.interceptors.push('authInterceptorService');

    })
    .run(function($location, $rootScope, authService) {

        $rootScope.$on("$locationChangeStart",function(){
            if(!authService.authentication.isAuth){
                $location.path("/login");
            }
        });

        authService.fillAuthData();

        if(!authService.authentication.isAuth){
            $location.path("/login");
        }

    });

})();
