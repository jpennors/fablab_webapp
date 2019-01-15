/*
 *  Gestion des Services
 */
app.controller('adminServicesCtrl', function($scope, $uibModal, ErrorHandler, Services, $location, $rootScope){

	//On vérifie que l'utilisateur a l'autorisation d'accéder à la page
	if(!$rootScope.can('edit-service'))
		$location.path("/error/404");

	else{

		$scope.services = []
		$scope.loading = true

		/*
         *  Mise à jour des Services
         */
        $scope.update = function() {
            // Chargement des Roles
            Services.get({}, function(data){
                $scope.services = data.data;
                for (var i = $scope.services.length - 1; i >= 0; i--) {
                	switch ($scope.services[i].type) {
                		case 'cutting' :
                			$scope.services[i].typeString = "Découpe"
                			break
                		case 'printing' :
                			$scope.services[i].typeString = "Impression"
                			break
                		case 'other' :
                			$scope.services[i].typeString = "Autre"
                			break
                		default :
                			$scope.services[i].typeString = "Undefined"
                	}
                }
                $scope.loading = false
            }, function(error){
            	$scope.loading = false
                ErrorHandler.alert(error);
            });
        };
        $scope.update();

		/*
		*  ouverture de la vue modale pour l'édition et la crétion
		*/
		$scope.open = function(service, type) {

			//Préparation des paramètres de la fenêtre
			var modalInstance = $uibModal.open({
			    backdrop: true,
			    keyboard: true,
			    size:'lg',
			    // Url du template HTML
			    templateUrl: 'app/components/admin_services/modal/edit_service.html',

			    resolve: {
			        //On passe à la fenêtre modal une référence vers le scope parent.
			        service: function() {
			            return service;
			        },
			        type: function() {
			        	return type;
			        }
			    },

			    //Controller de la fenêtre. Il doit prend en paramètre tous les élèments du "resolve".
			    controller: 'editServiceCtrl'
			})
			modalInstance.result.then(function() {
	            $scope.update();
	        })
		};
	}

});
