(function (){
    'use strict';
    angular.module('<%= _.camelize(name) %>', ['ui.bootstrap','ui.utils','<%= routerModuleName %>','ngAnimate']);
    <% if (!uirouter) { %>
    angular.module('<%= _.camelize(name) %>').config(function($routeProvider) {

    });
    <% } %><% if (uirouter) { %>
    angular.module('<%= _.camelize(name) %>').config(function($stateProvider) {

    });
    <% } %>
})();
