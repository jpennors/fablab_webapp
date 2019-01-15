app.directive('showProducts', function() {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      products : '=productsData',
      callback : '&productsCallback',
    },
    controller: function($scope, $element, $attrs) {

    },
    templateUrl: 'app/directives/showProducts/products_show.html',
  };
});
