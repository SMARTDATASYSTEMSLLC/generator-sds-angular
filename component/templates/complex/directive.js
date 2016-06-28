(function () {
    'use strict';
    function <%= lodash.upperFirst(lodash.camelCase(name)) %>Controller () {
        var $ctrl = this;
    }

    angular.module('<%= appname %>').component('<%= lodash.camelCase(name) %>', {
        templateUrl: '<%= htmlPath %>',
        controller: <%= lodash.upperFirst(lodash.camelCase(name)) %>Controller,
        bindings: {

        }
    });

})();
