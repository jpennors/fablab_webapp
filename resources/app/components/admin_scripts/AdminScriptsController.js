/*
 *  Gestion des scripts de prix de services
 */
app.controller('adminScriptsCtrl', function($scope, $http, $location, ErrorHandler, Scripts, $location, $rootScope, $uibModal){

  //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
  if(!$rootScope.can('list-price'))
      $location.path("/error/404");

  else{

    $scope.scripts = [];

    /*
     *  Mise à jour des scripts
     */
    $scope.update = function(){
      Scripts.get({}, function(data){
        $scope.scripts = data.data;
      }, function(error) {
        ErrorHandler.alert(error);
      });
    }

    $scope.update();

    /*
     *  Ouverture de la vue modale pour l'édition
     */
    $scope.open = function(script, type) {
      //Préparation des paramètres de la fenêtre
      var modalInstance = $uibModal.open({
          backdrop: true,
          keyboard: true,
          size:'lg',
          // Url du template HTML
          templateUrl: 'app/components/admin_scripts/modal/edit_script.html',

          resolve: {
              //On passe à la fenêtre modal une référence vers le scope parent.
              script: function() {
                return script;
              },
              type: function(){
                return type
              }
          },
          //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
          controller: 'editScriptCtrl'
      });
      modalInstance.result.then(function() {
        $scope.update();
      })

    };

    /*
     *  Callback pour la directive d'affichage des scripts
     */
    $scope.goEdit = function(script) {
      $location.path("/admin/scripts/" + script.id + "/edit");
    }
  }

});
