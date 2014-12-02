(function (){
    'use strict';
    function authInterceptorService($q, $injector,$location, localStorageService) {
        var authInterceptorServiceFactory = {};

        var _request = function (config) {

            config.headers = config.headers || {};

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                config.headers.Authorization = 'Bearer ' + authData.token;

                var tenants = localStorageService.get('tenantData');
                if(tenants && tenants.currentTenant) {
                    var userTenant = tenants.currentTenant;
                    if (userTenant) {
                        config.headers['Tenant-ID'] = userTenant.tenantId;
                    }
                }
            }

            return config;
        };

        var _responseError = function (rejection) {
            if (rejection.status === 401) {
                var authService = $injector.get('authService');
                var authData = localStorageService.get('authorizationData');

                if (authData) {
                    if (authData.useRefreshTokens) {
                        $location.path('/refresh');
                        return $q.reject(rejection);
                    }
                }
                authService.logOut();
                $location.path('/login');
            }
            return $q.reject(rejection);
        };

        authInterceptorServiceFactory.request = _request;
        authInterceptorServiceFactory.responseError = _responseError;

        return authInterceptorServiceFactory;
    }

    angular.module('<%= _.camelize(appname) %>').factory('authInterceptorService',authInterceptorService);

})();
