app.controller('usersEditCtrl', function($scope, $http, $filter, $routeParams, ErrorHandler, Users) {

  // Pour désactiver le boutton de soumission
  $scope.submiting = false;

  // Pour informer de la réussite de l'update
  $scope.submited = false;
  $scope.success = false;

  // Récupération de l'User
  Users.get({ id : $routeParams.id }, function(res) {
    $scope.user = res.data;
  }, function(error) {
    ErrorHandler.alert(error);
  });

  // Lorsque le boutton de soumission est cliqué
  $scope.submit = function() {
    $scope.submiting = true;
    $scope.submited = false;
    $scope.success = false;
    $scope.inputErrors = false;
    $scope.messageError = false;

    // Envoi de la requête PUT
    Users.update({id:$routeParams.id}, $scope.user, function(res) {
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
        $scope.messageError = "cet utilisateur existe déjà";
      }

    });
  };


});
