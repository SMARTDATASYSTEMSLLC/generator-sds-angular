(function (){
    'use strict';
    function AboutCtrl (){
        var vm = this;
    }

    angular.module('<%= _.camelize(appname) %>').controller('AboutCtrl', AboutCtrl);

})();
