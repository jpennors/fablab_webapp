app.controller('usersShowCtrl', function($scope, $http, $filter, $routeParams, ErrorHandler, Users) {

  Users.get({ id : $routeParams.id }, function(res) {
    $scope.user = res.data;
  }, function(error) {
    ErrorHandler.alert(error);
  });

});
