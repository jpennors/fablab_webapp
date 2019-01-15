/*
 *  Gestion des Entities
 */
app.controller('adminEntitiesCtrl', function($scope, $http, ErrorHandler, $uibModal, Entities, $rootScope, $location){

  //On vérifie que l'utilisateur a l'autorisation d'accéder à la page
  if(!$rootScope.can('edit-entity'))
      $location.path("/error/404");

  else{

    $scope.entities = [];

    /*
     *  Mise à jour des Entities
     */
    $scope.update = function() {
      // Chargement des Adresses
      Entities.get({}, function(data){
        $scope.entities = data.data;
      }, function(error){
        ErrorHandler.alert(error);
      });
    };

    $scope.update();

    /*
     *  Ouverture de la vue modale pour l'édition
     */
    $scope.open = function(entity, type) {
      //Préparation des paramètres de la fenêtre
      var modalInstance = $uibModal.open({
          backdrop: true,
          keyboard: true,
          // Url du template HTML
          templateUrl: 'app/components/admin_entities/modal/edit_entity.html',

          resolve: {
              //On passe à la fenêtre modal une référence vers le scope parent.
              entity: function() {
                return entity;
              },
              type: function(){
                return type
              }
          },
          //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
          controller: 'editEntityCtrl'
      });
      modalInstance.result.then(function() {
        $scope.update();
      })

    };
  }
});
