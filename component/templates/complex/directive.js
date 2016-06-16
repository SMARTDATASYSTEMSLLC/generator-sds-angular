(function () {
    'use strict';
    function <%= lodash.camelCase(name) %>Controller () {

    }

    angular.module('<%= appname %>').component('<%= lodash.camelCase(name) %>', {
          templateUrl: '<%= htmlPath %>',
          controller: <%= lodash.camelCase(name) %>Controller,
          bindings: {
           
          }
    });

})();
