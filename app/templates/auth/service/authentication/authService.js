(function (){
    'use strict';
    function authService($injector, $q, $timeout, localStorageService, globalConstants) {
        //var serviceBase = 'http://localhost/auth';
        var serviceBase = globalConstants.apiServiceBaseUri,
            authServiceBase = globalConstants.authServiceUri,
            authServiceFactory = {},
            _authentication = {
                isAuth: false,
                userName: "",
                token: null,
                refreshToken: null
            };

        var _saveRegistration = function (registration) {
            _logOut();
            return $injector.get('$http').post(serviceBase + 'api/register', registration).then(function (response) {
                return response;
            });
        };

        var _processResponse = function(response, username){
            _authentication.isAuth = true;
            _authentication.userName = username;
            _authentication.token = response.access_token;
            _authentication.refreshToken = response.refresh_token || null;
            localStorageService.set('authorizationData', _authentication);
        };

        var _clearLocalStorage = function(){
            localStorageService.remove('authorizationData');
            _authentication.isAuth = false;
            _authentication.userName = "";
            localStorageService.clearAll();

            $location.path("/login");
        };


        var _login = function (loginData) {
            var data = "grant_type=password&username=" + encodeURIComponent(loginData.userName) + "&password=" + encodeURIComponent(loginData.password)+ "&client_id=" + globalConstants.clientId;
            return $injector.get('$http').post(authServiceBase, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                .then(function (response) {
                    //decode the token to get the data we need:
                    return _processResponse(response.data, loginData.userName);
                }, function (err, status) {
                    _clearLocalStorage();
                    return $q.reject(err);
                }
            );
        };

        var _logOut = function () {
            if(_authentication.userId) {
                _deleteToken();
            }
            $timeout(function (){
                _clearLocalStorage();
                $cacheFactory.get('$http').removeAll();
                $rootScope.$broadcast("auth:userLogOff");
            });
        };

        var _fillAuthData = function () {
            var authData = localStorageService.get('authorizationData');
            if (authData) {
                _authentication = authData;
            }
        };

        var _refreshToken = function () {
            var authData = localStorageService.get('authorizationData');

            if (authData && authData.useRefreshTokens) {
                //refresh_token=...&grant_type=refresh_token&client_Id=43867cf1bcc742d8a7f32872ba95d1dd
                var data = "grant_type=refresh_token&refresh_token=" + authData.refreshToken + "&client_id=" + globalConstants.clientId;

                localStorageService.remove('authorizationData');

                return $injector.get('$http').post(authServiceBase, data, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } })
                    .then(function (response) {
                        return _processResponse(response.data, authData.userName);
                    }, function (err, status) {
                        _logOut();
                        return $q.reject(err);
                    });
            }

            return $q.reject();
        };

        var _deleteToken = function(){
            var deleteTokenUri = globalConstants.apiServiceBaseUri + "/api/account/RefreshToken/" + _authentication.userId + "/" + globalConstants.clientId;
            return $injector.get('$http').delete(deleteTokenUri, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
        };

        authServiceFactory.saveRegistration = _saveRegistration;
        authServiceFactory.login = _login;
        authServiceFactory.logOut = _logOut;
        authServiceFactory.fillAuthData = _fillAuthData;
        authServiceFactory.authentication = _authentication;
        authServiceFactory.refreshToken = _refreshToken;

        return authServiceFactory;
    }
    angular.module('<%= _.camelize(appname) %>').factory('authService',authService);

})();
