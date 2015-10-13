describe('<%= lodash.camelCase(name) %>', function() {
    'use strict';
    beforeEach(module('<%= appname %>'));

	it('should ...', inject(function($filter) {

        var filter = $filter('<%= lodash.camelCase(name) %>');

		expect(filter('input')).toEqual('output');

	}));

});
