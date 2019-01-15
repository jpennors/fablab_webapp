app.directive('outWrapper', function($rootScope) {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {},
    controller: function($rootScope, $scope, $element, $attrs) {
    },
    templateUrl: 'app/directives/outWrapper/out_wrapper.html',
  };
});
