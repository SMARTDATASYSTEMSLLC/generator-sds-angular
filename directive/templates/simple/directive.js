(function () {

    function <%= _.camelize(name) %> (){
        return {
            restrict: 'A',
            link: function (scope, element, attrs, fn) {


            }
        };
    }

    angular.module('<%= appname %>').directive('<%= _.camelize(name) %>',<%= _.camelize(name) %>);
})();
