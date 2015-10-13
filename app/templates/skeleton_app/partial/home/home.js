(function (){
    'use strict';
    function HomeCtrl (){
        var vm = this;
    }

    angular.module('<%= lodash.camelCase(appname) %>').controller('HomeCtrl', HomeCtrl);

})();
