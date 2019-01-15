app.directive('csvEngines', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
        items : '=',
        headers : '='
    },
    templateUrl: 'app/directives/csv/csvEngines/csv_engines.html',
  };
});

