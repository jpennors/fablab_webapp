/*
 *  Gestion des données de base du site
 */
app.controller('adminSettingsCtrl', function($scope, $http, $q, ErrorHandler, Administratives, $rootScope, $location){

  //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
  if(!$rootScope.can('super-admin'))
    $location.path("/error/404");

  else{
    $scope.saving   = false;
    $scope.error    = false;
    $scope.success  = false;

    /*
     *  Récupération de toutes les données Administratives
     */
    Administratives.get({}, function(data){
      $scope.admins = data.data;
    }, function(error) {
      ErrorHandler.alert(error);
    });

    /*
     *  Récupération de toutes les données Administratives
     */
    $scope.update = function() {
      $scope.saving   = true;
      $scope.success  = false;
      $scope.error    = false;

      var done = 0;

      for(var i=0; i<$scope.admins.length; i++) {
        Administratives.update({'id' : $scope.admins[i].id}, $scope.admins[i], function(data){
          done++;
          if(done == $scope.admins.length) {
            $scope.saving   = false;
            $scope.success  = true;
          }
        }, function(error) {
          $scope.saving   = false;
          $scope.success  = false;
          $scope.errors    = error.data.meta;
          return false;
        });
      }

    };
  }

});
