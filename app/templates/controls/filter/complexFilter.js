/*
    This filter will take an object of filters to reduce from:
    {
        columnName1: "value"
        ColumnName2: 11
        ColumnName3: [rangeStart, rangeEnd],
        all: "general filter"
    }
 */
(function (){
    'use strict';

    function complexFilter ($filter){
        return function(input,arg) {
            if (typeof arg === "string"){
                return $filter('filter')(input, arg);

            }else {

                var filters = [];
                _.each(arg, function (col) {
                    if (col.type === 'date' && col.filter) {
                        var d = col.filter.split("-");
                        var d1 = moment(d[0]);
                        var d2 = moment(d[1] || d1.clone().endOf('day'));
                        if (d1.isValid() && d2.isValid()) {
                            filters.push({
                                filter: [d1.valueOf(), d2.valueOf()],
                                key: col.key,
                                type: col.type
                            });
                        }
                    } else if (col.type === 'number' && col.filter) {
                        var n = col.filter.split("-");
                        var n1 = parseFloat(n[0]);
                        var n2 = parseFloat(n[1] || n[0]);
                        filters.push({
                            filter:[n1, n2],
                            key: col.key,
                            type:col.type
                        });
                    }else if (typeof col.filter === 'string'){
                        filters.push({
                            filter:col.filter.toLowerCase(),
                            key: col.key
                        });
                    }
                });


                return _.filter(input, function (item) {
                    return _.all(filters, function (col) {
                        if (!col.filter || !col.key) {
                            return true;
                        } else if (!col.type) {
                            return (item[col.key] + "").toLowerCase().indexOf(col.filter) > -1;
                        } else if (col.type === 'date') {
                            var d = moment(item[col.key]).valueOf();
                            return d >= col.filter[0] && d <= col.filter[1];
                        } else if (col.type === 'number') {
                            return item[col.key] >= col.filter[0] && item[col.key] <= col.filter[1];
                        }
                    });
                });
            }


        };
    }

    angular.module('<%= _.camelize(appname) %>').filter('complexFilter', complexFilter);
})();
