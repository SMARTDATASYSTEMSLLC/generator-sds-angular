describe('clientGrid', function() {
    'use strict';
    beforeEach(module('<%= _.camelize(appname) %>'));

  var scope,compile;

  beforeEach(inject(function($rootScope,$compile) {
    scope = $rootScope.$new();
    compile = $compile;

  }));

  it('should allow switching a sort order', function() {

      scope.data = [{a: 'john', b: '25'}, {a: 'larry', b: 34}];
      scope.cols = [
          {key: 'a', sortable: true},
          {key: 'b', sortable: true}
      ];

      var element = compile('<client-grid cols="cols" data="data"></client-grid>')(scope);
      scope.$digest();

      var isolateScope = element.isolateScope();

      isolateScope.vm.toggleSort(1);

      expect(isolateScope.vm.sort).toBe(1);
      expect(isolateScope.vm.sortAsc).toBe(false);

      isolateScope.vm.toggleSort(1);


      expect(isolateScope.vm.sort).toBe(1);
      expect(isolateScope.vm.sortAsc).toBe(true);
  });

    //it('should allow clearing all filters', function() {
    //
    //    scope.data = [{a: 'john', b: '25'}, {a: 'larry', b: 34}];
    //    scope.cols = [
    //        {key: 'a', sortable: true},
    //        {key: 'b', sortable: true}
    //    ];
    //
    //    var element = compile('<client-grid cols="cols" data="data"></client-grid>')(scope);
    //    scope.$digest();
    //
    //    var isolateScope = element.isolateScope();
    //
    //    // TODO
    //
    //});
    //it('should go to the first link if there is one option and the user presses enter', function() {
    //
    //    scope.data = [{a: 'john', b: '25'}, {a: 'larry', b: 34}];
    //    scope.cols = [
    //        {key: 'a', sortable: true},
    //        {key: 'b', sortable: true}
    //    ];
    //
    //    var element = compile('<client-grid cols="cols" data="data"></client-grid>')(scope);
    //    scope.$digest();
    //
    //    var isolateScope = element.isolateScope();
    //
    //    isolateScope.vm.toggleSort(1);
    //
    //
    //});
    //it('should fire a callback when a user clicks on a link', function() {
    //
    //    scope.data = [{a: 'john', b: '25'}, {a: 'larry', b: 34}];
    //    scope.cols = [
    //        {key: 'a', sortable: true},
    //        {key: 'b', sortable: true}
    //    ];
    //
    //    var element = compile('<client-grid cols="cols" data="data"></client-grid>')(scope);
    //    scope.$digest();
    //
    //    var isolateScope = element.isolateScope();
    //
    //
    //});
    it('should render a custom template', function() {

        scope.data = [{a: 'john'}, {a: 'larry'}];
        scope.cols = [
            {key: 'a', sortable: true, template: '<div class="myClass">{{a}}</div>'}
        ];

        var element = compile('<client-grid cols="cols" data="data"></client-grid>')(scope);
        scope.$digest();

        expect(element.find('.myClass:first').text()).toBe('john');


    });

});
