(function () {
    'use strict';
    function formField (FieldTypes, $filter) {
        return {
            restrict: 'EA',
            templateUrl: 'directive/formField/formField.html',
            //replace: true,
            scope: {
                record          : '=', //two-way binding
                field           : '@', //one-way binding
                items           : '=?',
                placeholder     : '@?',
                live            : '@',
                type            : '@',
                fieldType       : '@?', //pass in for special types - ie. 'textarea'  'quickdatepicker', 'toggle' 'select' - default is 'input'
                onLabel         : '@?',
                offLabel        : '@?',
                toggleSwitchType: '@?', //primary, success, info, danger, warning, inverse default is primary
                mask            : '@',
                label           : '@?',
                isRequired      : '=?',
                layout          : '@?', //stacked or inline - default is stacked
                labelLayoutCss  : '@?', //default col-sm-3
                inputLayoutCss  : '@?', //default col-sm-5
                errorLayoutCss  : '@?',  //default col-sm-4
                hideValidationMessage : '=?', //default is false,
                disableTimepicker : '=?',
                showLabel : '=?',
                dateFormat      : '@?'


            },
            require: '^form', //^parent of our directive, a child form of form above it
            link: function ($scope, element, attr, form) {
                $scope.types = FieldTypes;
                //console.log($scope.isRequired, attr.isRequired);
                $scope.fieldType = $scope.fieldType || "input";
                $scope.layout = $scope.layout || 'stacked';
                $scope.isRequired = $scope.isRequired || false;
                $scope.showLabel = $scope.showLabel || true;
                $scope.hideValidationMessage = $scope.hideValidationMessage || false;
                if($scope.layout === 'inline') {
                    $scope.labelLayoutCss = $scope.labelLayoutCss || "col-md-3";
                    $scope.inputLayoutCss = $scope.inputLayoutCss || "col-md-5";
                    $scope.errorLayoutCss = $scope.errorLayoutCss || "col-md-4";
                }

                //switch
                $scope.toggleSwitchType = $scope.toggleSwitchType || "primary";
                $scope.onLabel = $scope.onLabel || "Yes";
                $scope.offLabel = $scope.offLabel || "No";

                //quick data picker
                $scope.disableTimepicker = $scope.disableTimepicker || false;
                $scope.dateFormat = $scope.dateFormat || "MM-dd-yyyy";



                if(!$scope.label){
                    $scope.label = $filter("labelCase")($scope.field);
                }
                var inputField = element.find('.inputField');

                if($scope.mask){
                    inputField.mask($scope.mask);
                }
            }
        };
    }

    angular.module('<%= _.camelize(appname) %>').value('FieldTypes', {
        text        : ['Text', 'should be text'],
        email       : ['Email', 'should be an email address'],
        number      : ['Number', 'should be a number'],
        date        : ['Date', 'should be a date'],
        datetime    : ['Datetime', 'should be a datetime'],
        time        : ['Time', 'should be a time'],
        month       : ['Month', 'should be a month'],
        week        : ['Week', 'should be a week'],
        url         : ['URL', 'should be a URL'],
        tel         : ['Phone Number', 'should be a phone number'],
        color       : ['Color', 'should be a color']
    }).directive('formField', formField);
})();
