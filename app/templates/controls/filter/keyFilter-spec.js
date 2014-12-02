describe('keyFilter', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('keyFilter');

		expect(filter(['a', 'b'])).toEqual({ 0 : 'a', 1 : 'b' });

	}));

});
