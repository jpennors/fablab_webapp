app.controller('usersCtrl', function($scope, $http, $filter, ErrorHandler, Users) {

  Users.get({}, function(res){
    $scope.users = res.data;
  }, function(error){
    ErrorHandler.alert(error);
  });

  // Affiche les détails d'un utilisateur lorsqu'il est cliqué
  $scope.displayUser = function(userId) {
    var found = $filter('filter')($scope.users, {id: userId}, true);
    if (found.length) {
       $scope.user = found[0];
    }
  }

});
