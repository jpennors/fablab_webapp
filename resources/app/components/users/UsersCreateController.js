app.controller('usersCreateCtrl', function($scope, ErrorHandler, Users) {

  // Pour désactiver le boutton de soumission
  $scope.submiting = false;

  // Pour informer de la réussite de l'update
  $scope.submited = false;
  $scope.success = false;

  // Création de l'User
  $scope.user = new Users({});

  // Lorsque le boutton de soumission est cliqué
  $scope.submit = function() {
    $scope.submiting = true;
    $scope.submited = false;
    $scope.success = false;

    // Envoi de la requête POST
    $scope.user.$save({}, function(res) {
      $scope.submited = true;
      $scope.submiting = false;
      $scope.success = true;
    }, function(error) {
      $scope.submiting = false;
      $scope.submited = true;
      $scope.success = false;

      if(error.status == 422) {
        // On affiche les messages d'erreurs
        $scope.inputErrors = ErrorHandler.parse(error);
      }
      else if(error.status == 409) {
        $scope.messageError = "Cet utilisateur existe déjà";
      }

    });
  };


});
