app.controller('editUserCtrl', function($scope, $uibModalInstance, scopeParent, type, object, Users, ErrorHandler, Roles, $rootScope, UTCAuth, $location) {
  
  /**
   *  Initialisation de la vue
   */
  $scope.user     = object;
  $scope.errors   = false;
  $scope.saving   = false;
  $scope.entities = scopeParent.entities;
  $scope.type = type
  $scope.suggestedUsers = [];
  $scope.loginSearch = {}

  /**
   * Récupération des rôles
   */
  Roles.get({}, function (roles) {
      $scope.roles = roles.data;
  }, function (error) {
      ErrorHandler.alert(error);
  });

  /**
  * Suggestion login
  */
  $scope.autocomplete = function () {
    if ($scope.loginSearch.string.length > 3) {
        $scope.loading = true;
        Users.gingerSearch({'query': $scope.loginSearch.string}, function (data) {
            $scope.suggestedUsers = data.data;
            $scope.loading = false;
        }, function (error) {
            ErrorHandler.alert(error);
        });
    } else {
        $scope.suggestedUsers = [];
    }
  }

  /**
  * Selection d'un utilisateur des suggestions
  */
  $scope.selectUser = function (login) {
      $scope.loading = true;
      $scope.suggestedUsers = [];
      Users.gingerLogin({'login': login}, function (data) {
          data = data;
          $scope.user = {
              firstName: data.prenom,
              lastName: data.nom,
              login: data.login,
              email: data.mail,
              status: data.type,
              terms: false
          };
          $scope.loginSearch.string = '';
          $scope.loading = false;
      }, function (error) {
          $scope.loading = false;
          if (error.status == 404) {
              $scope.errors.message = "Impossible de trouver l'utilisateur '"+login+"'.";
          } else {
              ErrorHandler.alert(error);
          }
      })
  }


  /**
   *  Enregistre les modifications
   */
  $scope.save = function () {
      $scope.errors = false;
      $scope.saving = true;

      if($scope.user.entity_id == null){
        delete $scope.user.entity_id
      }

      if($scope.type=="create"){
        Users.save({}, $scope.user, function (data) {
            $scope.saving = false;
            $uibModalInstance.close();
        }, function (error) {
            $scope.errors = ErrorHandler.parse(error);
            $scope.saving = false;
        });
      } else if ($scope.type=="edit"){
        //Problème entity_id
        if ($scope.user.entity_id == null) {
          delete $scope.user.entity_id
        }
        Users.update({id : $scope.user.id}, $scope.user, function(data){
          if ($scope.user.login == $rootScope.auth.member.login) {
            UTCAuth.clear()
            $location.path('/login')
          }
          $uibModalInstance.close();
          $scope.saving = false;
        }, function(error){
          $scope.errors = ErrorHandler.parse(error);
          $scope.saving = false;
        });
      }
  };

  /**
   *  Ferme la vue modal
   */
  $scope.cancel = function () {
      $uibModalInstance.dismiss('cancel');
  };

  /**
   *  Suppression de l'utilisateur => Passage en mode Membre CAS
   */
  $scope.deleteModal = function () {
        var  membreCAS = $scope.roles.filter((r)=>r.name == "Membre CAS")[0];

        if (membreCAS) {
            $scope.user.role_id = membreCAS.id
            if($scope.user.entity_id == null){
                delete $scope.user.entity_id
            }

            Users.update({id : $scope.user.id}, $scope.user, function(data){
              $uibModalInstance.close();
            }, function(error){
              ErrorHandler.alert(error);
            });
        }
      // $uibModalInstance.close();
  };



})