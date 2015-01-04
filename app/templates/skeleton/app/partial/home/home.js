(function (){
    'use strict';
    function HomeCtrl (){
        var vm = this;
    }

    angular.module('<%= _.camelize(appname) %>').controller('HomeCtrl', HomeCtrl);

})();
