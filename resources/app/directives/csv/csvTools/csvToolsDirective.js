app.directive('csvTools', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvTools/csv_tools.html',
  };
});

