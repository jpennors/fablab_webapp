/*
 *  Gestion des utilisateurs: clients, permanenciers, admins
 */
app.controller('adminUsersCtrl', function($scope, $http, $log, $uibModal, ErrorHandler, Users, Roles, Entities, $rootScope, $location){

  //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
  if(!$rootScope.can('list-user'))
    $location.path("/error/404");

  else{

    $scope.users    = [];
    $scope.roles    = [];
    $scope.entities = [];

    /**
     * Récupération des rôles
     */
    Roles.get({}, function (roles) {
        $scope.roles = roles.data;
        // Remove Membre CAS Role
        for (var i = $scope.roles.length - 1; i >= 0; i--) {
          if ($scope.roles[i].name == "Membre CAS" ) {
            $scope.roles.splice(i, 1)
          }
        }
    }, function (error) {
        ErrorHandler.alert(error);
    });

    /**
     * Récupération des entités
     */
    Entities.get({}, function (data) {
        $scope.entities = data.data;
    }, function (error) {
        ErrorHandler.alert(error);
    });

    $scope.unselectedRoles = [];
    
    $scope.loading = true; // affichage du loader

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

    /*
     *  Récupère l'index de l'user dans le tableau users
     */
    $scope.getUserIndex = function(id) {
      var index = $scope.users.indexOf($scope.users.find(function(user){
        return user.id == id;
      }));
      return index;
    };

    /*
     *  Récupération des utilisateurs
     */
    $scope.refreshUsers = function() {
        Users.get({}, function(data){
            $scope.users = data.data;
        }, function(error) {
            ErrorHandler.alert(error);
        });
    }
    $scope.refreshUsers();

    /*
     *  Fenêtre de création d'un User
     */
    $scope.open = function(type, id) {
        if (id){
          var index = $scope.getUserIndex(id);
        }
        //Préparation des paramètres de la fenêtre
        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            // Url du template HTML
            templateUrl: 'app/components/admin_users/modal/edit_user.html',
            resolve: {
                //On passe à la fenêtre modal une référence vers le scope parent.
                scopeParent: function () {
                    return $scope;
                },
                type: function() {
                    return type;
                },
                object: function() {
                  return $scope.users[index];
                }
            },
          //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
          controller: 'editUserCtrl'
        });
        modalInstance.result.then(function() {
            $scope.refreshUsers();
        })  
    };

   /*
   *  Fenêtre de synchronisation d'un utilisateur
   */
    $scope.synchUsers = function() {

        var modalInstance = $uibModal.open({
            backdrop: true,
            keyboard: true,
            size: 'lg',
            // Url du template HTML
            templateUrl: 'app/components/admin_users/modal/sync_users.html',
            resolve: {
                //On passe à la fenêtre modal une référence vers le scope parent.
                scopeParent: function() {
                    return $scope;
                }
            },
            //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
            controller: 'syncUserCtrl'
        });

        modalInstance.result.then(function() {
            $scope.refreshUsers();
        })  
      };
  }
});
