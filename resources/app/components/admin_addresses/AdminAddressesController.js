/*
 *  Gestion des Addresses
 */
app.controller('adminAddressesCtrl', function($scope, $http, ErrorHandler, $uibModal, Addresses, $rootScope, $location){

//On vérifie que l'utilisateur a l'autorisation d'accéder à la page
  if(!$rootScope.can('list-address'))
      $location.path("/error/404");

  else{
    $scope.addresses = [];

    /*
     *  Mise à jour des Addresses
     */
    $scope.update = function() {
      // Chargement des Adresses
      Addresses.get({}, function(data){
        $scope.addresses = data.data;
      }, function(error){
        ErrorHandler.alert(error);
      });
    };

    $scope.update();

    /*
     *  Ouverture de la vue modale pour l'édition
     */
    $scope.open = function(address, type) {

      //Préparation des paramètres de la fenêtre
      var modalInstance = $uibModal.open({
        backdrop: true,
        keyboard: true,

        // Url du template HTML
        templateUrl: 'app/components/admin_addresses/modal/edit_address.html',

        resolve: {
          //On passe à la fenêtre modal une référence vers le scope parent.
          address: function() {
            return address
          },
          type: function() {
            return type
          }
        },
        //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
        controller: 'editAddressCtrl'
      });

      modalInstance.result.then(function() {
        $scope.update();
      })

    };
  }
});
