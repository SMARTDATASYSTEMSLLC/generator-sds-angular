describe('camelCase', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('camelCase');

		expect(filter('input file')).toEqual('inputFile');

	}));

});
