(function () {
    'use strict';
    function <%= lodash.capitalize(lodash.camelCase(name)) %>Controller () {
        var $ctrl = this;
    }

    angular.module('<%= appname %>').component('<%= lodash.camelCase(name) %>', {
        templateUrl: '<%= htmlPath %>',
        controller: <%= lodash.capitalize(lodash.camelCase(name)) %>Controller,
        bindings: {

        }
    });

})();
