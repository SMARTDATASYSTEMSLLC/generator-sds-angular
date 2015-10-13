(function (){
    'use strict';
    function AboutCtrl (){
        var vm = this;
    }

    angular.module('<%= lodash.camelCase(appname) %>').controller('AboutCtrl', AboutCtrl);

})();
