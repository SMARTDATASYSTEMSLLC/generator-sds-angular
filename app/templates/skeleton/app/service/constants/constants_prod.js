(function (){
    'use strict';
    angular.module('<%= _.camelize(appname) %>')
        .constant("globalConstants", {
            environment: 'prod',
            apiServiceBaseUri: "https://services.com",
            authServiceUri: "https://replacethis/oauth2/token",
            clientId: "123"
        });
})();
