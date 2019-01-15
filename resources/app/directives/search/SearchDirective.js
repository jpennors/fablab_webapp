app.directive('search', function() {
    return {
        restrict: 'EA',
        scope: {},
        controller: function($scope) {
            $scope.checkIfEnterKeyWasPressed = function($event){
                var keyCode = $event.which || $event.keyCode;
                if (keyCode === 13) {
                    window.location.href = '#/search/?q='+$scope.q;
                }

            };
        },
        template : '<input ng-keypress="checkIfEnterKeyWasPressed($event)" ng-model="q" type="text" size="40" placeholder="Recherche..." />',
    }
});
