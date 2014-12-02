(function (){
    'use strict';
    function authService($http, $q, $location, localStorageService) {

        var serviceBase = 'http://localhost/auth';

        var authServiceFactory = {};

        var _authentication = {
            isAuth: false,
            userName: ""
            //useRefreshTokens: false
        };


        var _saveRegistration = function (registration) {

            _logOut();

            return $http.post(serviceBase + 'api/account/register', registration).then(function (response) {
                return response;
            });

        };

        var _login = function (loginData) {

            var data = "grant_type=password&username=" + loginData.userName + "&password=" + loginData.password;
            //if (loginData.useRefreshTokens) {
            //    data = data + "&client_id=" + globalConstants.clientId;
            //}

            var deferred = $q.defer();

            $http.post(serviceBase, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {

                //we need to set this data before we can make a next request because the next request requires the token...
                localStorageService.set('authorizationData', { token: response.access_token, userName: loginData.userName, refreshToken: "", useRefreshTokens: false });
                _authentication.isAuth = true;
                _authentication.userName = loginData.userName;

                //make sure we fetch and store the tenant data here as well...
                //tenantService.getTenantDataByEmail(loginData.userName).then(function(){
                        deferred.resolve(response);
                //});

            }).error(function (err, status) {
                _logOut();
                deferred.reject(err);
            });

            return deferred.promise;

        };

        var _logOut = function () {

            localStorageService.remove('authorizationData');
            //tenantService.removeStorageData();

            _authentication.isAuth = false;
            _authentication.userName = "";
            //_authentication.useRefreshTokens = false;

            $location.path("/login");

        };

        var _fillAuthData = function () {

            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication.isAuth = true;
                _authentication.userName = authData.userName;
                //_authentication.useRefreshTokens = authData.useRefreshTokens;
            }

        };

        //var _refreshToken = function () {
        //    var deferred = $q.defer();
        //
        //    var authData = localStorageService.get('authorizationData');
        //
        //    if (authData) {
        //
        //        if (authData.useRefreshTokens) {
        //
        //            var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + globalConstants.clientId;
        //
        //            localStorageService.remove('authorizationData');
        //
        //            $http.post(serviceBase, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }).success(function (response) {
        //
        //                localStorageService.set('authorizationData', { token: response.access_token, userName: response.userName, refreshToken: response.refresh_token, useRefreshTokens: true });
        //
        //                deferred.resolve(response);
        //
        //            }).error(function (err, status) {
        //                _logOut();
        //                deferred.reject(err);
        //            });
        //        }
        //    }
        //
        //    return deferred.promise;
        //};

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        //authServiceFactory.refreshToken = _refreshToken;


        return authServiceFactory;

    }

    angular.module('<%= _.camelize(appname) %>').factory('authService',authService);

})();
