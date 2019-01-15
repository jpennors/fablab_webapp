app.directive('inWrapper', function($rootScope) {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {},
        controller: function($rootScope, $scope, $element, $attrs) {
        },
        templateUrl: 'app/directives/inWrapper/in_wrapper.html',
    };
});
