describe('complexFilter', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

	it('should do a simple filter when a string is passed in', inject(function($filter) {

        var filter = $filter('complexFilter');

        var results = filter([{a: 'john'}, {a: 'greg'}], 'jo');

		expect(results.length).toEqual(1);

	}));

    it('should do a field filter when a complex filter is passed in', inject(function($filter) {

        var filter = $filter('complexFilter');

        var results = filter([{a: 'john', b:'jim'}, {a: 'greg', b: 'jonah'}], [{filter: 'jo', key: 'a'}]);

        expect(results.length).toEqual(1);

    }));

    it('should do a range filter when a dash filter is passed in to a number type', inject(function($filter) {

        var filter = $filter('complexFilter');

        var results = filter([{a: 3}, {a: 6}], [{filter: '1-4', type:'number', key: 'a'}]);

        expect(results.length).toEqual(1);

    }));

    it('should do a date range filter when a dash filter is passed in to a date type', inject(function($filter) {

        var filter = $filter('complexFilter');

        var results = filter([{a: '10/24/2014'}, {a: '11/23/2014'}], [{filter: '10/23/2014-10/25/2014', type:'date', key: 'a'}]);

        expect(results.length).toEqual(1);

    }));


});
