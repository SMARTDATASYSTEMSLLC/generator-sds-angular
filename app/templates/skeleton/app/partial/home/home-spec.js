describe('HomeCtrl', function() {
    'use strict';
	beforeEach(module('app'));

	var scope,ctrl;

    beforeEach(inject(function($rootScope, $controller) {
      scope = $rootScope.$new();
      ctrl = $controller('HomeCtrl', {$scope: scope});
    }));

	it('should ...', inject(function() {

		expect(1).toEqual(1);

	}));

});