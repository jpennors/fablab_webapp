app.directive('showUsers', function(Roles, ErrorHandler) {
  return {
    restrict: 'EA',
    transclude: true,
    scope: {
      users : '=usersData',
      title : '@usersTitle',
      callback : '&usersClick',
      maxSize: '@?',
      maxItems: '@?'
    },
    controller: function($scope, $element, $attrs) {
      $scope.roles = [];
      $scope.unselectedRoles = [];
      Roles.get({}, function (data) {
          $scope.roles = data.data;
      }, function (error) {
          ErrorHandler.alert(error);
      });
      $scope.currentPage  = 1;  // Page de départ
      $scope.loading = true; // affichage du loader

      if ($scope.maxSize == undefined)
        $scope.maxSize  = 5;  // Nombre max de boutons de pagination avant de mettre des ...
      if ($scope.maxItems == undefined)
        $scope.maxItems = 2;  // Nombre max d'items par page de pagination

      // Vu que le tableau users est récupéré de façon asynchrone,
      // la directive est initialisée avc un tableau vide.
      // Il faut donc faire un watcher sur le tableau users
      // pour mettre à jour la directive quand il est rempli
      $scope.$watch("users", function(newValue, oldValue) {
        $scope.totalItems   = $scope.users.length;
        $scope.itemsPerPage = Math.min($scope.users.length, $scope.maxItems);
        if ($scope.totalItems > 0) {
            $scope.loading = false;
        }
      });

      // Lorsqu'on fait une recherche, on désactive la pagination
      $scope.$watch("userSearch", function(newValue, oldValue) {
        if(newValue !== '')
          $scope.itemsPerPage = $scope.users.length;
        else
          $scope.itemsPerPage = Math.min($scope.users.length, $scope.maxItems);
      });

      $scope.inRole = function(user) {
          return !$scope.unselectedRoles.includes(user.role_id);
      }
      $scope.toggleRole = function(role) {
        role.selected = !role.selected;
        if($scope.unselectedRoles.includes(role.id)) {
            var index = $scope.unselectedRoles.indexOf(role.id);
            $scope.unselectedRoles.splice(index, 1);
        } else {
            $scope.unselectedRoles.push(role.id);
        }
      }
    },
    templateUrl: 'app/directives/showUsers/users_show.html',
  };
});
