(function (){
    'use strict';
    angular.module('<%= _.camelize(appname) %>')
        .constant("globalConstants", {
            environment: 'local',
            apiServiceBaseUri: "http://localhost",
            authServiceUri: "http://localhost/oauth2/token",
            clientId: "123"
        });
})();
