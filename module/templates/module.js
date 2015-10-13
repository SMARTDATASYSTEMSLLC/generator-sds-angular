(function (){
    'use strict';
    angular.module('<%= lodash.camelCase(name) %>', ['ui.bootstrap','ui.utils','<%= routerModuleName %>','ngAnimate']);
    //<% if (!uirouter) { %>
    angular.module('<%= lodash.camelCase(name) %>').config(function($routeProvider) {

    });
    //<% } %><% if (uirouter) { %>
    angular.module('<%= lodash.camelCase(name) %>').config(function($stateProvider) {

    });
    //<% } %>
})();
