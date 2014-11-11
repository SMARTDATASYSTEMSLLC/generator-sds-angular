(function (){
    function <%= _.camelize(name) %>() {
        var self = {};
        return self;
    }

    angular.module('<%= appname %>').factory('<%= _.camelize(name) %>',<%= _.camelize(name) %>);

})();
