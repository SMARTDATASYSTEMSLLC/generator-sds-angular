(function (){
    'use strict';
    function LoginCtrl (authService, $location){
        var vm = this;

        vm.message = "";

        vm.user = {
            username: null,
            password: null,
            confirmPassword: null,
            rememberMe: true,
            useRefreshTokens: false
        };

        vm.submit = function (form){
            vm.message = "";
            if (form.$valid) {
                authService.login(vm.user).then(function(response) {
                    $location.path("/");
                }, function (err){
                    vm.message = "Invalid Login";
                });
            }
        };

    }

    angular.module('hapiAngular').controller('LoginCtrl', LoginCtrl);

})();
