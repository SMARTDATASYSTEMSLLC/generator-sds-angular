describe('AboutCtrl', function() {
    'use strict';
	beforeEach(module('<%= lodash.camelCase(appname) %>'));

	var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('AboutCtrl', {$scope: scope});
    }));

	it('should ...', inject(function() {

		expect(1).toEqual(1);

	}));

});
