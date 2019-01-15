app.directive('showErrors', function() {
    return {
        restrict: 'EA',
        transclude: true,
        scope: {
            errors : '=errorsData'
        },
        templateUrl: 'app/directives/showErrors/errors_show.html',
    };
});
