(function (){
    'use strict';

    function unsafe ($sce) { return $sce.trustAsHtml; }

    angular.module('<%= _.camelize(appname) %>').filter('unsafe', unsafe);
})();
