app.directive('confirm', function(ConfirmFactory) {
    return {
        restrict: 'A',
        scope: {
            eventHandler: '&ngClick'
        },
        link: function(scope, element, attrs){
          element.unbind("click");
          element.bind("click", function(e) {
            ConfirmFactory.open(attrs.confirm, scope.eventHandler);
          });
        }
    }
});
