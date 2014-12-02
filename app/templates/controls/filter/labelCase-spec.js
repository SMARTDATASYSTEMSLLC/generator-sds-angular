describe('labelCase', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('labelCase');

		expect(filter('inputTest')).toEqual('Input Test');

	}));

});
