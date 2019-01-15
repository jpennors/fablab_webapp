app.directive('csvExpendables', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvExpendables/csv_expendables.html',
  };
});

