(function (){
    'use strict';
    angular.module('<%= lodash.camelCase(appname) %>')
        .constant("globalConstants", {
            environment: 'uat',
            apiServiceBaseUri: "https://replacethis",
            authServiceUri: "https://replacethis/oauth2/token",
            clientId: "123"
        });
})();
