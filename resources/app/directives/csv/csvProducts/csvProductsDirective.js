app.directive('csvProducts', function($rootScope) {
  return {
    restrict: 'E',
    transclude: true,
    scope: {
    	items : '=',
    	headers : '='
    },
    templateUrl: 'app/directives/csv/csvProducts/csv_products.html',
  };
});

