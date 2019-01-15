app.directive('modalConfirm', function() {
  return {
    restrict: 'E',
    scope: {
      object : '@object',
      yes : '&yes',
      no : '&no',
    },
    controller: function($scope, $element, $attrs) {

    },
    templateUrl: 'app/directives/modalConfirm/modal_show.html'
  };
});
