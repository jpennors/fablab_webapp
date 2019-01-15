app.controller('accountCtrl', function($scope, Users, Roles, ErrorHandler, $rootScope, $location) {
  $scope.entities = [];

  Users.self({}, function(data){
    if(!$rootScope.can('list-role')){
      $scope.user = data.data;
    }
    else{
      Roles.get({id: data.data.role_id}, function (role) {
          $scope.user = data.data;
          $scope.user.role = role.data;
      }, function (error) {
          ErrorHandler.alert(error);
      });
    }
  }, function(error){
    ErrorHandler.alert(error);
  });
});
