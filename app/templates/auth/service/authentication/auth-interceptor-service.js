(function (){
    'use strict';
    function authInterceptorService($log, $q, $injector,$location, progressLoader) {
        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            var authService = $injector.get('authService');

            config.headers = config.headers || {};

            if (authService.authentication.isAuth) {
                config.headers.Authorization = 'Bearer ' + authService.authentication.token;
                //config.headers['Tenant-ID'] = tenantService.getCurrentTenantId();
                //config.headers['Time-Difference'] = new Date().getTimezoneOffset();
            }

            return config;
        };

        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');

                if (authService.authentication) {
                    if (authService.authentication.useRefreshTokens) {
                        authService.refreshToken().then(function (){
                            $location.reload();
                        }, function (){
                            authService.logOut();
                            $location.path('/login');
                        });
                        return $q.reject(rejection);
                    }
                }
                authService.logOut();
                $location.path('/login');
            }
            if(rejection.status === 404){
                progressLoader.end(); //in case
                $location.path('/notfound');
            }
            if(rejection.status === 500){
                progressLoader.end(); //in case
            }
            //each page *should* in theory handle this....
            //if(rejection.status === 500) {
            //    $location.path('/error');
            //}
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

    angular.module('<%= _.camelize(appname) %>').factory('authInterceptorService',authInterceptorService);

})();
