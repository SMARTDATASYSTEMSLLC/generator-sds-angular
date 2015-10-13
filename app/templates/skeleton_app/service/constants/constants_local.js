(function (){
    'use strict';
    angular.module('<%= lodash.camelCase(appname) %>')
        .constant("globalConstants", {
            environment: 'local',
            apiServiceBaseUri: "http://localhost",
            authServiceUri: "http://localhost/oauth2/token",
            clientId: "123"
        });
})();
