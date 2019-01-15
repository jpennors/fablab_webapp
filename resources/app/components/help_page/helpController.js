app.controller('helpCtrl', function($scope, $location, $rootScope) {

    if ($rootScope.isExtern()) {
        $location.path("/error/404")
    }

});
