app.directive('csvScripts', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
    	items : '=',
    	headers : '='
    },
    templateUrl: 'app/directives/csv/csvScripts/csv_scripts.html',
  };
});

