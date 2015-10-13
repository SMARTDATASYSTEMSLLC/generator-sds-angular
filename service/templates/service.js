(function (){
    'use strict';
    function <%= lodash.camelCase(name) %>() {
        var self = {};
        return self;
    }

    angular.module('<%= appname %>').factory('<%= lodash.camelCase(name) %>',<%= lodash.camelCase(name) %>);

})();
