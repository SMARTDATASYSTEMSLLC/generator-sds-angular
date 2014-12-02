describe('onEnter', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

  var scope,compile;

  beforeEach(inject(function($rootScope,$compile) {
    scope = $rootScope.$new();
    compile = $compile;
  }));

  it('should fire the callback when the user hits enter', function() {

      scope.fireCallback = jasmine.createSpy("fireCallback");

      var element = compile('<input type="text" on-enter="fireCallback()" />')(scope);

      element.trigger({type: 'keypress', which:13});

      expect(scope.fireCallback).toHaveBeenCalled();
  });

    it('should not fire the callback when the user hits another key', function() {

        scope.fireCallback = jasmine.createSpy("fireCallback");

        var element = compile('<input type="text" on-enter="fireCallback()" />')(scope);

        element.trigger({type: 'keypress', which:17});

        expect(scope.fireCallback).not.toHaveBeenCalled();
    });
});
