(function (){
    'use strict';
    function authService($injector, $q, $timeout, $rootScope, $location, $cacheFactory, jwtHelper, $window) {
        var self = {};

        var _clearLocalStorage = function(){
            self.authentication = {
                isAuth: false,
                userName: "",
                userId: null,
                roles: [],
                useRefreshTokens: true,
                refreshToken: null,
                token: null
            };

            $window.localStorage.clear();
            $location.path("/login");
        };

        var _processResponse = function(response, username){
            var tokenPayload = jwtHelper.decodeToken(response.token);

            //we need to set this data before we can make a next request because the next request requires the token...

            var roles = tokenPayload.roles;

            if(!roles && roles.length === 0){
                //because we don't want to reload the login - we want to show the message
                //and we want to make sure the token is deleted!
                self.logOut(false);
                throw {
                    error_description: "Access Denied"
                };
            }

            self.authentication.isAuth = true;
            self.authentication.token = response.access_token;
            self.authentication.refreshToken = response.refresh_token || null;
            self.authentication.userName = username;
            self.authentication.userId = tokenPayload.globalUserId;
            self.authentication.roles = roles;

            try {
                $window.localStorage['authorizationData'] = self.authentication;
            }catch(err){
                return $q.reject({error_description: 'This application does not support private browsing mode. Please turn off private browsing to log in.'});
            }

        };

        self.authentication = {
            isAuth: false,
            userName: "",
            userId: null,
            roles: [],
            useRefreshTokens: true,
            refreshToken: null,
            token: null
        };

        self.saveRegistration = function (registration) {
            self.logOut();

            return $injector.get('$http').post('/api/account/register', registration).then(function (response) {
                return response;
            });

        };

        self.login = function (loginData) {
            return $injector.get('$http').post('/api/auth', {username: loginData.username, password: loginData.password})
                .then(function (response) {
                    //decode the token to get the data we need:
                    return _processResponse(response.data, loginData.username);
                }, function (err, status) {
                    _clearLocalStorage();
                    return $q.reject(err);
                });

        };

        //logOffUser optional parameter
        self.logOut = function (logOffUser) {
            if(logOffUser === undefined){
                logOffUser = true;
            }
            if(self.authentication.userId) {
                self.deleteToken().then(function(){ //need to send in header
                    _clearLocalStorage();
                    $cacheFactory.get('$http').removeAll();
                    if(logOffUser ) {
                        $rootScope.$broadcast("auth:userLogOff");
                    }
                });
            }else {
                $timeout(function (){
                    _clearLocalStorage();
                    $cacheFactory.get('$http').removeAll();
                    if (logOffUser) {
                        $rootScope.$broadcast("auth:userLogOff");
                    }
                });
            }
            $location.path("/login").replace();
        };

        self.deleteToken = function(){
            var deleteTokenUri =  "/api/auth/refresh" + self.authentication.userId + "/";
            return $injector.get('$http').delete(deleteTokenUri);
        };

        self.refreshToken = function () {
            var authData = $window.localStorage['authorizationData'];

            if (authData && authData.useRefreshTokens) {
                $window.localStorage.removeItem('authorizationData');

                return $injector.get('$http').post('/api/auth/refresh', { refresh: authData.refreshToken })
                    .then(function (response) {
                        return _processResponse(response.data, authData.userName);
                    }, function (err, status) {
                        _clearLocalStorage();
                        return $q.reject(err);
                    });
            }

            return $q.reject();
        };

        self.fillAuthData = function () {
            var authData = $window.localStorage['authorizationData'];
            if (authData) {
                self.authentication = authData;
            }
        };

        self.fillAuthData();

        return self;

    }

    angular.module('<%= lodash.camelCase(appname) %>').factory('authService',authService);

})();
